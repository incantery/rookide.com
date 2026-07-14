import { describe, expect, it } from 'vitest';
import { buildMeta } from './seo';

describe('buildMeta', () => {
  it('produces title, description, canonical, and OG/Twitter tags', () => {
    const m = buildMeta({
      title: 'rook — agent-native IDE',
      description: 'An experiment in what comes next.',
      url: 'https://rookide.com/',
      image: 'https://rookide.com/og.png'
    });
    expect(m.title).toBe('rook — agent-native IDE');
    const byKey = (k: string, v: string) => m.tags.find((t) => t.name === v || t.property === v);
    expect(byKey('name', 'description')?.content).toBe('An experiment in what comes next.');
    expect(byKey('property', 'og:title')?.content).toBe('rook — agent-native IDE');
    expect(byKey('property', 'og:image')?.content).toBe('https://rookide.com/og.png');
    expect(byKey('name', 'twitter:card')?.content).toBe('summary_large_image');
    expect(m.canonical).toBe('https://rookide.com/');
  });
});
