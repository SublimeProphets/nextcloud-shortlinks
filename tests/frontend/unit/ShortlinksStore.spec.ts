import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ShortLink } from '../../../src/types'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		listLinks: vi.fn(), listFolders: vi.fn(), listTags: vi.fn(), createLink: vi.fn(), updateLink: vi.fn(),
		deleteLink: vi.fn(), restoreLink: vi.fn(), bulk: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))

import { useShortlinks } from '../../../src/stores/useShortlinks'

const link = (id: number): ShortLink => ({
	id, ownerUid: 'alice', folderId: null, slug: `link-${id}`, shortUrl: `https://cloud.test/r/link-${id}`,
	targetUrl: 'https://example.com', title: `Link ${id}`, description: null, favorite: false, active: true,
	accessMode: 'public', passwordProtected: false, redirectStatus: 302, startsAt: null, expiresAt: null,
	clickLimit: null, clickCount: 0, lastClickedAt: null, createdAt: 1, updatedAt: 1, deletedAt: null,
	version: 1, tags: [], canEdit: true, canShare: true,
})

describe('shortlinks store', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		const { state } = useShortlinks()
		Object.assign(state, { links: [], folders: [], tags: [], loading: false, error: '', page: 1, hasMore: false, search: '', system: 'all', folderId: null, tagIds: [] })
		state.selected.clear()
		apiMock.listFolders.mockResolvedValue([])
		apiMock.listTags.mockResolvedValue([])
	})

	it('refreshes all collections and resets pagination', async () => {
		const store = useShortlinks()
		store.state.page = 4
		apiMock.listLinks.mockResolvedValue({ items: [link(1)], pagination: { page: 1, perPage: 50, hasMore: 1 } })
		await store.refresh()
		expect(store.state.page).toBe(1)
		expect(store.state.links).toHaveLength(1)
		expect(store.state.hasMore).toBe(true)
		expect(apiMock.listLinks).toHaveBeenCalledWith(expect.objectContaining({ page: 1, perPage: 50 }))
	})

	it('appends the next page only when more data exists', async () => {
		const store = useShortlinks()
		store.state.links = [link(1)]; store.state.hasMore = true
		apiMock.listLinks.mockResolvedValue({ items: [link(2)], pagination: { page: 2, perPage: 50, hasMore: 0 } })
		await store.loadMore()
		expect(store.state.links.map(item => item.id)).toEqual([1, 2])
		expect(store.state.page).toBe(2)
		expect(store.state.hasMore).toBe(false)
	})

	it('sends selected identifiers to bulk updates and reloads', async () => {
		const store = useShortlinks()
		store.toggleSelected(4); store.toggleSelected(7)
		apiMock.listLinks.mockResolvedValue({ items: [], pagination: { page: 1, perPage: 50, hasMore: 0 } })
		await store.bulk({ active: false })
		expect(apiMock.bulk).toHaveBeenCalledWith([4, 7], { active: false })
		expect(store.state.selected.size).toBe(0)
	})

	it('keeps API errors as visible state', async () => {
		const store = useShortlinks()
		apiMock.listLinks.mockRejectedValue(new Error('Network failed'))
		await store.refresh()
		expect(store.state.error).toBe('Network failed')
		expect(store.state.loading).toBe(false)
	})
})
