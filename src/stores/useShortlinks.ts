import { computed, reactive } from 'vue'
import { api } from '../api/client'
import type { Folder, LinkDraft, ShortLink, Tag } from '../types'

const state = reactive({
	links: [] as ShortLink[],
	folders: [] as Folder[],
	tags: [] as Tag[],
	loading: false,
	error: '',
	page: 1,
	hasMore: false,
	search: '',
	createdFrom: null as number | null,
	active: null as boolean | null,
	system: 'dashboard',
	folderId: null as number | null,
	tagIds: [] as number[],
	tagMode: 'and' as 'and' | 'or',
	sort: 'updated_at',
	direction: 'DESC' as 'ASC' | 'DESC',
	selected: new Set<number>(),
})

function listParams(page: number): Record<string, unknown> {
	return {
		page,
		perPage: 50,
		search: state.search,
		createdFrom: state.createdFrom ?? undefined,
		active: state.active ?? undefined,
		system: state.system === 'dashboard' ? 'all' : state.system,
		folderId: state.folderId ?? undefined,
		tagIds: state.tagIds,
		tagMode: state.tagMode,
		sort: state.sort,
		direction: state.direction,
	}
}

/**
 *
 */
async function refresh(): Promise<void> {
	state.loading = true; state.error = ''; state.page = 1
	try {
		const [links, folders, tags] = await Promise.all([api.listLinks(listParams(state.page)), api.listFolders(), api.listTags()])
		state.links = links.items; state.hasMore = links.pagination.hasMore === 1; state.folders = folders; state.tags = tags; state.selected.clear()
	} catch (error) { state.error = error instanceof Error ? error.message : String(error) } finally { state.loading = false }
}

async function loadMore(): Promise<void> {
	if (state.loading || !state.hasMore) return
	state.loading = true
	try {
		const next = state.page + 1
		const result = await api.listLinks(listParams(next))
		state.links.push(...result.items); state.page = next; state.hasMore = result.pagination.hasMore === 1
	} catch (error) { state.error = error instanceof Error ? error.message : String(error) } finally { state.loading = false }
}

/**
 *
 */
export function useShortlinks() {
	return {
		state,
		selectedCount: computed(() => state.selected.size),
		refresh,
		loadMore,
		async create(draft: Partial<LinkDraft>): Promise<ShortLink> {
			const created = await api.createLink(draft)
			await refresh()
			return created
		},
		async update(link: ShortLink, changes: Record<string, unknown>) { await api.updateLink(link.id, { ...changes, version: link.version }); await refresh() },
		async remove(link: ShortLink) { await api.deleteLink(link.id); await refresh() },
		async restore(link: ShortLink) { await api.restoreLink(link.id); await refresh() },
		async bulk(changes: Record<string, unknown>) { await api.bulk([...state.selected], changes); await refresh() },
		async setFilter(system: string, folderId: number | null = null) {
			state.system = system
			state.folderId = folderId
			state.tagIds = []
			if (system === 'recent') {
				state.sort = 'created_at'
				state.direction = 'DESC'
			} else if (system === 'used') {
				state.sort = 'last_clicked_at'
				state.direction = 'DESC'
			}
			state.page = 1
			await refresh()
		},
		async openTag(id: number) {
			state.system = 'all'
			state.folderId = null
			state.tagIds = [id]
			state.page = 1
			await refresh()
		},
		async setTagFilter(ids: number[], mode: 'and' | 'or' = state.tagMode) {
			state.tagIds = [...new Set(ids)]
			state.tagMode = mode
			state.page = 1
			await refresh()
		},
		async setSearchFilters(filters: { search: string; createdFrom: number | null; active: boolean | null }) {
			Object.assign(state, filters)
			state.page = 1
			await refresh()
		},
		async setListOptions(options: { sort?: string; direction?: 'ASC' | 'DESC'; tagMode?: 'and' | 'or' }) { Object.assign(state, options); state.page = 1; await refresh() },
		toggleSelected(id: number) { state.selected.has(id) ? state.selected.delete(id) : state.selected.add(id) },
	}
}
