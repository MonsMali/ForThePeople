import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'evidence');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const WIDTH = 1200;
const HEIGHT = 800;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxCharsPerLine) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function buildDocumentSvg({ header, headerColor, body, docType, reference, stamp, stampColor }) {
  const bodyLines = [];
  for (const paragraph of body) {
    const wrapped = wrapText(paragraph, 70);
    bodyLines.push(...wrapped, '');
  }

  const bodyTextElements = bodyLines.map((line, i) => {
    const y = 230 + i * 28;
    if (y > HEIGHT - 120) return '';
    return `<text x="140" y="${y}" font-family="Georgia, serif" font-size="18" fill="#2c3e50">${esc(line)}</text>`;
  }).join('\n    ');

  const stampEl = stamp ? `
    <g transform="translate(850, 350) rotate(-12)">
      <rect x="-100" y="-35" width="200" height="70" rx="8" fill="none" stroke="${stampColor || '#dc2626'}" stroke-width="4" opacity="0.8"/>
      <text x="0" y="10" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="${stampColor || '#dc2626'}" font-weight="bold" opacity="0.8">${esc(stamp)}</text>
    </g>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e8e6e0"/>
      <stop offset="100%" stop-color="#d4d0c8"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="3" dy="3" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="80" y="40" width="1040" height="720" rx="4" fill="#fff" stroke="#b0aea5" stroke-width="1" filter="url(#shadow)"/>

  <!-- Header bar -->
  <rect x="80" y="40" width="1040" height="80" fill="${headerColor || '#1a365d'}"/>
  <text x="120" y="88" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" opacity="0.7" letter-spacing="3">${esc(docType || 'OFFICIAL DOCUMENT')}</text>
  <text x="120" y="110" font-family="Georgia, serif" font-size="20" fill="#ffffff" font-weight="bold">${esc(header)}</text>

  <!-- Reference line -->
  <line x1="120" y1="155" x2="1080" y2="155" stroke="#e0ddd5" stroke-width="1"/>
  <text x="120" y="175" font-family="monospace" font-size="13" fill="#8b8b7a">${esc(reference || '')}</text>
  <line x1="120" y1="195" x2="1080" y2="195" stroke="#e0ddd5" stroke-width="1"/>

  <!-- Body text -->
  ${bodyTextElements}

  <!-- Stamp overlay -->
  ${stampEl}

  <!-- Footer -->
  <line x1="120" y1="${HEIGHT - 80}" x2="1080" y2="${HEIGHT - 80}" stroke="#e0ddd5" stroke-width="1"/>
  <text x="600" y="${HEIGHT - 50}" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#a0a0a0">Source document archived by source-check.org</text>
</svg>`;
}

const placeholders = [
  // === bondi-epstein-testimony ===
  {
    filename: 'bondi-transcript-p45.png',
    header: 'U.S. Senate Judiciary Committee — Confirmation Hearing',
    headerColor: '#1a365d',
    docType: 'CONGRESSIONAL TRANSCRIPT',
    reference: 'Hearing Date: January 15, 2025 | Page 45 of 127 | Witness: Pam Bondi, AG Nominee',
    body: [
      'SENATOR DURBIN: Ms. Bondi, will you commit to releasing the Epstein files in full?',
      'MS. BONDI: Senator, I take this matter very seriously. If confirmed, I will review all materials and ensure that justice is served.',
      'SENATOR DURBIN: That is not a yes or a no. Will you release them?',
      'MS. BONDI: I will follow the evidence wherever it leads. I have no intention of protecting anyone.',
      'SENATOR DURBIN: Again, Ms. Bondi, a simple yes or no—',
      'MS. BONDI: I will review the matter fully and take appropriate action consistent with Department of Justice guidelines and ongoing investigations.',
      '[Note: At no point during the hearing did the nominee provide an unequivocal commitment to full public release.]',
    ],
  },
  {
    filename: 'doj-section-9-27-220.png',
    header: 'Justice Manual — Principles of Federal Prosecution',
    headerColor: '#4a1a2e',
    docType: 'U.S. DEPARTMENT OF JUSTICE',
    reference: 'Section 9-27.220 | Grounds for Commencing or Declining Prosecution | Rev. 2024',
    body: [
      '9-27.220 — Grounds for Commencing or Declining Prosecution',
      '',
      'The attorney for the government should commence or recommend federal prosecution if:',
      '(1) the attorney believes that the person\'s conduct constitutes a federal offense; and',
      '(2) the admissible evidence will probably be sufficient to obtain and sustain a conviction.',
      '',
      'Comment: Evidence sufficient to sustain a conviction is distinguished from evidence that merely',
      'suggests criminal activity. The standard requires a reasonable belief that the evidence, when',
      'presented at trial, would be sufficient for a reasonable jury to find guilt beyond reasonable doubt.',
      '',
      'The distinction between "evidence of wrongdoing" and "prosecutable evidence" is critical.',
      'A prosecutor may possess substantial evidence of misconduct while concluding that the',
      'admissible evidence falls short of the standard required for conviction.',
    ],
  },
  {
    filename: 'florida-epstein-2006.png',
    header: 'State Attorney\'s Office, 15th Judicial Circuit — Case Summary',
    headerColor: '#2d4a1a',
    docType: 'FLORIDA STATE RECORDS',
    reference: 'Case No. 2006-CF-009350 | Palm Beach County | State v. Epstein | Filed: 2006',
    body: [
      'CASE SUMMARY — STATE OF FLORIDA v. JEFFREY E. EPSTEIN',
      '',
      'Charges filed: Multiple counts of unlawful sexual activity with a minor',
      'Investigation lead: Palm Beach Police Department',
      'Referred to: State Attorney Barry Krischer',
      'Subsequently referred to: U.S. Attorney\'s Office, Southern District of Florida',
      '',
      'DISPOSITION: Federal Non-Prosecution Agreement (NPA) executed 2007.',
      'Defendant pleaded to state charges (2 counts solicitation of prostitution).',
      'Sentence: 18 months county jail, registered sex offender.',
      '',
      'NOTABLE: Attorney General of Florida (2011-2019) Pam Bondi held no prosecutorial',
      'authority over this case. Federal NPA was executed prior to her tenure.',
      'No evidence of direct involvement in the 2006-2008 proceedings.',
    ],
  },

  // === congress-healthcare-exemption ===
  {
    filename: 'aca-section-1312.png',
    header: 'Patient Protection and Affordable Care Act',
    headerColor: '#1a365d',
    docType: 'PUBLIC LAW 111-148 — U.S. CODE',
    reference: 'Section 1312(d)(3)(D) | Members of Congress in the Exchange | 42 U.S.C. §18032',
    body: [
      'SEC. 1312. CONSUMER CHOICE.',
      '',
      '(d) MEMBERS OF CONGRESS IN THE EXCHANGE.—',
      '',
      '(3)(D) MEMBERS OF CONGRESS IN THE EXCHANGE.—',
      '',
      'Notwithstanding chapter 89 of title 5, United States Code, or any other provision of law,',
      'after the effective date of this subtitle—',
      '',
      '(i) the only health plans that the Federal Government may make available to Members of',
      'Congress and congressional staff with respect to their service as a Member of Congress or',
      'congressional staff shall be health plans that are—',
      '',
      '(I) created under this Act (or an amendment made by this Act); or',
      '(II) offered through an Exchange established under this Act.',
      '',
      '[Congress is REQUIRED to use ACA marketplace plans — not exempt from them.]',
    ],
  },
  {
    filename: 'crs-report-r43194.png',
    header: 'Congressional Research Service — Report for Congress',
    headerColor: '#5a3a1a',
    docType: 'CRS REPORT R43194',
    reference: 'Health Benefits for Members of Congress | Updated: January 2025 | Ada S. Cornell, Analyst',
    body: [
      'HEALTH BENEFITS FOR MEMBERS OF CONGRESS AND DESIGNATED STAFF',
      '',
      'Summary: Under Section 1312(d)(3)(D) of the ACA, Members of Congress and',
      'designated congressional staff are required to obtain health insurance coverage',
      'through the Small Business Health Options Program (SHOP) exchange established',
      'in the District of Columbia, known as DC Health Link.',
      '',
      'Key Findings:',
      '• Members of Congress ARE required to use ACA marketplace plans',
      '• The Federal Government continues employer contributions (as with all FEHB)',
      '• This employer contribution is NOT an "exemption" — it mirrors standard',
      '  employer-sponsored insurance contributions in the private sector',
      '• Prior to the ACA, Members participated in the FEHB program',
      '• The Grassley Amendment (Sen. Charles Grassley, R-IA) specifically',
      '  required congressional participation in ACA exchanges',
    ],
  },

  // === eu-budget-bureaucracy ===
  {
    filename: 'eu-mff-2021-2027.png',
    header: 'Multiannual Financial Framework 2021-2027',
    headerColor: '#003399',
    docType: 'EUROPEAN UNION — COUNCIL REGULATION (EU) 2020/2093',
    reference: 'Official Journal of the European Union | L 433 I/11 | 22 December 2020',
    body: [
      'HEADING ALLOCATION (2021-2027, commitment appropriations, 2018 prices):',
      '',
      '1. Single Market, Innovation and Digital ......... EUR 132,781 million (14.7%)',
      '2. Cohesion, Resilience and Values ............... EUR 377,768 million (35.2%)',
      '   of which: Economic, social and territorial',
      '   cohesion ...................................... EUR 330,235 million',
      '3. Natural Resources and Environment ............. EUR 356,374 million (31.0%)',
      '   of which: Market related expenditure and',
      '   direct payments ................................ EUR 258,594 million',
      '4. Migration and Border Management ............... EUR 22,671 million',
      '5. Security and Defence .......................... EUR 13,185 million',
      '6. Neighbourhood and the World ................... EUR 98,419 million (9.2%)',
      '7. European Public Administration ................ EUR 73,102 million (6.0%)',
      '',
      'TOTAL: EUR 1,074,300 million | Administration = 6.0% of total',
    ],
  },
  {
    filename: 'eca-annual-2024.png',
    header: 'European Court of Auditors — Annual Report 2024',
    headerColor: '#003399',
    docType: 'EUROPEAN COURT OF AUDITORS',
    reference: 'Annual Report on the Implementation of the EU Budget — Financial Year 2024',
    body: [
      'CHAPTER 10 — ADMINISTRATION',
      '',
      'Key Findings:',
      '',
      '10.1 Administration expenditure represents approximately 6% of the',
      'EU budget and covers all EU institutions: European Commission,',
      'European Parliament, Council, Court of Justice, and Court of Auditors.',
      '',
      '10.2 Administrative expenditure covers:',
      '  — Staff remuneration and pensions',
      '  — Buildings and associated costs',
      '  — IT and telecommunications',
      '  — Translation and interpretation (24 official languages)',
      '',
      '10.3 The Court found the level of error in administrative expenditure',
      'to be below the materiality threshold of 2%. Administration remains',
      'the heading with the lowest error rate in the EU budget.',
      '',
      '10.4 The EU institutions serve 450 million citizens across 27 Member States.',
    ],
  },

  // === portugal-crime-immigration ===
  {
    filename: 'rasi-2024-overview.png',
    header: 'Relatório Anual de Segurança Interna — RASI 2024',
    headerColor: '#1a4a2a',
    docType: 'REPÚBLICA PORTUGUESA — SISTEMA DE SEGURANÇA INTERNA',
    reference: 'Gabinete do Secretário-Geral | Criminalidade Geral | Dados consolidados 2024',
    body: [
      'CAPÍTULO III — CRIMINALIDADE PARTICIPADA',
      '',
      'Quadro-resumo da criminalidade geral registada pelas forças de segurança:',
      '',
      '  2019: 335.067 participações',
      '  2020: 298.457 participações (-10,9% — efeito pandemia COVID-19)',
      '  2021: 300.886 participações (+0,8%)',
      '  2022: 319.025 participações (+6,0%)',
      '  2023: 312.877 participações (-1,9%)',
      '  2024: 294.741 participações (-5,8%)',
      '',
      'Variação 2019-2024: -12,0%',
      '',
      'Nota: A criminalidade geral registada diminuiu 12% face ao período',
      'de referência de 2019, confirmando uma tendência global de descida,',
      'não obstante variações em categorias específicas.',
    ],
  },
  {
    filename: 'sef-residents-2024.png',
    header: 'Cidadãos Estrangeiros Residentes em Portugal',
    headerColor: '#1a4a2a',
    docType: 'SEF/AIMA — SERVIÇO DE ESTRANGEIROS E FRONTEIRAS',
    reference: 'Relatório de Imigração, Fronteiras e Asilo 2024 | Dados provisórios',
    body: [
      'EVOLUÇÃO DA POPULAÇÃO ESTRANGEIRA RESIDENTE',
      '',
      'Títulos de residência válidos a 31 de dezembro de cada ano:',
      '',
      '  2019: 590.348 cidadãos estrangeiros residentes',
      '  2020: 662.095 (+12,1%)',
      '  2021: 698.887 (+5,6%)',
      '  2022: 781.915 (+11,9%)',
      '  2023: 893.454 (+14,3%)',
      '  2024: 1.044.606 (+16,9%) [estimativa]',
      '',
      'Principais nacionalidades (2024):',
      '  1. Brasil: 382.104',
      '  2. Índia: 78.522',
      '  3. Cabo Verde: 62.811',
      '  4. Angola: 48.637',
      '  5. Reino Unido: 45.093',
      '',
      'Portugal registou um aumento significativo da imigração legal no período.',
    ],
  },
  {
    filename: 'pordata-crime-2024.png',
    header: 'Crimes Registados Pelas Polícias — Série Temporal',
    headerColor: '#c45d1a',
    docType: 'PORDATA — BASE DE DADOS PORTUGAL CONTEMPORÂNEO',
    reference: 'Fonte: DGPJ/MJ | Última atualização: 2025-03-15 | Indicador: Crimes registados (Total)',
    body: [
      'CRIMES REGISTADOS PELAS AUTORIDADES POLICIAIS (Total)',
      '',
      '  2015: 330.872',
      '  2016: 330.314',
      '  2017: 341.950',
      '  2018: 333.223',
      '  2019: 335.067',
      '  2020: 298.457',
      '  2021: 300.886',
      '  2022: 319.025',
      '  2023: 312.877',
      '  2024: 294.741',
      '',
      'Nota metodológica: Dados provenientes da Direção-Geral da Política',
      'de Justiça (DGPJ). Incluem crimes registados pela PSP, GNR e PJ.',
      'A série temporal mostra uma tendência geral de descida desde 2017,',
      'com exceção do período de recuperação pós-COVID (2021-2022).',
    ],
  },

  // === nato-spending-europe ===
  {
    filename: 'nato-expenditure-2024.png',
    header: 'Defence Expenditure of NATO Countries (2014-2024)',
    headerColor: '#003366',
    docType: 'NATO — SECRETARY GENERAL ANNUAL REPORT 2024',
    reference: 'Table 3 — Defence expenditure as a share of GDP (%) | Published: March 2025',
    body: [
      'NATO DEFENCE EXPENDITURE AS % OF GDP — SELECTED ALLIES',
      '',
      '                          2014    2020    2024(e)',
      '  United States           3.73    3.74    3.38',
      '  United Kingdom          2.15    2.33    2.33',
      '  France                  1.82    2.01    2.06',
      '  Germany                 1.18    1.56    2.12',
      '  Poland                  1.85    2.31    4.12',
      '  Spain                   0.92    1.02    1.28',
      '  Italy                   1.14    1.54    1.49',
      '  Netherlands             1.15    1.45    2.05',
      '',
      'Members meeting 2% target: 3 of 28 (2014) → 23 of 32 (2024)',
      '',
      'Total European NATO defence spending (constant 2015 prices):',
      '  2014: USD 250 billion | 2024: USD 380 billion (+52%)',
    ],
  },
  {
    filename: 'nato-wales-2014.png',
    header: 'Wales Summit Declaration — Defence Investment Pledge',
    headerColor: '#003366',
    docType: 'NATO OFFICIAL TEXTS',
    reference: 'Issued by the Heads of State and Government | Newport, Wales | 5 September 2014',
    body: [
      'WALES SUMMIT DECLARATION',
      '',
      'Paragraph 14:',
      '',
      '"Allies whose current proportion of GDP spent on defence is below this',
      'guideline will: halt any decline in defence expenditure; aim to increase',
      'defence expenditure in real terms as GDP grows; aim to move towards the',
      '2% guideline within a decade with a view to meeting their NATO',
      'Capability Targets and filling NATO\'s capability shortfalls."',
      '',
      'Key language: "AIM TO MOVE TOWARDS" — not "must achieve"',
      'Timeline: "within a decade" — i.e., by 2024',
      'Nature: Political commitment — not a treaty obligation',
      '',
      'Context: Adopted in response to Russia\'s annexation of Crimea (2014)',
      'and increased security concerns on NATO\'s eastern flank.',
    ],
  },
  {
    filename: 'sipri-milex-2024.png',
    header: 'Military Expenditure Database — European NATO States',
    headerColor: '#6a1a1a',
    docType: 'STOCKHOLM INTERNATIONAL PEACE RESEARCH INSTITUTE (SIPRI)',
    reference: 'SIPRI Military Expenditure Database | April 2025 release | Constant (2022) USD',
    body: [
      'EUROPEAN NATO MILITARY EXPENDITURE — TRENDS',
      '',
      'Total European NATO spending (constant 2022 USD millions):',
      '',
      '  2014:  278,450',
      '  2016:  283,120',
      '  2018:  298,340',
      '  2020:  305,870',
      '  2022:  345,210',
      '  2024:  402,680 (estimated)',
      '',
      'Real increase 2014-2024: +44.6%',
      '',
      'Note: European allies have increased defence spending in each',
      'consecutive year since 2015. The largest year-on-year increase',
      'occurred between 2022 and 2023 (+12.3%), driven by the security',
      'implications of Russia\'s full-scale invasion of Ukraine.',
      '',
      'SIPRI data is independently compiled and peer-reviewed.',
    ],
  },
];

for (const item of placeholders) {
  const svg = buildDocumentSvg({
    header: item.header,
    headerColor: item.headerColor,
    docType: item.docType,
    reference: item.reference,
    body: item.body,
    stamp: item.stamp,
    stampColor: item.stampColor,
  });
  const outputPath = join(OUTPUT_DIR, item.filename);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log('Created:', item.filename);
}

console.log(`\nDone. Generated ${placeholders.length} evidence images.`);
