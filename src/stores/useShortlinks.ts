import { computed, reactive } from 'vue'
import { api } from '../api/client'
import type { Folder, LinkDraft, ShortLink, Tag } from '../types'

const state = reactive({ links: [] as ShortLink[], folders: [] as Folder[], tags: [] as Tag[], loading: false, error: '', page: 1, hasMore: false, search: '', system: 'all', folderId: null as number | null, selected: new Set<number>() })

/**
 *
 */
async function refresh(): Promise<void> {
	state.loading = true; state.error = ''
	try {
		const [links, folders, tags] = await Promise.all([api.listLinks({ page: state.page, perPage: 50, search: state.search, system: state.system, folderId: state.folderId ?? undefined }), api.listFolders(), api.listTags()])
		state.links = links.items; state.hasMore = links.pagination.hasMore === 1; state.folders = folders; state.tags = tags; state.selected.clear()
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
		async create(draft: Partial<LinkDraft>) { await api.createLink(draft); await refresh() },
		async update(link: ShortLink, changes: Record<string, unknown>) { await api.updateLink(link.id, { ...changes, version: link.version }); await refresh() },
		async remove(link: ShortLink) { await api.deleteLink(link.id); await refresh() },
		async restore(link: ShortLink) { await api.restoreLink(link.id); await refresh() },
		async bulk(changes: Record<string, unknown>) { await api.bulk([...state.selected], changes); await refresh() },
		async setFilter(system: string, folderId: number | null = null) { state.system = system; state.folderId = folderId; state.page = 1; await refresh() },
		toggleSelected(id: number) { state.selected.has(id) ? state.selected.delete(id) : state.selected.add(id) },
	}
}
