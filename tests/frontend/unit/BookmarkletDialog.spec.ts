import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import BookmarkletDialog from '../../../src/components/BookmarkletDialog.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: { bookmarklet: vi.fn() },
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))

const global = {
	stubs: {
		NcButton: { emits: ['click'], template: '<button @click="$emit(\'click\')"><slot/></button>' },
		NcDialog: { props: ['name'], template: '<section><h1>{{name}}</h1><slot/><slot name="actions"/></section>' },
		NcIconSvgWrapper: true,
		NcLoadingIcon: true,
	},
}

describe('BookmarkletDialog', () => {
	beforeEach(() => {
		apiMock.bookmarklet.mockResolvedValue({
			code: 'javascript:location.href="https://cloud.test/apps/shortlinks/?url="+encodeURIComponent(location.href)',
			mobileAlternative: 'Use the share menu on mobile.',
		})
	})

	it('loads a draggable bookmark and closes from the dialog action', async () => {
		const view = render(BookmarkletDialog, { global })
		const bookmarklet = await view.findByRole('link', { name: 'Add to Shortlinks' })
		expect(bookmarklet.getAttribute('draggable')).toBe('true')
		expect(bookmarklet.getAttribute('href')).toContain('javascript:')
		await fireEvent.click(view.getByRole('button', { name: 'Close' }))
		expect(view.emitted('close')).toHaveLength(1)
	})
})
