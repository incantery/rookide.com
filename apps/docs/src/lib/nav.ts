export type NavItem = { slug: string; title: string; order: number };
type Mod = { frontmatter?: { title?: string; order?: number } };

export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(md|svx)$/, '');
}

export function buildNav(files: Record<string, Mod>): NavItem[] {
  const items = Object.entries(files).map(([path, mod]) => {
    const slug = slugFromPath(path);
    return {
      slug,
      title: mod.frontmatter?.title ?? titleFromSlug(slug),
      order: mod.frontmatter?.order ?? 999
    };
  });
  return items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
