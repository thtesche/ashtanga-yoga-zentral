import { Image } from "astro:assets";

/**
 * Auto-discover all .astro components in this folder (recursively).
 * They are made available to MDX content via `<Content components={mdxComponents} />`
 * and must stay in sync with `componentsDir` in astrocms.json (what the CMS
 * shows in its MDX editor). Drop a new .astro file into this directory and it
 * becomes usable in MDX at both build time and in the CMS, with no wiring.
 */
const modules = import.meta.glob("./**/*.astro", { eager: true });

export const mdxComponents: Record<string, any> = {
  // Astro's Image component so MDX can use <Image> without an import.
  // Listed first so a local Image.astro in this folder would take precedence.
  Image,
  ...Object.fromEntries(
    Object.entries(modules)
      // Skip pure modules without a default export (e.g. i18n-config.astro).
      .filter(([, mod]) => (mod as any).default != null)
      .map(([path, mod]) => [
        path.split("/").pop()!.replace(".astro", ""),
        (mod as any).default,
      ]),
  ),
};
