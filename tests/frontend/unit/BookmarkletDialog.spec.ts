import { render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import BookmarkletGuide from '../../../src/components/BookmarkletGuide.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: { bookmarklet: vi.fn() },
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))

const global = {
	stubs: {
		NcIconSvgWrapper: true,
		NcLoadingIcon: true,
	},
}

describe('BookmarkletGuide', () => {
	beforeEach(() => {
		apiMock.bookmarklet.mockResolvedValue({
			code: 'javascript:location.href="https://cloud.test/apps/shortlinks/?url="+encodeURIComponent(location.href)',
			mobileAlternative: 'Use the share menu on mobile.',
		})
	})

	it('loads a draggable bookmark for settings and dashboard reuse', async () => {
		const view = render(BookmarkletGuide, { global })
		const bookmarklet = await view.findByRole('link', { name: 'Add to Shortlinks' })
		expect(bookmarklet.getAttribute('draggable')).toBe('true')
		expect(bookmarklet.getAttribute('href')).toContain('javascript:')
	})
})
