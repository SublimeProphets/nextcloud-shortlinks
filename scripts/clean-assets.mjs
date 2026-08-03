import { readdir, unlink } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
for (const [directory, extensions] of [['js', new Set(['.mjs', '.map'])], ['css', new Set(['.css', '.map'])]]) {
	const target = resolve(projectRoot, directory)
	if (dirname(target) !== projectRoot) throw new Error(`Refusing unexpected asset directory: ${target}`)
	for (const entry of await readdir(target, { withFileTypes: true })) {
		if (entry.isFile() && extensions.has(extname(entry.name)) && entry.name !== 'public-page.css') await unlink(join(target, entry.name))
	}
}
