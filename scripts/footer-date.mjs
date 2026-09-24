import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const FILES = ['index.html', 'about.html']
const SPAN = /(<span[^>]*>)(thnikk &hearts;&#xFE0E; <script>document\.write\(new Date\(\)\.getFullYear\(\)\)<\/script><\/span>)/

function lastCommitDate() {
	try {
		return execSync(
			'git log -1 --format=%cd --date=format:%Y-%m-%d HEAD',
			{ encoding: 'utf8' }
		).trim()
	} catch {
		return ''
	}
}

const date = lastCommitDate()
if (!date) {
	console.error('Could not determine last commit date')
	process.exit(1)
}

for (const file of FILES) {
	let html = readFileSync(file, 'utf8')

	if (!SPAN.test(html)) {
		console.error(`Footer span not found in ${file}`)
		continue
	}

	html = html.replace(SPAN, (_, open, rest) => {
		// Drop any existing build-date title, then add the current one
		const clean = open.replace(/\s+title="Last updated [^"]*"/, '')
		const tagged = clean.replace(/^<span/, `<span title="Last updated ${date}"`)
		return tagged + rest
	})

	writeFileSync(file, html)
	console.log(`Updated ${file} -> Last updated ${date}`)
}