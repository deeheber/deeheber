const fs = require('fs');
const Parser = require('rss-parser');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const parser = new Parser();
 
(async () => {
  const readme = await readFile('README.md', 'utf8');
  const feed = await parser.parseURL('https://www.danielleheberling.xyz/rss.xml');
 
  const postData = feed.items.map(post => {
    const { title, link } = post;
    return { title, link };
  });

  // Limit to most recent three posts
  let updates = '';
  for (let i = 0; i < 3; i++) {
    const { link, title } = postData[i];
    const row = `- [${title}](${link})\n`;
    updates = updates.concat(row);
  }

  // TODO: Rewrite readme with new feed content
})();