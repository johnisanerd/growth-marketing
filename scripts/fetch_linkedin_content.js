const fs = require('fs');
const path = require('path');

const APIFY_TOKEN = process.env.APIFY_TOKEN || '';
const ACTOR_ID = 'johnvc~linkedin-posts-api';
const POSTS_DIR = path.join(__dirname, '..', 'research', 'linkedin-posts');

async function fetchArticleContent(urls) {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=120`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postUrls: urls }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const items = await res.json();
  // Map postUrl/text to the key/bodyText fields used below
  return items.map(item => ({
    ...item,
    key: (item.postUrl || '').replace(/\/$/, '').split('/').pop(),
    bodyText: item.text,
  }));
}

function extractPostUrls(mdContent) {
  const urls = [];
  const blocks = mdContent.split(/(?=## Post \d+)/);
  for (const block of blocks) {
    const typeMatch = block.match(/\*\*Type:\*\*\s*(\S+)/);
    const urlMatch = block.match(/\*\*URL:\*\*\s*(https?:\/\/\S+)/);
    if (urlMatch) urls.push({ url: urlMatch[1].trim(), type: typeMatch?.[1] || '' });
  }
  return urls;
}

function injectContent(mdContent, contentMap) {
  return mdContent.replace(
    /(## Post \d+ —[\s\S]*?\*\*URL:\*\*\s*(https?:\/\/\S+))([\s\S]*?)(?=## Post \d+|$)/g,
    (match, header, url, rest) => {
      const key = url.replace(/\/$/, '').split('/').pop();
      const article = contentMap[key] || contentMap[url];
      if (!article || !article.bodyText) return match;
      const content = article.bodyText.trim();
      // Replace existing content block or add after URL line
      const cleaned = rest.replace(/\n\*\*Content:\*\*[\s\S]*?(?=\n---|\n## |$)/, '');
      return `${header}\n**Content:**\n\n${content}\n${cleaned}`;
    }
  );
}

async function processFile(filePath) {
  const name = path.basename(filePath, '.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const posts = extractPostUrls(content);

  const articleUrls = posts
    .filter(p => p.url.includes('linkedin.com/pulse'))
    .map(p => p.url);

  if (articleUrls.length === 0) {
    console.log(`[SKIP] ${name} — no Article URLs`);
    return 0;
  }

  console.log(`[→] ${name}: fetching ${articleUrls.length} articles...`);

  try {
    // Batch in groups of 5 to avoid timeouts
    const results = [];
    for (let i = 0; i < articleUrls.length; i += 5) {
      const batch = articleUrls.slice(i, i + 5);
      const data = await fetchArticleContent(batch);
      results.push(...data);
      if (i + 5 < articleUrls.length) await new Promise(r => setTimeout(r, 1000));
    }

    // Build lookup map by URL key
    const contentMap = {};
    for (const item of results) {
      if (item.key) contentMap[item.key] = item;
      if (item.url) contentMap[item.url.replace(/\/$/, '')] = item;
    }

    const updated = injectContent(content, contentMap);
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`[OK] ${name}: injected content for ${results.filter(r => r.bodyText).length} articles`);
    return results.filter(r => r.bodyText).length;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    return 0;
  }
}

async function main() {
  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => path.join(POSTS_DIR, f));

  console.log(`Processing ${files.length} LinkedIn post files...\n`);

  let total = 0;
  for (const file of files) {
    total += await processFile(file);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone. Injected content into ${total} articles total.`);
}

main();
