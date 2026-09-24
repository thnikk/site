import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'

function lastCommitYear() {
	try {
		return execSync(
			'git log -1 --format=%cd --date=format:%Y HEAD',
			{ encoding: 'utf8' }
		).trim()
	} catch {
		return String(new Date().getFullYear())
	}
}

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

// Injects the year of the last commit into the footer, with the full commit
// date as a tooltip on the span
const footerYearPlugin = {
	name: 'vite:footer-year',
	transformIndexHtml(html) {
		const year = lastCommitYear()
		const date = lastCommitDate()
		return html.replace(
			'<span>thnikk &hearts;&#xFE0E; <script>document.write(new Date().getFullYear())</script></span>',
			`<span${date ? ` title="Last updated ${date}"` : ''}>thnikk &hearts;&#xFE0E; ${year}</span>`
		)
	},
}

export default defineConfig({
	plugins: [footerYearPlugin],
	server: {
		host: '0.0.0.0',
		port: 5124,
	},
})