const fs = require('fs');
const path = require('path');

const API_KEY = process.env.SUPADATA_API_KEY || 'sd_48da4eb576a280d4d9d11d5c0ccf1621';

const videoUrls = [
  "https://www.youtube.com/watch?v=vEhM3Nrsz9s",
  "https://www.youtube.com/watch?v=o2-3GYvmLyA",
  "https://www.youtube.com/watch?v=6Jn1gGqee3I",
  "https://www.youtube.com/watch?v=xhp7qy5dWWc",
  "https://www.youtube.com/watch?v=ODliamqOg04",
  "https://www.youtube.com/watch?v=UWW9DXlt6nM",
  "https://www.youtube.com/watch?v=AuoQno2yGcY",
  "https://www.youtube.com/watch?v=qquI98xoqXw",
  "https://www.youtube.com/watch?v=0PX7ULEa7d8",
  "https://www.youtube.com/watch?v=NHSpL3OPQJM",
  "https://www.youtube.com/watch?v=k4wkiqpdQ_c",
  "https://www.youtube.com/watch?v=-2hUPbi-sW4"
];

const outputDir = path.join(__dirname, '..', 'research', 'youtube-transcripts');

async function fetchTranscript(youtubeUrl) {
  const urlObj = new URL(youtubeUrl);
  const videoId = urlObj.searchParams.get('v') || 'unknown';

  try {
    const response = await fetch(
      `https://api.supadata.ai/v1/youtube/transcript?url=${encodeURIComponent(youtubeUrl)}`,
      {
        method: 'GET',
        headers: { 'x-api-key': API_KEY }
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body}`);
    }

    const data = await response.json();

    // Supadata returns { content: [{text, offset, duration},...], lang, ... }
    let transcriptText;
    if (Array.isArray(data.content)) {
      transcriptText = data.content.map(seg => seg.text).join(' ');
    } else if (typeof data.content === 'string') {
      transcriptText = data.content;
    } else {
      transcriptText = JSON.stringify(data, null, 2);
    }

    const header = `# YouTube Transcript\n\n**Video ID:** ${videoId}\n**URL:** ${youtubeUrl}\n**Lang:** ${data.lang || 'unknown'}\n\n---\n\n`;
    const outputPath = path.join(outputDir, `${videoId}.md`);
    fs.writeFileSync(outputPath, header + transcriptText, 'utf-8');
    console.log(`[OK] ${videoId} -> ${outputPath}`);
    return { videoId, status: 'ok' };
  } catch (err) {
    console.error(`[FAIL] ${videoId}: ${err.message}`);
    return { videoId, status: 'fail', error: err.message };
  }
}

async function main() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const urls = process.argv[2] ? [process.argv[2]] : videoUrls;
  console.log(`Fetching transcripts for ${urls.length} video(s)...\n`);

  const results = [];
  for (const url of urls) {
    const result = await fetchTranscript(url);
    results.push(result);
    // Small delay to be kind to the API
    await new Promise(r => setTimeout(r, 500));
  }

  const ok = results.filter(r => r.status === 'ok').length;
  const fail = results.filter(r => r.status === 'fail').length;
  console.log(`\nDone: ${ok} succeeded, ${fail} failed.`);
}

main();
