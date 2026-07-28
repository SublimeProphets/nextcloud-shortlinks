import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

describe('accessible table fallback', () => {
	it('has no serious accessibility violations', async () => {
		document.documentElement.lang = 'en'
		document.title = 'Shortlinks accessibility fixture'
		document.body.innerHTML = '<main><h1>Shortlinks</h1><table><caption>Click statistics</caption><thead><tr><th scope="col">Day</th><th scope="col">Clicks</th></tr></thead><tbody><tr><td>2026-07-28</td><td>2</td></tr></tbody></table></main>'
		const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false } } })
		expect(result.violations).toEqual([])
	})
})
