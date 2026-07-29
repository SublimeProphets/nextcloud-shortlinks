import axios from '@nextcloud/axios'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import type { ActivityEntry, ApiEnvelope, ClickEntry, Folder, LinkDraft, LinkShare, LinkStats, Pagination, Principal, ShortLink, StatsOverview, Tag, UserSettings } from '../types'

interface OcsResponse<T> { ocs: { data: ApiEnvelope<T> } }

/**
 * Send a request to the versioned Shortlinks OCS endpoint.
 *
 * @param method HTTP method
 * @param path API-relative path
 * @param data Optional request body
 * @param params Optional query parameters
 */
async function request<T>(method: string, path: string, data?: unknown, params?: Record<string, unknown>): Promise<T> {
	try {
		const response = await axios.request<OcsResponse<T>>({ method, url: generateOcsUrl(`/apps/shortlinks/api/v1${path}`), data, params, headers: { 'OCS-APIRequest': 'true', Accept: 'application/json' } })
		if (response.status === 204) return {} as T
		const envelope = response.data.ocs.data
		if (envelope.error || envelope.data === null) throw new Error(envelope.error?.message ?? 'Empty API response')
		return envelope.data
	} catch (error) {
		const responseData = (error as { response?: { data?: OcsResponse<T> } }).response?.data
		const message = responseData?.ocs?.data?.error?.message
		throw new Error(message ?? (error instanceof Error ? error.message : String(error)))
	}
}

export const api = {
	listLinks: (params: Record<string, unknown>) => request<{ items: ShortLink[]; pagination: Pagination }>('GET', '/links', undefined, params),
	createLink: (draft: Partial<LinkDraft>) => request<ShortLink>('POST', '/links', draft),
	updateLink: (id: number, changes: Record<string, unknown>) => request<ShortLink>('PATCH', `/links/${id}`, changes),
	deleteLink: (id: number, permanent = false) => request<Record<string, never>>('DELETE', `/links/${id}`, undefined, { permanent }),
	restoreLink: (id: number) => request<ShortLink>('POST', `/links/${id}/restore`),
	cloneLink: (id: number) => request<ShortLink>('POST', `/links/${id}/clone`),
	bulk: (ids: number[], changes: Record<string, unknown>) => request<{ updated: number }>('POST', '/links/bulk', { ids, changes }),
	aliasAvailable: (slug: string) => request<{ slug: string; available: boolean }>('GET', `/aliases/${encodeURIComponent(slug)}`),
	suggestAlias: (context: { title?: string; targetUrl?: string } = {}) => request<{ slug: string }>('POST', '/aliases/suggest', context),
	getUserSettings: () => request<UserSettings>('GET', '/user-settings'),
	updateUserSettings: (settings: Pick<UserSettings, 'aliasStrategy' | 'collisionStrategy' | 'suffixLength' | 'urlMode' | 'baseUrl' | 'urlTemplate' | 'urlPattern' | 'urlReplacement'>) => request<UserSettings>('PUT', '/user-settings', settings),
	listFolders: () => request<Folder[]>('GET', '/folders'),
	createFolder: (name: string, parentId: number | null = null, icon = 'folder') => request<Folder>('POST', '/folders', { name, parentId, icon }),
	updateFolder: (id: number, data: Partial<Folder>) => request<Folder>('PATCH', `/folders/${id}`, data),
	copyFolder: (id: number, parentId: number | null) => request<Folder>('POST', `/folders/${id}/copy`, { parentId }),
	reorderFolders: (parentId: number | null, ids: number[]) => request<Folder[]>('PUT', '/folders/order', { parentId, ids }),
	deleteFolder: (id: number, deleteLinks = false) => request<Record<string, never>>('DELETE', `/folders/${id}`, undefined, { deleteLinks }),
	listTags: () => request<Tag[]>('GET', '/tags'),
	createTag: (name: string, color: string | null = null) => request<Tag>('POST', '/tags', { name, color }),
	updateTag: (id: number, name: string, color: string | null = null) => request<Tag>('PATCH', `/tags/${id}`, { name, color }),
	mergeTag: (id: number, targetId: number) => request<Record<string, never>>('POST', `/tags/${id}/merge`, { targetId }),
	deleteTag: (id: number) => request<Record<string, never>>('DELETE', `/tags/${id}`),
	statsOverview: (params: Record<string, unknown> = {}) => request<StatsOverview>('GET', '/stats', undefined, params),
	stats: (id: number, params: Record<string, unknown> = {}) => request<LinkStats>('GET', `/links/${id}/stats`, undefined, params),
	exportStats: (id: number, format: 'csv' | 'json', params: Record<string, unknown> = {}) => request<{ filename: string; mimeType: string; content: string }>('GET', `/links/${id}/stats/export`, undefined, { format, ...params }),
	clicks: (id: number, params: Record<string, unknown> = {}) => request<{ items: ClickEntry[]; pagination: Pagination }>('GET', `/links/${id}/clicks`, undefined, params),
	activity: (id: number) => request<{ items: ActivityEntry[] }>('GET', `/links/${id}/activity`),
	shares: (id: number) => request<LinkShare[]>('GET', `/links/${id}/shares`),
	createShare: (id: number, data: Record<string, unknown>) => request<Record<string, unknown>>('POST', `/links/${id}/shares`, data),
	deleteShare: (id: number, shareId: number) => request<Record<string, never>>('DELETE', `/links/${id}/shares/${shareId}`),
	exportLinks: (format: 'csv' | 'json', filters: Record<string, unknown> = {}) => request<{ filename: string; mimeType: string; content: string }>('GET', '/export/links', undefined, { format, ...filters }),
	importLinks: (format: 'csv' | 'json', content: string, dryRun: boolean, conflict: string) => request<Record<string, unknown>>('POST', '/import/links', { format, content, dryRun, conflict }),
	bookmarklet: () => request<{ code: string; mobileAlternative: string }>('GET', '/tools/bookmarklet'),
	fetchTitle: (targetUrl: string) => request<{ title: string }>('POST', '/tools/title', { targetUrl }),
	searchPrincipals: (search: string) => request<Principal[]>('GET', '/principals', undefined, { search, limit: 20 }),
	qrUrl: (id: number, format: 'svg' | 'png' = 'svg') => generateUrl('/apps/shortlinks/qr/{id}', { id }) + `?format=${format}`,
}
