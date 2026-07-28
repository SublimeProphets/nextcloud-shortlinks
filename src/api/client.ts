import axios from '@nextcloud/axios'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import type { ActivityEntry, ApiEnvelope, Folder, LinkDraft, LinkShare, LinkStats, Pagination, ShortLink, Tag } from '../types'

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
	const response = await axios.request<OcsResponse<T>>({ method, url: generateOcsUrl(`/apps/shortlinks/api/v1${path}`), data, params, headers: { 'OCS-APIRequest': 'true', Accept: 'application/json' } })
	if (response.status === 204) return {} as T
	const envelope = response.data.ocs.data
	if (envelope.error || envelope.data === null) throw new Error(envelope.error?.message ?? 'Empty API response')
	return envelope.data
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
	listFolders: () => request<Folder[]>('GET', '/folders'),
	createFolder: (name: string, parentId: number | null = null) => request<Folder>('POST', '/folders', { name, parentId }),
	updateFolder: (id: number, data: Partial<Folder>) => request<Folder>('PATCH', `/folders/${id}`, data),
	deleteFolder: (id: number, deleteLinks = false) => request<Record<string, never>>('DELETE', `/folders/${id}`, undefined, { deleteLinks }),
	listTags: () => request<Tag[]>('GET', '/tags'),
	createTag: (name: string, color: string | null = null) => request<Tag>('POST', '/tags', { name, color }),
	updateTag: (id: number, name: string, color: string | null = null) => request<Tag>('PATCH', `/tags/${id}`, { name, color }),
	mergeTag: (id: number, targetId: number) => request<Record<string, never>>('POST', `/tags/${id}/merge`, { targetId }),
	deleteTag: (id: number) => request<Record<string, never>>('DELETE', `/tags/${id}`),
	stats: (id: number) => request<LinkStats>('GET', `/links/${id}/stats`),
	exportStats: (id: number, format: 'csv' | 'json') => request<{ filename: string; mimeType: string; content: string }>('GET', `/links/${id}/stats/export`, undefined, { format }),
	activity: (id: number) => request<{ items: ActivityEntry[] }>('GET', `/links/${id}/activity`),
	shares: (id: number) => request<LinkShare[]>('GET', `/links/${id}/shares`),
	createShare: (id: number, data: Record<string, unknown>) => request<Record<string, unknown>>('POST', `/links/${id}/shares`, data),
	deleteShare: (id: number, shareId: number) => request<Record<string, never>>('DELETE', `/links/${id}/shares/${shareId}`),
	exportLinks: (format: 'csv' | 'json') => request<{ filename: string; mimeType: string; content: string }>('GET', '/export/links', undefined, { format }),
	importLinks: (format: 'csv' | 'json', content: string, dryRun: boolean, conflict: string) => request<Record<string, unknown>>('POST', '/import/links', { format, content, dryRun, conflict }),
	bookmarklet: () => request<{ code: string; mobileAlternative: string }>('GET', '/tools/bookmarklet'),
	qrUrl: (id: number, format: 'svg' | 'png' = 'svg') => generateUrl('/apps/shortlinks/qr/{id}', { id }) + `?format=${format}`,
}
