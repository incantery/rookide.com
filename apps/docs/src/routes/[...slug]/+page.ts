import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';

const modules = import.meta.glob('/content/*.md');

export const prerender = true;

export const entries: EntryGenerator = () =>
  Object.keys(modules).map((p) => ({
    slug: (p.split('/').pop() ?? '').replace(/\.md$/, '')
  }));

export async function load({ params }) {
  const path = `/content/${params.slug}.md`;
  const loader = modules[path];
  if (!loader) throw error(404, `No doc: ${params.slug}`);
  const mod: any = await loader();
  return { component: mod.default, title: mod.metadata?.title ?? params.slug, slug: params.slug };
}
