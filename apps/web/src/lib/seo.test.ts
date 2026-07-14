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
    const byKey = (v: string) => m.tags.find((t) => t.name === v || t.property === v);
    expect(byKey('description')?.content).toBe('An experiment in what comes next.');
    expect(byKey('og:site_name')?.content).toBe('rook');
    expect(byKey('og:title')?.content).toBe('rook — agent-native IDE');
    expect(byKey('og:image')?.content).toBe('https://rookide.com/og.png');
    expect(byKey('twitter:card')?.content).toBe('summary_large_image');
    expect(m.canonical).toBe('https://rookide.com/');
  });

  it('defaults image to the shared og.png when none is provided', () => {
    const m = buildMeta({
      title: 'rook — agent-native IDE',
      description: 'An experiment in what comes next.',
      url: 'https://rookide.com/'
    });
    const byKey = (v: string) => m.tags.find((t) => t.name === v || t.property === v);
    expect(byKey('og:image')?.content).toBe('https://rookide.com/og.png');
    expect(byKey('twitter:image')?.content).toBe('https://rookide.com/og.png');
  });
});
