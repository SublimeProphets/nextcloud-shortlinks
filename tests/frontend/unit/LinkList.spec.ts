import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ShortLink } from '../../../src/types'

import LinkList from '../../../src/components/LinkList.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		deleteLink: vi.fn(),
		restoreLink: vi.fn(),
		cloneLink: vi.fn(),
		qrUrl: vi.fn().mockReturnValue('/qr/1'),
		thumbnailUrl: vi.fn().mockReturnValue('/thumbnail/1'),
		bulkQrUrl: vi.fn().mockReturnValue('/qr/bulk'),
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
const props = { links: [link], folders: [{ id: 2, parentId: null, name: 'Work', icon: 'folder' as const, position: 0, count: 1 }], tags: link.tags, loading: false, error: '', selected: new Set<number>(), hasMore: false, system: 'favorites', sort: 'updated_at', direction: 'DESC' as const }
const global = {
	stubs: {
		NcActionButton: { props: ['name'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{name}}</button>' },
		NcActionLink: { props: ['name', 'href'], template: '<a :href="href">{{name}}</a>' },
		NcActions: { template: '<div><slot/></div>' },
		NcButton: { template: '<button v-bind="$attrs"><slot/></button>' },
		NcEmptyContent: { props: ['name', 'description'], template: '<section><h2>{{name}}</h2><p>{{description}}</p><slot name="action"/></section>' },
		NcIconSvgWrapper: true,
		NcLoadingIcon: true,
	},
}

describe('LinkList', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		window.localStorage.setItem('shortlinks-view-mode', 'table')
	})

	it('sorts by an interactive table heading and toggles its direction', async () => {
		const view = render(LinkList, { props, global })
		await fireEvent.click(view.getByRole('button', { name: 'Sort by Clicks' }))
		expect(view.emitted('options')?.[0]).toEqual([{ sort: 'click_count', direction: 'DESC' }])
		await view.rerender({ ...props, sort: 'click_count', direction: 'DESC' })
		await fireEvent.click(view.getByRole('button', { name: 'Sort by Clicks' }))
		expect(view.emitted('options')?.[1]).toEqual([{ direction: 'ASC' }])
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

	it('offers creation from the empty state', async () => {
		const view = render(LinkList, { props: { ...props, links: [] }, global })
		await fireEvent.click(view.getByRole('button', { name: 'Create short link' }))
		expect(view.emitted('create')).toHaveLength(1)
	})
})
