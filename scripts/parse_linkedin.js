const fs = require('fs');
const path = require('path');

function parseLinkedInData(inputFilePath) {
  try {
    const rawData = fs.readFileSync(inputFilePath, 'utf-8');
    const posts = JSON.parse(rawData);
    
    const outputDir = path.join(__dirname, '..', 'research', 'linkedin-posts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    posts.forEach(post => {
      const author = post.author ? post.author.replace(/[^a-zA-Z0-9]/g, '_') : 'Unknown_Author';
      const date = post.date || new Date().toISOString().split('T')[0];
      const content = post.text || '';
      
      const outputPath = path.join(outputDir, `${author}.md`);
      
      const markdownContent = `\n## Post Date: ${date}\n\n${content}\n\n---\n`;
      
      // Append to the specific author's file
      fs.appendFileSync(outputPath, markdownContent, 'utf-8');
    });
    
    console.log(`Successfully parsed LinkedIn data into ${outputDir}`);
  } catch (error) {
    console.error('Failed to parse LinkedIn data:', error);
  }
}

// Example usage
const inputFile = path.join(__dirname, '..', 'raw_linkedin_data.json');
if (fs.existsSync(inputFile)) {
  parseLinkedInData(inputFile);
} else {
  console.log(`Input file not found at ${inputFile}`);
}
