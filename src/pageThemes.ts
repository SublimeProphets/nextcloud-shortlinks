import type { PageTheme, PageThemePreset } from './types'

export interface PageThemeDefinition extends PageTheme {
	label: string
	description: string
}

export const pageThemes: PageThemeDefinition[] = [
	{
		preset: 'nextcloud',
		label: 'Nextcloud Basic',
		description: 'Familiar, accessible and close to the standard Nextcloud interface.',
		primary: '#0082c9',
		background: '#f5f6f8',
		surface: '#ffffff',
		text: '#222222',
		font: 'system',
		baseSize: 16,
		scale: 100,
	},
	{
		preset: 'neutral',
		label: 'Neutral',
		description: 'Quiet surfaces and balanced spacing that keep content in focus.',
		primary: '#59636e',
		background: '#ffffff',
		surface: '#f4f4f5',
		text: '#222222',
		font: 'system',
		baseSize: 16,
		scale: 100,
	},
	{
		preset: 'modern',
		label: 'Modern',
		description: 'Bold contrast, soft depth and a vibrant contemporary accent.',
		primary: '#8b5cf6',
		background: '#0f172a',
		surface: '#18233b',
		text: '#f8fafc',
		font: 'inter',
		baseSize: 16,
		scale: 105,
	},
	{
		preset: 'editorial',
		label: 'Editorial',
		description: 'Warm paper tones and expressive typography for curated collections.',
		primary: '#b45309',
		background: '#f7f1e8',
		surface: '#fffaf2',
		text: '#2c2118',
		font: 'georgia',
		baseSize: 17,
		scale: 105,
	},
]

export const defaultPageTheme: PageTheme = themeValues(pageThemes[0]!)

export function themeValues(theme: PageThemeDefinition): PageTheme {
	return {
		preset: theme.preset,
		primary: theme.primary,
		background: theme.background,
		surface: theme.surface,
		text: theme.text,
		font: theme.font,
		baseSize: theme.baseSize,
		scale: theme.scale,
	}
}

export function findPageTheme(preset: PageThemePreset): PageThemeDefinition {
	return pageThemes.find(theme => theme.preset === preset) ?? pageThemes[0]!
}

export const pageFonts = [
	{ id: 'system', label: 'System UI', stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
	{ id: 'inter', label: 'Inter', stack: 'Inter, system-ui, sans-serif' },
	{ id: 'segoe', label: 'Segoe UI', stack: '"Segoe UI", system-ui, sans-serif' },
	{ id: 'helvetica', label: 'Helvetica', stack: 'Helvetica, Arial, sans-serif' },
	{ id: 'arial', label: 'Arial', stack: 'Arial, sans-serif' },
	{ id: 'verdana', label: 'Verdana', stack: 'Verdana, sans-serif' },
	{ id: 'tahoma', label: 'Tahoma', stack: 'Tahoma, sans-serif' },
	{ id: 'trebuchet', label: 'Trebuchet MS', stack: '"Trebuchet MS", sans-serif' },
	{ id: 'roboto', label: 'Roboto', stack: 'Roboto, Arial, sans-serif' },
	{ id: 'open-sans', label: 'Open Sans', stack: '"Open Sans", Arial, sans-serif' },
	{ id: 'lato', label: 'Lato', stack: 'Lato, Arial, sans-serif' },
	{ id: 'montserrat', label: 'Montserrat', stack: 'Montserrat, Arial, sans-serif' },
	{ id: 'poppins', label: 'Poppins', stack: 'Poppins, Arial, sans-serif' },
	{ id: 'georgia', label: 'Georgia', stack: 'Georgia, serif' },
	{ id: 'times', label: 'Times New Roman', stack: '"Times New Roman", serif' },
	{ id: 'palatino', label: 'Palatino', stack: 'Palatino, "Palatino Linotype", serif' },
	{ id: 'garamond', label: 'Garamond', stack: 'Garamond, serif' },
	{ id: 'courier', label: 'Courier New', stack: '"Courier New", monospace' },
	{ id: 'consolas', label: 'Consolas', stack: 'Consolas, monospace' },
	{ id: 'monospace', label: 'System monospace', stack: 'ui-monospace, SFMono-Regular, Consolas, monospace' },
]

export function pageFontStack(font: string): string {
	return pageFonts.find(option => option.id === font)?.stack ?? pageFonts[0]!.stack
}
