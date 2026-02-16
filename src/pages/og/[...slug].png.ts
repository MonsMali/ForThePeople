import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const fontPath = join(process.cwd(), 'src', 'fonts', 'Inter-Regular.ttf');
const fontBuffer = readFileSync(fontPath);
const fontData = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);

const verdictColors: Record<string, string> = {
  false: '#dc2626',
  misleading: '#d97706',
  'missing-context': '#2563eb',
  mixed: '#7c3aed',
  true: '#16a34a',
};

const verdictLabels: Record<string, Record<string, string>> = {
  en: {
    false: 'FALSE',
    misleading: 'MISLEADING',
    'missing-context': 'MISSING CONTEXT',
    mixed: 'MIXED',
    true: 'CONFIRMED',
  },
  pt: {
    false: 'FALSO',
    misleading: 'ENGANOSO',
    'missing-context': 'FALTA CONTEXTO',
    mixed: 'MISTO',
    true: 'CONFIRMADO',
  },
};

export const getStaticPaths: GetStaticPaths = async () => {
  const enPacks = await getCollection('factpacks_en');
  const ptPacks = await getCollection('factpacks_pt');

  const paths = [
    ...enPacks.map((fp) => ({
      params: { slug: `${fp.data.translationKey}-en` },
      props: {
        claim: fp.data.claim,
        verdict: fp.data.verdict,
        verdictSummary: fp.data.verdictSummary,
        title: fp.data.title,
        lang: 'en' as const,
      },
    })),
    ...ptPacks.map((fp) => ({
      params: { slug: `${fp.data.translationKey}-pt` },
      props: {
        claim: fp.data.claim,
        verdict: fp.data.verdict,
        verdictSummary: fp.data.verdictSummary,
        title: fp.data.title,
        lang: 'pt' as const,
      },
    })),
    // Default OG image
    {
      params: { slug: 'default' },
      props: {
        claim: 'Politicians lie to you. Here are the documents.',
        verdict: 'misleading' as const,
        verdictSummary: 'Decide for yourself.',
        title: 'ForThePeople',
        lang: 'en' as const,
      },
    },
  ];

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const { claim, verdict, verdictSummary, title, lang } = props as {
    claim: string;
    verdict: string;
    verdictSummary: string;
    title: string;
    lang: 'en' | 'pt';
  };

  const color = verdictColors[verdict] || '#6b7280';
  const label = verdictLabels[lang]?.[verdict] || verdict.toUpperCase();
  const siteName = 'ForThePeople';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1a1a1a',
          padding: '60px',
          fontFamily: 'Inter',
        },
        children: [
          // Top: Site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      color: '#ffffff',
                      fontSize: '24px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    },
                    children: siteName,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      color: color,
                      fontSize: '32px',
                      fontWeight: 700,
                      backgroundColor: `${color}22`,
                      padding: '8px 24px',
                      borderRadius: '8px',
                      letterSpacing: '0.1em',
                      border: `3px solid ${color}`,
                    },
                    children: label,
                  },
                },
              ],
            },
          },
          // Middle: Claim
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                flex: 1,
                justifyContent: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#ffffff',
                      fontSize: claim.length > 100 ? '32px' : '40px',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      letterSpacing: '-0.02em',
                    },
                    children: `"${claim}"`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#9ca3af',
                      fontSize: '24px',
                      lineHeight: 1.4,
                    },
                    children: verdictSummary,
                  },
                },
              ],
            },
          },
          // Bottom: tagline
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid #374151',
                paddingTop: '20px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    color: '#6b7280',
                    fontSize: '18px',
                  },
                  children: lang === 'pt'
                    ? 'Eles acham que somos burros. Aqui estão as provas.'
                    : "They think you're stupid. Here are the receipts.",
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
