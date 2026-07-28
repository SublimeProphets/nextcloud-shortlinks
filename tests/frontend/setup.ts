import { vi } from 'vitest'

Object.defineProperty(window, 'OC', { value: { generateUrl: (path: string) => path, linkToRemoteBase: () => '/ocs/v2.php' }, writable: true })
Object.defineProperty(window, 'OCA', { value: {}, writable: true })
Object.defineProperty(window, 'oc_requesttoken', { value: 'test-token', writable: true })
vi.mock('@nextcloud/l10n', () => ({
	t: (_app: string, text: string) => text,
	n: (_app: string, one: string) => one,
	getLanguage: () => 'en',
	getLocale: () => 'en-US',
	isRTL: () => false,
}))
