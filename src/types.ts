export type AccessMode = 'public' | 'authenticated' | 'users' | 'groups' | 'password' | 'disabled'
export type FolderIcon = 'archive' | 'folder' | 'personal' | 'projects' | 'star' | 'work'

export interface Tag { id: number; name: string; color: string | null; count: number }
export interface Folder { id: number; parentId: number | null; name: string; icon: FolderIcon; position: number; count: number }
export interface ShortLink {
	id: number; ownerUid: string; folderId: number | null; slug: string; shortUrl: string; targetUrl: string
	title: string; description: string | null; favorite: boolean; active: boolean; accessMode: AccessMode
	thumbnailUrl?: string | null; thumbnailRefreshedAt?: number | null; thumbnailPath?: string | null; thumbnailMediaUrl?: string | null
	mediaPath?: string | null; mediaMime?: string | null; mediaUrl?: string | null; color?: string | null
	passwordProtected: boolean; redirectStatus: number; startsAt: number | null; expiresAt: number | null
	clickLimit: number | null; clickCount: number; lastClickedAt: number | null; createdAt: number; updatedAt: number
	deletedAt: number | null; version: number; tags: Tag[]; canEdit: boolean; canShare: boolean
}
export interface Pagination { page: number; perPage: number; hasMore: number }
export interface StatRow { day: string; clicks: number; uniqueVisitors: number }
export interface DimensionRow { value: string; clicks: number; uniqueVisitors: number }
export interface LinkStats {
	totalClicks: number; lifetimeClicks: number; uniqueVisitors: number; clicksToday: number; granularity: 'hour' | 'day' | 'week' | 'month'
	timeSeries: StatRow[]; dimensions: Record<string, DimensionRow[]>
	comparison: { from: number; to: number; clicks: number; changePercent: number | null } | null
}
export interface StatsOverview {
	totalLinks: number; activeLinks: number; totalClicks: number; uniqueVisitors: number; clicksToday: number
	clicks7Days: number; clicks30Days: number; periodClicks: number; dimensions: Record<string, DimensionRow[]>
	topLinks: Array<{ id: number; slug: string; title: string; clicks: number }>
	leastUsedLinks: Array<{ id: number; slug: string; title: string; clicks: number }>
	newestLinks: Array<{ id: number; slug: string; title: string; clicks: number }>; timeSeries: StatRow[]
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
	thumbnailUrl?: string | null; thumbnailPath?: string | null; mediaPath?: string | null; color?: string | null
}

export type PageAccessMode = 'private' | 'public' | 'password' | 'restricted'
export type PageLayout = 'cards' | 'spaced' | 'compact' | 'tiles'
export type PageGrouping = 'none' | 'folder' | 'tag'
export type PageThemePreset = 'nextcloud' | 'neutral' | 'modern' | 'editorial'
export type PageHeaderAlignment = 'center' | 'left'
export interface PageTheme {
	preset: PageThemePreset; primary: string; background: string; surface: string; text: string
	font: string; baseSize: number; scale: number
}
export interface PageHeaderOptions {
	brand: boolean; mark: boolean; title: boolean; lead: boolean; owner: boolean; compact: boolean; alignment: PageHeaderAlignment
}
export interface PageFooterOptions {
	enabled: boolean; brand: boolean; updated: boolean; attribution: string; linkIds: number[]
}
export interface PageContact { key: string; name: string; emails: string[]; phones: string[]; organization: string }
export interface PageFile {
	path: string; name: string; mime: string; size: number; modifiedAt: number
	inlineUrl: string; downloadUrl: string; isImage: boolean
}
export interface LinkPage {
	id: number; ownerUid: string; slug: string; title: string; lead: string | null; accessMode: PageAccessMode
	passwordProtected: boolean; startsAt: number | null; expiresAt: number | null; folderIds: number[]; tagIds: number[]; linkIds: number[]
	filePaths: string[]; contacts: PageContact[]
	userIds: string[]; groupIds: string[]; layout: PageLayout; grouping: PageGrouping; visibleFields: string[]
	theme: PageTheme; header: PageHeaderOptions; footer: PageFooterOptions; active: boolean
	createdAt: number; updatedAt: number; deletedAt: number | null; version: number; publicUrl: string; canEdit: boolean
}
export interface LinkPageDraft {
	slug: string; title: string; lead: string; accessMode: PageAccessMode; password: string; startsAt: number | null; expiresAt: number | null
	folderIds: number[]; tagIds: number[]; linkIds: number[]; filePaths: string[]; contacts: PageContact[]; userIds: string[]; groupIds: string[]; layout: PageLayout
	grouping: PageGrouping; visibleFields: string[]; theme: PageTheme; header: PageHeaderOptions
	footer: PageFooterOptions; active: boolean; version?: number
}

export interface UserSettings {
	aliasStrategy: 'inherit' | 'shortest' | 'random' | 'readable'
	collisionStrategy: 'random' | 'numbered'
	suffixLength: number
	urlMode: 'inherit' | 'simple' | 'template' | 'regex'
	baseUrl: string
	urlTemplate: string
	urlPattern: string
	urlReplacement: string
	allowAliasSettings: boolean
	allowUrlSettings: boolean
	globalAliasMode: string
	globalUrlMode: string
	previewAlias: string
	previewUrl: string
	shortUrlTemplate: string
	useThumbnails: boolean
	metadataAutocomplete: boolean
	showQuickStart: boolean
	metadataCollectionEnabled: boolean
	allowImportSuggestions: boolean
	email: string
}
