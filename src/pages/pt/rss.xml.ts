import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const factpacks = await getCollection('factpacks_pt', ({ data }) => !data.draft);
  const sortedFactpacks = factpacks.sort(
    (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
  );

  return rss({
    title: 'Source Check - Verificação de Factos',
    description: 'Verificação de factos baseada em evidências. Encontramos os documentos, você decide.',
    site: context.site || 'https://source-check.org',
    items: sortedFactpacks.map((fp) => ({
      title: fp.data.title,
      description: fp.data.summary,
      pubDate: fp.data.publishedDate,
      link: `/pt/facts/${fp.id}`,
    })),
    customData: '<language>pt-pt</language>',
  });
}
