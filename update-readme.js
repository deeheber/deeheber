import fs from 'fs/promises'
import Parser from 'rss-parser'
const parser = new Parser()

try {
  // Get three latest posts from my blog's RSS feed
  const { items } = await parser.parseURL(
    'https://danielleheberling.xyz/rss.xml',
  )

  let updates = `<!-- start latest posts -->\n`
  for (let i = 0; i < 3; i++) {
    const { isoDate, link, title } = items[i]
    const formattedDate = isoDate.slice(0, 10)
    const row = `- ${formattedDate}: [${title}](${link})\n`

    console.debug(
      `Post #${i + 1} found. Date: ${formattedDate} Title: ${title} Link: ${link}\n`,
    )
    updates = updates.concat(row)
  }
  updates = updates.concat('<!-- end latest posts -->')

  // Rewrite README with new post content
  const currentText = await fs.readFile('README.md', 'utf8')
  const postsSection =
    /<!-- start latest posts -->[\s\S]*<!-- end latest posts -->/g
  const newText = currentText.replace(postsSection, updates)

  await fs.writeFile('README.md', newText)
} catch (error) {
  console.error('there was an error:', error.message)
}
