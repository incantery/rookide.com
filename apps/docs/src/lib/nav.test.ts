import { describe, expect, it } from 'vitest';
import { buildNav, titleFromSlug } from './nav';

describe('titleFromSlug', () => {
  it('converts kebab-case to Title Case', () => {
    expect(titleFromSlug('getting-started')).toBe('Getting Started');
  });
});

describe('buildNav', () => {
  it('derives slug from path, sorts by order then title, falls back to slug title', () => {
    const nav = buildNav({
      '/content/configuration.md': { frontmatter: { title: 'Configuration', order: 2 } },
      '/content/install.md': { frontmatter: { title: 'Install', order: 1 } },
      '/content/architecture.md': {}
    });
    expect(nav.map((n) => n.slug)).toEqual(['install', 'configuration', 'architecture']);
    expect(nav[0].title).toBe('Install');
    expect(nav[2].title).toBe('Architecture');
  });
});
