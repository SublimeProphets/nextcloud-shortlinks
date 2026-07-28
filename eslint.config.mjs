import nextcloud from '@nextcloud/eslint-config'

export default [
	...nextcloud,
	{ ignores: ['js/**', 'vendor/**', 'vendor-bin/**', 'coverage/**', 'dist/**'] },
]
