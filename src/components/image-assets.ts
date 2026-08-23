/**
 * Central registry of all site images, so MDX content (and AstroCMS) can
 * reference photos by path instead of static imports.
 *
 * AstroCMS writes image props as paths relative to the MDX file, e.g.
 * "../../assets/images/foo.png" for existing assets or "./images/bar.webp"
 * for files uploaded through the CMS (which land in the content directory).
 * `resolveImagePath()` maps such a path to an eagerly imported asset, so
 * pages still render with Astro's image optimization.
 */

const assetImages = import.meta.glob(
  "../assets/**/*.{png,jpg,jpeg,webp,gif,avif}",
  { eager: true, import: "default" },
);

// Images uploaded through AstroCMS are stored in the content directory.
const contentImages = import.meta.glob(
  "../content/**/*.{png,jpg,jpeg,webp,gif,avif}",
  { eager: true, import: "default" },
);

export const siteImages: Record<string, any> = {
  ...assetImages,
  ...contentImages,
};

/** Strip leading "./" and "../" segments from a relative path. */
function normalize(p: string): string {
  return p.replace(/^(\.\.?\/)+/, "");
}

/**
 * Resolve a CMS image path (relative to the MDX file) to an imported asset.
 * Matches by exact normalized path, then by suffix — so "../../assets/images/foo.png"
 * (from src/content/pages/) matches the glob key "../assets/images/foo.png".
 * Returns null when no image matches, so components can skip rendering.
 */
export function resolveImagePath(imagePath?: string): any | null {
  if (!imagePath) return null;
  const target = normalize(imagePath.trim());
  if (!target) return null;

  for (const [key, asset] of Object.entries(siteImages)) {
    const normalized = normalize(key);
    if (normalized === target || normalized.endsWith(`/${target}`)) {
      return asset;
    }
  }
  return null;
}
