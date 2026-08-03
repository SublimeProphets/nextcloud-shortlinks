import axios from '@nextcloud/axios'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import type { ActivityEntry, ApiEnvelope, ClickEntry, Folder, LinkDraft, LinkPage, LinkPageDraft, LinkShare, LinkStats, PageContact, Pagination, Principal, ShortLink, StatsOverview, Tag, UserSettings } from '../types'

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
	updateUserSettings: (settings: Partial<Pick<UserSettings, 'aliasStrategy' | 'collisionStrategy' | 'suffixLength' | 'urlMode' | 'baseUrl' | 'urlTemplate' | 'urlPattern' | 'urlReplacement' | 'useThumbnails' | 'metadataAutocomplete' | 'showQuickStart'>>) => request<UserSettings>('PUT', '/user-settings', settings),
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
	exportClicks: (id: number, format: 'csv' | 'json', params: Record<string, unknown> = {}) => request<{ filename: string; mimeType: string; content: string }>('GET', `/links/${id}/clicks/export`, undefined, { format, ...params }),
	activity: (id: number) => request<{ items: ActivityEntry[] }>('GET', `/links/${id}/activity`),
	shares: (id: number) => request<LinkShare[]>('GET', `/links/${id}/shares`),
	createShare: (id: number, data: Record<string, unknown>) => request<Record<string, unknown>>('POST', `/links/${id}/shares`, data),
	deleteShare: (id: number, shareId: number) => request<Record<string, never>>('DELETE', `/links/${id}/shares/${shareId}`),
	exportLinks: (format: 'csv' | 'json', filters: Record<string, unknown> = {}) => request<{ filename: string; mimeType: string; content: string }>('GET', '/export/links', undefined, { format, ...filters }),
	exportBackup: () => request<{ filename: string; mimeType: string; content: string; count: number }>('GET', '/export/backup'),
	importLinks: (format: 'auto' | 'shortlinks-backup' | 'json' | 'csv' | 'yourls-csv' | 'yourls-xml', content: string, dryRun: boolean, conflict: string) => request<{ dryRun: boolean; format: string; total: number; created: number; skipped: number; errors: Array<{ row: number; message: string }> }>('POST', '/import/links', { format, content, dryRun, conflict }),
	submitSuggestion: (data: { kind: 'import-compatibility' | 'general' | 'bug' | 'development'; email: string; anonymous: boolean; name: string; details: string }) => request<{ sent: boolean }>('POST', '/suggestions', data),
	bookmarklet: () => request<{ code: string; mobileAlternative: string }>('GET', '/tools/bookmarklet'),
	fetchTitle: (targetUrl: string) => request<{ title: string }>('POST', '/tools/title', { targetUrl }),
	fetchMetadata: (targetUrl: string) => request<{ title: string; hasThumbnail: boolean; imageUrl: string | null }>('POST', '/tools/metadata', { targetUrl }),
	searchPrincipals: (search: string) => request<Principal[]>('GET', '/principals', undefined, { search, limit: 20 }),
	qrUrl: (id: number, format: 'svg' | 'png' = 'svg') => generateUrl('/apps/shortlinks/qr/{id}', { id }) + `?format=${format}`,
	bulkQrUrl: (ids: number[]) => generateUrl('/apps/shortlinks/qr/bulk') + `?${new URLSearchParams(ids.map(id => ['ids[]', String(id)])).toString()}`,
	thumbnailUrl: (id: number) => generateUrl('/apps/shortlinks/thumbnail/{id}', { id }),
	previewThumbnailUrl: (targetUrl: string, imageUrl?: string | null) => generateUrl('/apps/shortlinks/thumbnail/preview') + `?${new URLSearchParams({ url: targetUrl, ...(imageUrl ? { imageUrl } : {}) }).toString()}`,
	listPages: (filter = 'all', page = 1, perPage = 100) => request<{ items: LinkPage[]; pagination: Pagination }>('GET', '/pages', undefined, { filter, page, perPage }),
	searchPageContacts: (search: string) => request<{ enabled: boolean; items: PageContact[] }>('GET', '/pages/contacts', undefined, { search }),
	createPage: (draft: Partial<LinkPageDraft>) => request<LinkPage>('POST', '/pages', draft),
	updatePage: (id: number, draft: Partial<LinkPageDraft>) => request<LinkPage>('PATCH', `/pages/${id}`, draft),
	deletePage: (id: number, permanent = false) => request<Record<string, never>>('DELETE', `/pages/${id}`, undefined, { permanent }),
	restorePage: (id: number) => request<LinkPage>('POST', `/pages/${id}/restore`),
}
