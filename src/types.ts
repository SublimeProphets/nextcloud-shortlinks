export type AccessMode = 'public' | 'authenticated' | 'users' | 'groups' | 'password' | 'disabled'
export type FolderIcon = 'archive' | 'folder' | 'personal' | 'projects' | 'star' | 'work'

export interface Tag { id: number; name: string; color: string | null; count: number }
export interface Folder { id: number; parentId: number | null; name: string; icon: FolderIcon; position: number; count: number }
export interface ShortLink {
	id: number; ownerUid: string; folderId: number | null; slug: string; shortUrl: string; targetUrl: string
	title: string; description: string | null; favorite: boolean; active: boolean; accessMode: AccessMode
	passwordProtected: boolean; redirectStatus: number; startsAt: number | null; expiresAt: number | null
	clickLimit: number | null; clickCount: number; lastClickedAt: number | null; createdAt: number; updatedAt: number
	deletedAt: number | null; version: number; tags: Tag[]; canEdit: boolean; canShare: boolean
}
export interface Pagination { page: number; perPage: number; hasMore: number }
export interface StatRow { day: string; clicks: number; uniqueVisitors: number }
export interface DimensionRow { value: string; clicks: number; uniqueVisitors: number }
export interface LinkStats {
	totalClicks: number; lifetimeClicks: number; uniqueVisitors: number; granularity: 'hour' | 'day' | 'week' | 'month'
	timeSeries: StatRow[]; dimensions: Record<string, DimensionRow[]>
	comparison: { from: number; to: number; clicks: number; changePercent: number | null } | null
}
export interface StatsOverview {
	totalLinks: number; activeLinks: number; totalClicks: number; uniqueVisitors: number; clicksToday: number
	clicks7Days: number; clicks30Days: number; periodClicks: number; dimensions: Record<string, DimensionRow[]>
	topLinks: Array<{ id: number; slug: string; title: string; clicks: number }>
	leastUsedLinks: Array<{ id: number; slug: string; title: string; clicks: number }>
	newestLinks: Array<{ id: number; slug: string; title: string; clicks: number }>
}
export interface ActivityEntry { id: number; eventType: string; createdAt: number }
export interface LinkShare { id: number; type: 'user' | 'group'; principalId: string; purpose: 'management' | 'access'; permission: 'view' | 'edit' }
export interface Principal { type: 'user' | 'group'; id: string; label: string }
export interface ClickEntry {
	id: number; clickedAt: number; userUid: string | null; referrerType: string; referrerDomain: string | null
	browser: string; browserVersion: string | null; os: string; osVersion: string | null; deviceType: string
	country: string | null; region: string | null; isBot: boolean; outcome: string
}
export interface ApiEnvelope<T> { data: T | null; error: { code: string; message: string; fields?: Record<string, string> } | null }
export interface LinkDraft {
	targetUrl: string; slug: string; title: string; description: string; folderId: number | null; tagIds: number[]
	favorite: boolean; active: boolean; accessMode: AccessMode; password: string; redirectStatus: number
	startsAt: number | null; expiresAt: number | null; clickLimit: number | null
}
