/**
 * Normalize content MDX files to match exactly what AstroCMS produces when it
 * saves a document.
 *
 * The CMS editor is a whole-document editor (@mdxeditor/editor / Lexical): it
 * re-serializes the entire body on every save and re-writes the frontmatter
 * via yaml. This script reproduces that pipeline headlessly so the reformat
 * can be applied once — after that, CMS edits cause zero diff noise.
 *
 * Usage (run from the project root):
 *   node --import tsx scripts/normalize-mdx-cms.mjs          # write files
 *   node --import tsx scripts/normalize-mdx-cms.mjs --check  # dry run (no writes)
 *
 * Requires `tsx` and the installed `astrocms` package (both present).
 */
import { readFile, writeFile, readdir } from 'fs/promises'
import { join, relative, resolve } from 'path'
import { fileURLToPath } from 'url'

const scriptDir = resolve(fileURLToPath(import.meta.url), '..')
const projectRoot = resolve(scriptDir, '..')

// The CMS resolves its root via ASTROCMS_ROOT (or cwd) at import time, so set
// it before loading the backend parser modules.
process.env.ASTROCMS_ROOT = projectRoot

const {
  extractRawFrontmatter,
  extractBody,
  parseFrontmatterYaml,
  combineFrontmatterAndBody,
} = await import('astrocms/shared/frontmatter.js')
const { scanComponents } = await import('astrocms/backend/parsers/components.js')
const ed = await import('@mdxeditor/editor')

const CHECK = process.argv.includes('--check')
const onlyRel = process.argv
  .filter((a) => a.endsWith('.mdx'))
  .map((a) => a.replace(/^\.\//, ''))

// ── AstroCMS helpers (mirror FrontmatterEditor, pure) ────────────
const ESM_LINE_RE = /^(import\s|export\s)/
function extractEsmLines(body) {
  const lines = body.split('\n')
  const esmLines = []
  let splitAt = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (ESM_LINE_RE.test(line)) {
      esmLines.push(line)
      splitAt = i + 1
    } else if (line.trim() === '') {
      continue
    } else {
      break
    }
  }
  return {
    esm: esmLines.join('\n'),
    content: lines.slice(splitAt).join('\n').replace(/^\n+/, ''),
  }
}

const combineEsmAndContent = (esm, content) =>
  esm ? esm + '\n\n' + content : content

// ── JSX descriptors (mirror useComponents.buildDescriptors) ──────
const components = await scanComponents()
const jsxDescriptors = components.map(({ name, props, slots }) => ({
  name,
  kind: 'flow',
  props: props.map((p) => ({
    name: p.name,
    type: p.type === 'json' ? 'expression' : 'string',
  })),
  hasChildren: slots.length > 0,
  Editor: undefined, // Headless: the UI delegate is irrelevant for import/export.
}))
// Fragment is always registered by the CMS frontend.
jsxDescriptors.push({
  name: 'Fragment',
  kind: 'flow',
  props: [{ name: 'slot', type: 'string' }],
  hasChildren: true,
  Editor: undefined,
})

// ── Headless MDXEditor round-trip (mirror the CMS plugin set) ────
function roundtrip(body) {
  const realm = new ed.Realm()
  const plugins = [
    ed.corePlugin({
      contentEditableClassName: '',
      spellCheck: true,
      initialMarkdown: body,
      onChange: () => {},
      onBlur: () => {},
      toMarkdownOptions: { listItemIndent: 'one' },
      autoFocus: false,
      placeholder: '',
      readOnly: false,
      suppressHtmlProcessing: false,
      trim: true,
      suppressSharedHistory: false,
    }),
    ed.headingsPlugin(),
    ed.listsPlugin(),
    ed.linkPlugin(),
    ed.imagePlugin(),
    ed.tablePlugin(),
    ed.thematicBreakPlugin(),
    ed.quotePlugin(),
    ed.markdownShortcutPlugin(),
    ed.codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
    ed.jsxPlugin({ jsxComponentDescriptors: jsxDescriptors }),
  ]
  for (const p of plugins) p.init?.(realm)
  for (const p of plugins) p.postInit?.(realm)
  return realm.getValue(ed.markdown$)
}

/** Byte-exact replica of the CMS save: frontmatter + ESM + body. */
function cmsSave(content) {
  const data = parseFrontmatterYaml(extractRawFrontmatter(content))
  const { esm, content: body } = extractEsmLines(extractBody(content))
  const normalized = roundtrip(body)
  return combineFrontmatterAndBody(data, combineEsmAndContent(esm, normalized))
}

// ── File walking ──────────────────────────────────────────────────
async function globFiles(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await globFiles(p)))
    else if (e.name.endsWith('.mdx')) out.push(p)
  }
  return out
}

async function main() {
  const files = await globFiles(join(projectRoot, 'src/content'))
  const targets = onlyRel.length
    ? onlyRel.map((r) => resolve(projectRoot, r))
    : files
  const unknown = targets.filter((t) => !files.includes(t))
  if (unknown.length) {
    console.error('No such MDX files:', unknown.join(', '))
    process.exit(1)
  }

  let changed = 0
  for (const file of targets) {
    const before = await readFile(file, 'utf-8')
    const after = cmsSave(before)
    if (after === before) continue
    changed++
    console.log(relative(projectRoot, file).replace(/\\/g, '/'))
    if (CHECK) {
      console.log('  -> would normalize %d bytes to %d bytes', before.length, after.length)
    } else {
      await writeFile(file, after)
    }
  }
  console.log(
    changed
      ? `${changed} file(s) ${CHECK ? 'would be normalized' : 'normalized'}`
      : 'No differences.',
  )
}

await main()