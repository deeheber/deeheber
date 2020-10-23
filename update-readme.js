const fs = require('fs');
const Parser = require('rss-parser');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const parser = new Parser();
 
(async () => {
  // Get three latest posts from my blog
  const feed = await parser.parseURL('https://www.danielleheberling.xyz/rss.xml');

  const postData = feed.items.map(post => {
    const { title, link } = post;
    return { title, link };
  });

  let updates = `<!-- start latest posts -->\n`;
  for (let i = 0; i < 3; i++) {
    const { link, title } = postData[i];
    const row = `- [${title}](${link})\n`;

    console.log(`Post #${i + 1} found. Title: ${title} Link: ${link}\n`);
    updates = updates.concat(row);
  }
  updates = updates.concat('<!-- end latest posts -->');

  // Rewrite README with new post content
  const currentText = await readFile('README.md', 'utf8');
  const postsSection = /<!-- start latest posts -->[\s\S]*<!-- end latest posts -->/g;
  const newText = currentText.replace(postsSection, updates)

  await writeFile('README.md', newText);
})();