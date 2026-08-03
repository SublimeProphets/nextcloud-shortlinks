import { describe, expect, it } from 'vitest'
import { defaultPageTheme, findPageTheme, pageFonts, pageFontStack, pageThemes, themeValues } from '../../../src/pageThemes'

describe('page themes', () => {
	it('offers four distinct presets and uses Nextcloud by default', () => {
		expect(pageThemes).toHaveLength(4)
		expect(new Set(pageThemes.map(theme => theme.preset)).size).toBe(4)
		expect(defaultPageTheme.preset).toBe('nextcloud')
		expect(findPageTheme('modern').primary).toBe('#8b5cf6')
	})

	it('offers twenty safe local font stacks', () => {
		expect(pageFonts).toHaveLength(20)
		expect(pageFontStack('georgia')).toContain('Georgia')
		expect(pageFontStack('unknown')).toBe(pageFonts[0]!.stack)
	})

	it('returns an editable theme value without presentation metadata', () => {
		const value = themeValues(pageThemes[3]!)
		expect(value).toEqual(expect.objectContaining({ preset: 'editorial', baseSize: 17, scale: 105 }))
		expect(value).not.toHaveProperty('label')
		expect(value).not.toHaveProperty('description')
	})
})
