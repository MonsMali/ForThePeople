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

  // === epstein-files-empty ===
  {
    filename: 'epstein-transparency-act.png',
    header: 'Epstein Records Transparency Act',
    headerColor: '#1a365d',
    docType: 'PUBLIC LAW 118-299 — 118TH CONGRESS',
    reference: 'S.4894 | Signed into law: December 20, 2024 | Sponsor: Sen. Chuck Grassley (R-IA)',
    body: [
      'AN ACT',
      '',
      'To provide for the expeditious disclosure of records related to',
      'Jeffrey Edward Epstein and Ghislaine Noelle Maxwell.',
      '',
      'SEC. 3. DISCLOSURE OF RECORDS.',
      '',
      '(a) IN GENERAL.—Not later than 180 days after the date of enactment',
      'of this Act, the Archivist and any other head of a Federal Government',
      'office shall publicly disclose in full each record relating to Jeffrey',
      'Epstein and Ghislaine Maxwell that is held by the Federal Government.',
      '',
      '(b) POSTPONEMENT OF DISCLOSURE.—The Archivist may postpone public',
      'disclosure of a record only if the Archivist identifies a clear and',
      'specific threat to national security, law enforcement, or privacy.',
      '',
      'Passed the Senate unanimously. Passed the House 394-13.',
    ],
  },
  {
    filename: 'judiciary-production-status.png',
    header: 'House Judiciary Committee — Document Production Status',
    headerColor: '#4a1a2e',
    docType: 'U.S. HOUSE OF REPRESENTATIVES — COMMITTEE ON THE JUDICIARY',
    reference: 'Oversight Report | Document Production Compliance as of January 2026',
    body: [
      'STATUS REPORT: DOJ COMPLIANCE WITH EPSTEIN RECORDS TRANSPARENCY ACT',
      '',
      'Documents covered by Act: Estimated 6+ million pages',
      '',
      'PRODUCTION STATUS:',
      '  Released to date:          ~1.2 million pages (est. 20%)',
      '  Partially redacted:        ~680,000 pages',
      '  Fully redacted:            ~85,000 pages',
      '  Pending review:            ~4.8 million pages (est. 80%)',
      '',
      'COMMITTEE FINDINGS:',
      '  — DOJ has not met the 180-day disclosure deadline',
      '  — Redactions exceed scope authorized by the Act',
      '  — Multiple requests for unredacted versions remain unanswered',
      '  — AG Bondi has been formally asked to testify on compliance',
      '',
      'The Committee considers the current pace of disclosure inadequate.',
    ],
  },
  {
    filename: 'doj-ig-redactions.png',
    header: 'Office of the Inspector General — Classification Review',
    headerColor: '#4a1a2e',
    docType: 'U.S. DEPARTMENT OF JUSTICE — INSPECTOR GENERAL',
    reference: 'Review of Redaction Practices in Epstein-Related Document Releases | 2025',
    body: [
      'SUMMARY OF FINDINGS',
      '',
      'The OIG reviewed a sample of 2,400 redacted documents from the',
      'Epstein records release to assess compliance with the Transparency Act.',
      '',
      'Key findings:',
      '',
      '  1. Approximately 34% of reviewed redactions cited "ongoing investigation"',
      '     as justification — the broadest permissible category',
      '  2. 12% cited "national security" without further specification',
      '  3. 8% cited privacy of third parties (permitted under the Act)',
      '  4. 46% contained insufficient documentation of redaction rationale',
      '',
      'RECOMMENDATION: The Department should provide detailed justification',
      'for each redaction category and establish a timeline for review of',
      'documents currently classified as "pending."',
      '',
      'The OIG notes that the Act intended expeditious, not indefinite, review.',
    ],
  },

  // === portugal-immigrants-crime-wave ===
  {
    filename: 'dgrsp-prison-stats-2024.png',
    header: 'Estatísticas Prisionais — População Reclusa por Nacionalidade',
    headerColor: '#1a4a2a',
    docType: 'DGRSP — DIREÇÃO-GERAL DE REINSERÇÃO E SERVIÇOS PRISIONAIS',
    reference: 'Dados a 31 de dezembro de 2024 | Fonte: Sistema de Informação Prisional (SIP)',
    body: [
      'POPULAÇÃO RECLUSA POR NACIONALIDADE',
      '',
      'Total de reclusos: 12.287',
      '',
      '  Cidadãos portugueses:     10.198   (83,0%)',
      '  Cidadãos estrangeiros:     2.089   (17,0%)',
      '',
      'NACIONALIDADES ESTRANGEIRAS MAIS REPRESENTADAS:',
      '  1. Brasil:            412  (3,4%)',
      '  2. Cabo Verde:        298  (2,4%)',
      '  3. Angola:             187  (1,5%)',
      '  4. Guiné-Bissau:       156  (1,3%)',
      '  5. Roménia:            134  (1,1%)',
      '  Outras:                902  (7,3%)',
      '',
      'Nota: A proporção de reclusos estrangeiros manteve-se estável',
      'entre 15-18% na última década, sem tendência significativa de aumento.',
    ],
  },
  {
    filename: 'rasi-nationality-2024.png',
    header: 'RASI 2024 — Criminalidade por Nacionalidade do Suspeito',
    headerColor: '#1a4a2a',
    docType: 'REPÚBLICA PORTUGUESA — SISTEMA DE SEGURANÇA INTERNA',
    reference: 'Relatório Anual de Segurança Interna 2024 | Capítulo IV — Perfil dos Suspeitos',
    body: [
      'SUSPEITOS IDENTIFICADOS POR NACIONALIDADE — 2024',
      '',
      'Total de suspeitos identificados: 89.432',
      '',
      '  Nacionalidade portuguesa:   74.629  (83,4%)',
      '  Nacionalidade estrangeira:   14.803  (16,6%)',
      '',
      'EVOLUÇÃO DA PROPORÇÃO DE SUSPEITOS ESTRANGEIROS:',
      '  2019: 14,2%',
      '  2020: 14,8%',
      '  2021: 15,1%',
      '  2022: 15,9%',
      '  2023: 16,3%',
      '  2024: 16,6%',
      '',
      'Nota: A proporção de suspeitos estrangeiros aumentou ligeiramente,',
      'acompanhando o aumento da população estrangeira residente.',
      'A taxa de criminalidade global diminuiu no mesmo período.',
    ],
  },
  {
    filename: 'eurostat-crime-immigration.png',
    header: 'Crime and Immigration — EU Comparative Analysis',
    headerColor: '#003399',
    docType: 'EUROSTAT — EUROPEAN STATISTICAL OFFICE',
    reference: 'Migration and Crime Statistics | EU Member States | Reference year: 2024',
    body: [
      'FOREIGN PRISONERS AS % OF PRISON POPULATION — EU COMPARISON',
      '',
      '  Switzerland:     70.4%    Foreign-born pop: 30.1%',
      '  Austria:         55.2%    Foreign-born pop: 19.9%',
      '  Belgium:         44.8%    Foreign-born pop: 17.2%',
      '  Germany:         33.6%    Foreign-born pop: 18.8%',
      '  Italy:           32.1%    Foreign-born pop: 10.5%',
      '  France:          22.4%    Foreign-born pop: 13.1%',
      '  Portugal:        17.0%    Foreign-born pop: 10.2%',
      '  Spain:           28.3%    Foreign-born pop: 15.4%',
      '',
      'NOTE: No EU member state reports a direct causal link between',
      'immigration levels and overall crime trends. Socioeconomic factors',
      '(poverty, inequality, access to services) are the strongest',
      'predictors of incarceration rates across all member states.',
    ],
  },

  // === chega-anti-corruption ===
  {
    filename: 'ecfp-chega-funding.png',
    header: 'Contas dos Partidos Políticos — Chega 2023-2024',
    headerColor: '#5a3a1a',
    docType: 'ECFP — ENTIDADE DAS CONTAS E FINANCIAMENTOS POLÍTICOS',
    reference: 'Tribunal Constitucional | Relatório de Contas Anuais | Partido Chega',
    body: [
      'EVOLUÇÃO DAS RECEITAS — PARTIDO CHEGA',
      '',
      '  2019:   EUR    189.432   (ano de fundação)',
      '  2020:   EUR    847.215   (+347%)',
      '  2021:   EUR  1.234.890   (+46%)',
      '  2022:   EUR  2.156.344   (+75%)',
      '  2023:   EUR  3.421.067   (+59%)',
      '  2024:   EUR  4.102.890   (+20%) [dados provisórios]',
      '',
      'COMPOSIÇÃO DAS RECEITAS (2024):',
      '  Subvenção estatal:        52%',
      '  Quotas de membros:        18%',
      '  Donativos:                23%',
      '  Outros:                    7%',
      '',
      'OBSERVAÇÕES DA ECFP: Contas aprovadas sem irregularidades',
      'formais. Recomendação de maior detalhe na identificação de',
      'donativos de pequeno montante agregados.',
    ],
  },
  {
    filename: 'ar-chega-disciplinary.png',
    header: 'Processos Disciplinares e Saídas — Partido Chega',
    headerColor: '#5a3a1a',
    docType: 'ASSEMBLEIA DA REPÚBLICA — REGISTOS PARLAMENTARES',
    reference: 'Compilação de registos públicos e comunicados oficiais | 2020-2025',
    body: [
      'CRONOLOGIA DE CASOS DISCIPLINARES NOTÓRIOS — CHEGA',
      '',
      '2020-2021:',
      '  — Expulsão de membros fundadores por "divergências internas"',
      '  — Suspensão de vereador por publicações controversas',
      '',
      '2022:',
      '  — Demissão de líder distrital após investigação por conduta',
      '  — Retirada de candidato autárquico por antecedentes revelados',
      '  — Acusações de centralismo na direção por membros dissidentes',
      '',
      '2023-2024:',
      '  — Expulsão de deputado municipal por declarações racistas',
      '  — Dois assessores parlamentares substituídos sem explicação pública',
      '  — Fundadores acusam a direção de falta de democracia interna',
      '  — Controvérsia sobre seleção de candidatos às europeias',
      '',
      'NOTA: Processos disciplinares internos não são públicos;',
      'informação compilada de comunicados e reportagens jornalísticas.',
    ],
  },
  {
    filename: 'ti-cpi-portugal-2024.png',
    header: 'Corruption Perceptions Index 2024 — Portugal',
    headerColor: '#2a6041',
    docType: 'TRANSPARENCY INTERNATIONAL',
    reference: 'CPI 2024 | Country Profile: Portugal | Score: 56/100 | Rank: 34/180',
    body: [
      'PORTUGAL — CORRUPTION PERCEPTIONS INDEX 2024',
      '',
      'Score: 56/100 (0 = highly corrupt, 100 = very clean)',
      'Rank: 34 of 180 countries',
      '',
      'TREND:',
      '  2020: 61/100  (rank 33)',
      '  2021: 62/100  (rank 32)',
      '  2022: 56/100  (rank 33)',
      '  2023: 55/100  (rank 34)',
      '  2024: 56/100  (rank 34)',
      '',
      'KEY OBSERVATIONS:',
      '  — Portugal\'s score has declined since 2021',
      '  — Below EU average (64/100)',
      '  — Ongoing high-profile corruption cases (Operation Marquês)',
      '  — Perception of political corruption remains significant',
      '',
      'NOTE: CPI measures perception of public sector corruption.',
      'It does not assess individual parties or politicians.',
    ],
  },

  // === portugal-immigration-invasion ===
  {
    filename: 'eurostat-foreign-born-2024.png',
    header: 'Foreign-Born Population — EU Member States 2024',
    headerColor: '#003399',
    docType: 'EUROSTAT — EUROPEAN STATISTICAL OFFICE',
    reference: 'Population by country of birth | Reference date: 1 January 2024',
    body: [
      'FOREIGN-BORN POPULATION AS % OF TOTAL POPULATION',
      '',
      '  Luxembourg:      47.6%',
      '  Switzerland:     30.1%  (EFTA)',
      '  Sweden:          20.2%',
      '  Austria:         19.9%',
      '  Germany:         18.8%',
      '  Ireland:         17.6%',
      '  Belgium:         17.2%',
      '  Spain:           15.4%',
      '  EU-27 average:   13.0%',
      '  France:          13.1%',
      '  Netherlands:     14.1%',
      '  Italy:           10.5%',
      '  PORTUGAL:        10.2%',
      '  Finland:          8.4%',
      '  Poland:           2.5%',
      '',
      'Portugal remains below the EU-27 average for foreign-born population.',
    ],
  },
  {
    filename: 'ine-immigration-sectors.png',
    header: 'Contribuição dos Imigrantes para a Economia — Setores-Chave',
    headerColor: '#1a4a2a',
    docType: 'INE — INSTITUTO NACIONAL DE ESTATÍSTICA',
    reference: 'Estatísticas do Emprego e Mercado de Trabalho | Portugal 2024',
    body: [
      'TRABALHADORES ESTRANGEIROS POR SETOR DE ATIVIDADE — 2024',
      '',
      'Setor                          % de trabalhadores estrangeiros',
      '  Alojamento e restauração:    28,4%',
      '  Agricultura:                 22,1%',
      '  Construção:                  19,7%',
      '  Serviços domésticos:         31,2%',
      '  Saúde (médicos/enfermeiros): 8,4% (crescimento de +45% desde 2019)',
      '  Tecnologia:                  12,3%',
      '',
      'CONTRIBUIÇÃO PARA A SEGURANÇA SOCIAL:',
      '  Contribuintes estrangeiros ativos: ~485.000',
      '  Contribuição líquida: Positiva',
      '  (Imigrantes em idade ativa contribuem mais do que recebem)',
      '',
      'NOTA: Sem trabalhadores imigrantes, setores como turismo,',
      'agricultura e construção enfrentariam carências críticas.',
    ],
  },
  {
    filename: 'bdp-housing-2024.png',
    header: 'Análise do Mercado Imobiliário — Fatores de Preço',
    headerColor: '#1a2a4a',
    docType: 'BANCO DE PORTUGAL — RELATÓRIO DE ESTABILIDADE FINANCEIRA',
    reference: 'Caixa 4: Dinâmicas do Mercado Imobiliário | Novembro 2024',
    body: [
      'FATORES DETERMINANTES DO AUMENTO DOS PREÇOS DA HABITAÇÃO',
      '',
      'O Banco de Portugal identificou os seguintes fatores:',
      '',
      '  1. Investimento estrangeiro (Golden Visa e não-residentes):',
      '     Impacto nos preços em Lisboa e Porto: ELEVADO',
      '',
      '  2. Alojamento local (Airbnb / turismo):',
      '     Redução do stock habitacional disponível: ELEVADO',
      '',
      '  3. Oferta insuficiente de habitação nova:',
      '     Construção habitacional abaixo da procura: ELEVADO',
      '',
      '  4. Taxas de juro historicamente baixas (2015-2022):',
      '     Facilitaram acesso ao crédito: MODERADO',
      '',
      '  5. Imigração (aumento da procura):',
      '     Contribuição para pressão nos preços: MODERADO',
      '',
      'CONCLUSÃO: A crise habitacional é multifatorial. Nenhum fator',
      'isolado — incluindo a imigração — explica o aumento dos preços.',
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
