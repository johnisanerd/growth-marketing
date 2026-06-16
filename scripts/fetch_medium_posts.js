const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'research', 'other', 'medium');

// Expert profiles + topic tags via Medium RSS (free, no API key needed)
const sources = [
  // Expert profiles
  { name: 'David Spinks',    slug: 'david-spinks',    rss: 'https://medium.com/feed/@davidspinks' },
  { name: 'Rosie Sherry',   slug: 'rosie-sherry',    rss: 'https://medium.com/feed/@rosiesherry' },
  { name: 'Jono Bacon',     slug: 'jono-bacon',      rss: 'https://medium.com/feed/@jonobacon' },
  { name: 'Erica Kuhl',     slug: 'erica-kuhl',      rss: 'https://medium.com/feed/@ericakuhl' },
  { name: 'Patrick Woods',  slug: 'patrick-woods',   rss: 'https://medium.com/feed/@patrickjwoods' },
  { name: 'Brian Oblinger', slug: 'brian-oblinger',  rss: 'https://medium.com/feed/@brianoblinger' },
  { name: 'Jake McKee',     slug: 'jake-mckee',      rss: 'https://medium.com/feed/@jakemckee' },
  { name: 'Gina Bianchini', slug: 'gina-bianchini',  rss: 'https://medium.com/feed/@ginabianchini' },
  { name: 'Dani Grant',     slug: 'dani-grant',      rss: 'https://medium.com/feed/@danigrant' },
  { name: 'Whitney Rothe',  slug: 'whitney-rothe',   rss: 'https://medium.com/feed/@wkrothe' },

  // Topic tags — pulls latest articles on the subject from all authors
  { name: 'TAG — Community Led Growth',  slug: 'tag-community-led-growth',  rss: 'https://medium.com/feed/tag/community-led-growth' },
  { name: 'TAG — Community Building',    slug: 'tag-community-building',    rss: 'https://medium.com/feed/tag/community-building' },
  { name: 'TAG — B2B SaaS',             slug: 'tag-b2b-saas',              rss: 'https://medium.com/feed/tag/b2b-saas' },
  { name: 'TAG — Developer Community',   slug: 'tag-developer-community',   rss: 'https://medium.com/feed/tag/developer-community' },
  { name: 'TAG — Online Community',      slug: 'tag-online-community',      rss: 'https://medium.com/feed/tag/online-community' },

  // Publications
  { name: 'PUB — CMX Hub',              slug: 'pub-cmx-hub',               rss: 'https://medium.com/feed/cmx-hub' },
  { name: 'PUB — Better Marketing',     slug: 'pub-better-marketing',      rss: 'https://medium.com/feed/better-marketing' },
  { name: 'PUB — The Startup',          slug: 'pub-the-startup',           rss: 'https://medium.com/feed/swlh' },
];

function parseRSS(xml) {
  const items = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const title    = get('title');
    const link     = get('link') || block.match(/<link\/>([^<]*)/)?.[1]?.trim() || '';
    const pubDate  = get('pubDate');
    const author   = get('dc:creator') || get('author');
    const cats     = [...block.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)].map(m => m[1]);
    // Strip HTML from content
    const rawContent = get('content:encoded') || get('description');
    const text = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000);

    if (title) items.push({ title, link, pubDate, author, categories: cats, text });
  }
  return items;
}

function formatMd(source, items) {
  const header = [
    `# Medium Articles — ${source.name}`,
    '',
    `**Source:** ${source.rss.replace('/feed', '')}`,
    `**Scraped:** ${new Date().toISOString().split('T')[0]}`,
    `**Articles collected:** ${items.length}`,
    '',
    '---',
    '',
  ].join('\n');

  const body = items.map((a, i) => [
    `## ${i + 1}. ${a.title}`,
    a.author    ? `**Author:** ${a.author}`                         : '',
    a.pubDate   ? `**Date:** ${a.pubDate}`                          : '',
    a.link      ? `**URL:** ${a.link}`                              : '',
    a.categories.length ? `**Tags:** ${a.categories.join(', ')}` : '',
    '',
    a.text || '_No text extracted_',
    '',
    '---',
  ].filter(l => l !== '').join('\n')).join('\n\n');

  return header + body;
}

async function fetchSource(source) {
  process.stdout.write(`[→] ${source.name} ... `);
  try {
    const res = await fetch(source.rss, {
      headers: { 'User-Agent': 'Mozilla/5.0 (research bot)' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseRSS(xml);
    if (items.length === 0) {
      console.log('[WARN] no articles');
      return { name: source.name, status: 'empty', count: 0 };
    }
    const md = formatMd(source, items);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${source.slug}.md`), md, 'utf-8');
    console.log(`[OK] ${items.length} articles`);
    return { name: source.name, status: 'ok', count: items.length };
  } catch (err) {
    console.log(`[FAIL] ${err.message}`);
    return { name: source.name, status: 'fail', error: err.message };
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  // Clear previous broken results
  fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.md')).forEach(f =>
    fs.unlinkSync(path.join(OUTPUT_DIR, f))
  );

  console.log(`Fetching Medium RSS for ${sources.length} sources...\n`);

  const results = [];
  for (const source of sources) {
    results.push(await fetchSource(source));
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n=== Summary ===');
  results.forEach(r => {
    if (r.status === 'ok')    console.log(`  ✓ ${r.name}: ${r.count} articles`);
    if (r.status === 'empty') console.log(`  - ${r.name}: no articles`);
    if (r.status === 'fail')  console.log(`  ✗ ${r.name}: ${r.error}`);
  });
  console.log(`\nDone: ${results.filter(r=>r.status==='ok').length}/${sources.length} succeeded.`);
}

main();
