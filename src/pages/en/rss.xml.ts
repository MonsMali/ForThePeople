import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const factpacks = await getCollection('factpacks_en', ({ data }) => !data.draft);
  const sortedFactpacks = factpacks.sort(
    (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
  );

  return rss({
    title: 'Source Check - Fact-Checked Claims',
    description: 'Evidence-based fact-checking. We find the documents, you decide.',
    site: context.site || 'https://source-check.org',
    items: sortedFactpacks.map((fp) => ({
      title: fp.data.title,
      description: fp.data.summary,
      pubDate: fp.data.publishedDate,
      link: `/en/facts/${fp.id}`,
    })),
    customData: '<language>en-us</language>',
  });
}
