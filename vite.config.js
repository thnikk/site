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

// Injects the year of the last commit into the footer placeholders
const footerYearPlugin = {
	name: 'vite:footer-year',
	transformIndexHtml(html) {
		return html.replace(
			'<script>document.write(new Date().getFullYear())</script>',
			lastCommitYear()
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