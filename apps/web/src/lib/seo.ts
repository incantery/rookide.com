export type MetaTag = { name?: string; property?: string; content: string };
export type Meta = { title: string; canonical: string; tags: MetaTag[] };

export function buildMeta(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
}): Meta {
  const image = input.image ?? 'https://rookide.com/og.png';
  return {
    title: input.title,
    canonical: input.url,
    tags: [
      { name: 'description', content: input.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'rook' },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:url', content: input.url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: image }
    ]
  };
}
