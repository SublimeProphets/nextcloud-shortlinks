import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ShortLink } from '../../../src/types'

import LinkList from '../../../src/components/LinkList.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		exportLinks: vi.fn(),
		deleteLink: vi.fn(),
		restoreLink: vi.fn(),
		cloneLink: vi.fn(),
		bookmarklet: vi.fn(),
		qrUrl: vi.fn().mockReturnValue('/qr/1'),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))

const link: ShortLink = {
	id: 1,
	ownerUid: 'alice',
	folderId: 2,
	slug: 'campaign',
	shortUrl: 'https://cloud.test/r/campaign',
	targetUrl: 'https://example.com',
	title: 'Campaign',
	description: null,
	favorite: false,
	active: true,
	accessMode: 'public',
	passwordProtected: false,
	redirectStatus: 302,
	startsAt: null,
	expiresAt: null,
	clickLimit: null,
	clickCount: 3,
	lastClickedAt: null,
	createdAt: 1,
	updatedAt: 1,
	deletedAt: null,
	version: 1,
	tags: [{ id: 3, name: 'Launch', color: '#112233', count: 1 }],
	canEdit: true,
	canShare: true,
}
const props = { links: [link], folders: [{ id: 2, parentId: null, name: 'Work', position: 0, count: 1 }], tags: link.tags, loading: false, error: '', selected: new Set<number>(), hasMore: false, system: 'favorites', folderId: 2, tagIds: [3], sort: 'updated_at', direction: 'DESC' as const, tagMode: 'and' as const }
const global = { stubs: { NcButton: { template: '<button v-bind="$attrs"><slot/></button>' }, NcEmptyContent: true, NcLoadingIcon: true, NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' } } }

describe('LinkList', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		apiMock.exportLinks.mockResolvedValue({ content: '{}', mimeType: 'application/json', filename: 'shortlinks.json' })
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
		vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
		vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
	})

	it('exports the currently visible filter selection', async () => {
		const view = render(LinkList, { props, global })
		await fireEvent.update(view.getByLabelText('Search'), 'summer')
		await fireEvent.click(view.getByRole('button', { name: 'Export JSON' }))
		expect(apiMock.exportLinks).toHaveBeenCalledWith('json', { system: 'favorites', folderId: 2, tagIds: [3], tagMode: 'and', search: 'summer' })
		expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
	})

	it('offers lifecycle actions only for editable links', async () => {
		apiMock.cloneLink.mockResolvedValue(link)
		apiMock.deleteLink.mockResolvedValue({})
		const view = render(LinkList, { props, global })
		await fireEvent.click(view.getByRole('button', { name: 'Duplicate' }))
		await fireEvent.click(view.getByRole('button', { name: 'Delete' }))
		expect(apiMock.cloneLink).toHaveBeenCalledWith(1)
		expect(apiMock.deleteLink).toHaveBeenCalledWith(1)
		expect(view.emitted('refresh')).toHaveLength(2)
	})
})
