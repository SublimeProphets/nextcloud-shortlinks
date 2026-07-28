import { readFile, readdir } from 'node:fs/promises'
import { extname, join } from 'node:path'

async function files(directory) {
	const result = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) result.push(...await files(path))
		else if (['.ts', '.vue'].includes(extname(entry.name))) result.push(path)
	}
	return result
}

const catalog = JSON.parse(await readFile('l10n/de.json', 'utf8')).translations
const used = new Set()
for (const file of await files('src')) {
	const source = await readFile(file, 'utf8')
	for (const match of source.matchAll(/\bt\(\s*['"]shortlinks['"]\s*,\s*['"]([^'"]+)['"]/g)) used.add(match[1])
}
const missing = [...used].filter(key => !Object.hasOwn(catalog, key)).sort()
if (missing.length) {
	console.error(`Missing German translations:\n${missing.join('\n')}`)
	process.exitCode = 1
} else {
	console.log(`German catalog covers ${used.size} statically referenced source strings`)
}
