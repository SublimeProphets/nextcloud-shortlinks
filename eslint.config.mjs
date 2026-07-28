import path from 'node:path'
import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const baseDirectory = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({
	baseDirectory,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	{ ignores: ['js/**', 'vendor/**', 'vendor-bin/**', 'coverage/**', 'dist/**'] },
	...compat.extends('@nextcloud/eslint-config/vue3'),
	{
		files: ['**/*.vue'],
		rules: {
			// FlatCompat cannot connect script-setup bindings to templates in this legacy preset.
			// vue-tsc with noUnusedLocals performs that validation instead.
			'@typescript-eslint/no-unused-vars': 'off',
			'vue/valid-v-for': 'off',
		},
	},
	{ rules: { 'jsdoc/require-jsdoc': 'off' } },
]
