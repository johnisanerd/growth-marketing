const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '..', 'research', 'linkedin-posts');

function parsePostBlock(block) {
  // Extract URL from **URL:** line
  const urlMatch = block.match(/\*\*URL:\*\*\s*(https?:\/\/\S+)/);
  const url = urlMatch ? urlMatch[1].trim() : '';

  // Extract JSON blob
  const jsonMatch = block.match(/(\{[\s\S]*?\})\s*$/);
  if (!jsonMatch) return null;

  let data;
  try { data = JSON.parse(jsonMatch[1]); } catch { return null; }

  const headline   = (data.headline || '').trim();
  const postType   = (data.postType || '').trim();
  const date       = data.datePublished ? new Date(data.datePublished).toISOString().split('T')[0] : 'unknown';
  const likes      = data.likeCount ?? '';
  const postUrl    = data.postUrl || url || '';

  return { headline, postType, date, likes, postUrl };
}

function formatFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Extract header section (everything before first ## Post)
  const headerMatch = raw.match(/^([\s\S]*?)(?=## Post 1)/);
  const headerRaw = headerMatch ? headerMatch[1] : '';

  // Extract author name from header
  const nameMatch = headerRaw.match(/# LinkedIn Posts — (.+)/);
  const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
  const profileMatch = headerRaw.match(/\*\*Profile:\*\*\s*(https?:\/\/\S+)/);
  const profile = profileMatch ? profileMatch[1].trim() : '';
  const dateMatch = headerRaw.match(/\*\*Scraped:\*\*\s*(\S+)/);
  const scraped = dateMatch ? dateMatch[1] : '';

  // Split into post blocks
  const blocks = raw.split(/(?=## Post \d+)/).filter(b => b.startsWith('## Post'));

  const posts = blocks.map(block => parsePostBlock(block)).filter(Boolean);

  // Build clean markdown
  const lines = [
    `# LinkedIn Posts — ${name}`,
    '',
    `**Profile:** ${profile}`,
    `**Scraped:** ${scraped}`,
    `**Posts collected:** ${posts.length}`,
    '',
    '---',
    '',
  ];

  posts.forEach((p, i) => {
    lines.push(`## Post ${i + 1} — ${p.date}`);
    if (p.headline)  lines.push(`**Title:** ${p.headline}`);
    if (p.postType)  lines.push(`**Type:** ${p.postType}`);
    if (p.likes !== '') lines.push(`**Likes:** ${p.likes}`);
    if (p.postUrl)   lines.push(`**URL:** ${p.postUrl}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.md') && f !== '.gitkeep');

files.forEach(file => {
  const filePath = path.join(INPUT_DIR, file);
  try {
    const formatted = formatFile(filePath);
    fs.writeFileSync(filePath, formatted, 'utf-8');
    console.log(`[OK] ${file}`);
  } catch (e) {
    console.error(`[FAIL] ${file}: ${e.message}`);
  }
});

console.log('\nDone.');
