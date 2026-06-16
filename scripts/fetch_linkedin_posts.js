const fs = require('fs');
const path = require('path');

const APIFY_TOKEN = process.env.APIFY_TOKEN || '';
const ACTOR_ID = 'automation-lab~linkedin-post-scraper';
const OUTPUT_DIR = path.join(__dirname, '..', 'research', 'linkedin-posts');

// Experts for Community-Led Growth for B2B SaaS
const experts = [
  { name: 'David Spinks',        slug: 'david-spinks',        url: 'https://www.linkedin.com/in/davidspinks' },
  { name: 'Rosie Sherry',        slug: 'rosie-sherry',        url: 'https://www.linkedin.com/in/rosiesherry' },
  { name: 'Jono Bacon',          slug: 'jono-bacon',          url: 'https://www.linkedin.com/in/jonobacon' },
  { name: 'Erica Kuhl',          slug: 'erica-kuhl',          url: 'https://www.linkedin.com/in/ericakuhl' },
  { name: 'Derek Anderson',      slug: 'derek-anderson',      url: 'https://www.linkedin.com/in/derekanderson' },
  { name: 'Steph Smith',         slug: 'steph-smith',         url: 'https://www.linkedin.com/in/stephsmithio' },
  { name: 'Whit Rhoda',          slug: 'whit-rhoda',          url: 'https://www.linkedin.com/in/whitrhoda' },
  { name: 'Megan Demenna',       slug: 'megan-demenna',       url: 'https://www.linkedin.com/in/megandemenna' },
  { name: 'Jacob Peters',        slug: 'jacob-peters',        url: 'https://www.linkedin.com/in/jacobpeters' },
  { name: 'Mack Redden',         slug: 'mack-redden',         url: 'https://www.linkedin.com/in/mackredden' },
];

async function runActor(profileUrl) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=270`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileUrls: [profileUrl],
        maxPostCount: 20,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  return res.json();
}

function formatPostsMd(expert, posts) {
  const header = `# LinkedIn Posts — ${expert.name}\n\n**Profile:** ${expert.url}\n**Scraped:** ${new Date().toISOString().split('T')[0]}\n**Posts collected:** ${posts.length}\n\n---\n\n`;

  const body = posts.map((post, i) => {
    const date = post.date || post.postedAt || post.publishedAt || 'unknown date';
    const text = post.text || post.content || post.postText || JSON.stringify(post);
    const postUrl = post.url || post.postUrl || post.link || '';
    const reactions = post.totalReactionCount ?? post.reactions ?? post.likesCount ?? '';
    const comments = post.commentsCount ?? post.comments ?? '';

    return [
      `## Post ${i + 1} — ${date}`,
      postUrl ? `**URL:** ${postUrl}` : '',
      reactions !== '' ? `**Reactions:** ${reactions}` : '',
      comments !== '' ? `**Comments:** ${comments}` : '',
      '',
      text.trim(),
      '',
      '---',
    ].filter(line => line !== null).join('\n');
  }).join('\n\n');

  return header + body;
}

async function scrapeExpert(expert) {
  console.log(`\n[→] Scraping ${expert.name} (${expert.url})`);
  try {
    const posts = await runActor(expert.url);

    if (!Array.isArray(posts) || posts.length === 0) {
      console.log(`[WARN] ${expert.name}: No posts returned`);
      return { name: expert.name, status: 'empty', count: 0 };
    }

    const md = formatPostsMd(expert, posts);
    const outPath = path.join(OUTPUT_DIR, `${expert.slug}.md`);
    fs.writeFileSync(outPath, md, 'utf-8');
    console.log(`[OK] ${expert.name}: ${posts.length} posts → ${outPath}`);
    return { name: expert.name, status: 'ok', count: posts.length };
  } catch (err) {
    console.error(`[FAIL] ${expert.name}: ${err.message}`);
    return { name: expert.name, status: 'fail', error: err.message };
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Run sequentially — Apify sync endpoint blocks per request, no need to hammer it
  const results = [];
  for (const expert of experts) {
    const result = await scrapeExpert(expert);
    results.push(result);
    // Brief pause between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n=== Summary ===');
  results.forEach(r => {
    if (r.status === 'ok')    console.log(`  ✓ ${r.name}: ${r.count} posts`);
    if (r.status === 'empty') console.log(`  - ${r.name}: no posts`);
    if (r.status === 'fail')  console.log(`  ✗ ${r.name}: ${r.error}`);
  });

  const ok   = results.filter(r => r.status === 'ok').length;
  const fail = results.filter(r => r.status === 'fail').length;
  console.log(`\nDone: ${ok} succeeded, ${fail} failed.`);
}

main();
