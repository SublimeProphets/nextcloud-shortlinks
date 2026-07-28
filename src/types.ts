export type AccessMode = 'public' | 'authenticated' | 'users' | 'groups' | 'password' | 'disabled'

export interface Tag { id: number; name: string; color: string | null; count: number }
export interface Folder { id: number; parentId: number | null; name: string; position: number; count: number }
export interface ShortLink {
	id: number; ownerUid: string; folderId: number | null; slug: string; shortUrl: string; targetUrl: string
	title: string; description: string | null; favorite: boolean; active: boolean; accessMode: AccessMode
	passwordProtected: boolean; redirectStatus: 301 | 302 | 307 | 308; startsAt: number | null; expiresAt: number | null
	clickLimit: number | null; clickCount: number; lastClickedAt: number | null; createdAt: number; updatedAt: number
	deletedAt: number | null; version: number; tags: Tag[]; canEdit: boolean; canShare: boolean
}
export interface Pagination { page: number; perPage: number; hasMore: number }
export interface StatRow { day: string; clicks: number; uniqueVisitors: number }
export interface DimensionRow { value: string; clicks: number; uniqueVisitors: number }
export interface LinkStats { totalClicks: number; uniqueVisitors: number; timeSeries: StatRow[]; dimensions: Record<string, DimensionRow[]> }
export interface ActivityEntry { id: number; eventType: string; createdAt: number }
export interface LinkShare { id: number; type: 'user' | 'group'; principalId: string; purpose: 'management' | 'access'; permission: 'view' | 'edit' }
export interface ApiEnvelope<T> { data: T | null; error: { code: string; message: string; fields?: Record<string, string> } | null }
export interface LinkDraft {
	targetUrl: string; slug: string; title: string; description: string; folderId: number | null; tagIds: number[]
	favorite: boolean; active: boolean; accessMode: AccessMode; password: string; redirectStatus: 301 | 302 | 307 | 308
	startsAt: number | null; expiresAt: number | null; clickLimit: number | null
}
