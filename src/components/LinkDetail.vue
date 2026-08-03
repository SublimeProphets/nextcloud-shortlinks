<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
	mdiAccountGroupOutline, mdiAccountOutline, mdiChartDonut, mdiChartLine,
	mdiContentCopy, mdiCursorDefaultClickOutline, mdiDeleteOutline, mdiDownload, mdiEarth,
	mdiFolderOutline, mdiHistory, mdiLaptop, mdiLinkVariant, mdiLockOutline, mdiMapMarkerOutline,
	mdiOpenInNew, mdiPencilOutline, mdiPlus, mdiPower, mdiRobotOutline, mdiWeb,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import { folderIconPath } from '../folderIcons'
import type { ActivityEntry, ClickEntry, Folder, LinkShare, LinkStats, Principal, ShortLink } from '../types'
import MiniLineChart from './MiniLineChart.vue'
import StatsDimension from './StatsDimension.vue'

type DetailTab = 'details' | 'stats' | 'clicks' | 'activity'
type Period = '7d' | '30d' | '90d' | 'thisYear' | 'lastYear' | 'all' | 'custom'
const props = withDefaults(defineProps<{ link: ShortLink; folders?: Folder[] }>(), { folders: () => [] })
const emit = defineEmits<{ changed: []; edit: [link: ShortLink] }>()

const tab = ref<DetailTab>('details')
const loading = ref(false)
const stats = ref<LinkStats | null>(null)
const miniStats = ref<LinkStats | null>(null)
const activity = ref<ActivityEntry[]>([])
const shares = ref<LinkShare[]>([])
const clicks = ref<ClickEntry[]>([])
const clickPage = ref(1)
const clickHasMore = ref(false)
const clickBot = ref<'all' | 'human' | 'bot'>('all')
const clickPeriod = ref<Period>('30d')
const statsPeriod = ref<Period>('30d')
const customFrom = ref(new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10))
const customTo = ref(new Date().toISOString().slice(0, 10))
const granularity = ref<'hour' | 'day' | 'week' | 'month'>('day')
const expandedDimensions = reactive<Record<string, boolean>>({})
const showShareDialog = ref(false)
const principalResults = ref<Principal[]>([])
const searchingPrincipals = ref(false)
const sharePrincipal = ref('')
const shareType = ref<'user' | 'group'>('user')
const sharePurpose = ref<'management' | 'access'>('management')
const sharePermission = ref<'view' | 'edit'>('view')

const periods: Array<{ id: Period; label: string }> = [
	{ id: '7d', label: 'Last 7 days' }, { id: '30d', label: 'Last 30 days' }, { id: '90d', label: 'Last 3 months' },
	{ id: 'thisYear', label: 'This year' }, { id: 'lastYear', label: 'Last year' }, { id: 'all', label: 'Since the beginning' }, { id: 'custom', label: 'Custom' },
]
const dimensionIcons: Record<string, string> = { referrer: mdiWeb, country: mdiEarth, region: mdiMapMarkerOutline, browser: mdiWeb, os: mdiLaptop, device: mdiLaptop, authentication: mdiAccountGroupOutline, bot: mdiRobotOutline }
const folder = computed(() => props.folders.find(item => item.id === props.link.folderId))
const appearanceStyle = computed(() => ({ '--link-accent': props.link.color || 'var(--color-primary-element)' }))
const accessLabel = computed(() => ({ public: 'Public/unlisted', authenticated: 'Signed-in users', users: 'Selected users', groups: 'Selected groups', password: 'Password protected', disabled: 'Disabled' })[props.link.accessMode] ?? props.link.accessMode)
const relativeCreated = computed(() => relativeTime(props.link.createdAt))
const relativeUpdated = computed(() => relativeTime(props.link.updatedAt))
const showUpdated = computed(() => props.link.updatedAt !== props.link.createdAt)
const qrUrl = computed(() => typeof api.qrUrl === 'function' ? api.qrUrl(props.link.id, 'svg') : '')
const miniWinners = computed(() => winners(miniStats.value))
const statsWinners = computed(() => winners(stats.value))
const statsRangeLabel = computed(() => {
	const value = range(statsPeriod.value)
	const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
	return `${formatter.format(value.from * 1000)} – ${formatter.format(value.to * 1000)}`
})

watch(() => props.link.id, async () => {
	tab.value = 'details'
	await loadDetails()
})
onMounted(loadDetails)

async function loadDetails() {
	loading.value = true
	try {
		const [shareRows, overview] = await Promise.all([
			props.link.canShare ? api.shares(props.link.id) : Promise.resolve([]),
			api.stats(props.link.id, { ...range('30d'), granularity: 'day', compare: true }),
		])
		shares.value = shareRows
		miniStats.value = overview
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally { loading.value = false }
}

async function load(next: DetailTab) {
	tab.value = next
	loading.value = true
	try {
		if (next === 'stats') await loadStats()
		if (next === 'clicks') await loadClicks(true)
		if (next === 'activity') activity.value = (await api.activity(props.link.id)).items
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { loading.value = false }
}

async function loadStats() {
	stats.value = await api.stats(props.link.id, { ...range(statsPeriod.value), granularity: granularity.value, compare: true })
}

async function loadClicks(reset = false) {
	const page = reset ? 1 : clickPage.value + 1
	const result = await api.clicks(props.link.id, { ...range(clickPeriod.value), page, perPage: 100, bot: clickBot.value === 'all' ? undefined : clickBot.value === 'bot' })
	clicks.value = reset ? result.items : [...clicks.value, ...result.items]
	clickPage.value = result.pagination.page
	clickHasMore.value = result.pagination.hasMore === 1
}

function range(period: Period): { from: number; to: number } {
	const now = new Date(); const to = Math.floor(now.getTime() / 1000)
	if (period === '7d') return { from: to - 7 * 86400, to }
	if (period === '30d') return { from: to - 30 * 86400, to }
	if (period === '90d') return { from: to - 90 * 86400, to }
	if (period === 'thisYear') return { from: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1000), to }
	if (period === 'lastYear') return { from: Math.floor(new Date(now.getFullYear() - 1, 0, 1).getTime() / 1000), to: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1000) - 1 }
	if (period === 'all') return { from: 0, to }
	const from = Math.floor(new Date(`${customFrom.value}T00:00:00`).getTime() / 1000)
	const customEnd = Math.floor(new Date(`${customTo.value}T23:59:59`).getTime() / 1000)
	return { from: Number.isFinite(from) ? from : to - 30 * 86400, to: Number.isFinite(customEnd) ? Math.min(to, customEnd) : to }
}

async function toggle() {
	try { await api.updateLink(props.link.id, { active: !props.link.active, version: props.link.version }); emit('changed') } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function copyShortUrl() {
	try { await navigator.clipboard.writeText(props.link.shortUrl); showSuccess(t('shortlinks', 'Copied')) } catch { showError(t('shortlinks', 'Could not copy')) }
}

async function copyQr() {
	try {
		const response = await fetch(qrUrl.value, { credentials: 'same-origin', headers: { Accept: 'image/svg+xml' } })
		if (!response.ok) throw new Error(t('shortlinks', 'Could not copy'))
		const svg = await response.text()
		const blob = new Blob([svg], { type: 'image/svg+xml' })
		if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
			try { await navigator.clipboard.write([new ClipboardItem({ 'image/svg+xml': blob })]) } catch { await navigator.clipboard.writeText(svg) }
		} else { await navigator.clipboard.writeText(svg) }
		showSuccess(t('shortlinks', 'Copied'))
	} catch { showError(t('shortlinks', 'Could not copy')) }
}

async function addShare() {
	if (!sharePrincipal.value.trim()) return
	try {
		await api.createShare(props.link.id, { type: shareType.value, principalId: sharePrincipal.value.trim(), purpose: sharePurpose.value, permission: sharePurpose.value === 'access' ? 'view' : sharePermission.value })
		sharePrincipal.value = ''; principalResults.value = []; showShareDialog.value = false
		shares.value = await api.shares(props.link.id)
		showSuccess(t('shortlinks', 'Permission added'))
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function removeShare(shareId: number) {
	try { await api.deleteShare(props.link.id, shareId); shares.value = await api.shares(props.link.id) } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function searchPrincipals() {
	const query = sharePrincipal.value.trim(); if (query.length < 2) return
	searchingPrincipals.value = true
	try { principalResults.value = await api.searchPrincipals(query) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { searchingPrincipals.value = false }
}

function selectPrincipal(principal: Principal) { shareType.value = principal.type; sharePrincipal.value = principal.id; principalResults.value = [] }
function shareLabel(value: string): string { return t('shortlinks', ({ user: 'User', group: 'Group', management: 'Management', access: 'Redirect access', view: 'View', edit: 'Edit' })[value] ?? value) }
function dimensionLabel(value: string): string { return t('shortlinks', ({ referrer: 'Referrers', country: 'Countries', region: 'Regions', browser: 'Browsers', os: 'Operating systems', device: 'Devices', authentication: 'Authentication', bot: 'Bots' })[value] ?? value) }
function eventLabel(value: string): string { return t('shortlinks', ({ created: 'Link created', updated: 'Link updated', deleted: 'Moved to trash', restored: 'Restored', share_created: 'Permission added', share_deleted: 'Permission removed' })[value] ?? value.replaceAll('_', ' ')) }
function eventIcon(value: string): string { if (value.includes('share')) return mdiAccountGroupOutline; if (value.includes('delete')) return mdiDeleteOutline; if (value.includes('create')) return mdiPlus; if (value.includes('update')) return mdiPencilOutline; return mdiHistory }
function relativeTime(timestamp: number): string { const seconds = timestamp - Math.floor(Date.now() / 1000); const absolute = Math.abs(seconds); const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }); if (absolute < 3600) return formatter.format(Math.round(seconds / 60), 'minute'); if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), 'hour'); if (absolute < 30 * 86400) return formatter.format(Math.round(seconds / 86400), 'day'); if (absolute < 365 * 86400) return formatter.format(Math.round(seconds / (30 * 86400)), 'month'); return formatter.format(Math.round(seconds / (365 * 86400)), 'year') }
function exactDate(timestamp: number): string { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp * 1000) }
function validFromLabel(timestamp: number | null): string { if (timestamp === null) return t('shortlinks', 'Currently active'); return `${timestamp <= Date.now() / 1000 ? t('shortlinks', 'Active since {time}', { time: relativeTime(timestamp) }) : t('shortlinks', 'Available {time}', { time: relativeTime(timestamp) })} · ${exactDate(timestamp)}` }
function expiresAtLabel(timestamp: number | null): string { return timestamp === null ? t('shortlinks', 'No expiration') : `${t('shortlinks', 'Expires {time}', { time: relativeTime(timestamp) })} · ${exactDate(timestamp)}` }
function winners(source: LinkStats | null): Array<{ label: string; value: string; percentage: number }> {
	return [winner(source, 'device', 'Top device'), winner(source, 'os', 'Top operating system'), winner(source, 'browser', 'Top browser'), winner(source, 'bot', 'Bot traffic', 'bot')]
}
function winner(source: LinkStats | null, dimension: string, label: string, preferredValue?: string): { label: string; value: string; percentage: number } {
	const rows = source?.dimensions[dimension] ?? []
	const row = preferredValue ? rows.find(item => item.value === preferredValue) : rows[0]
	const total = rows.reduce((sum, item) => sum + item.clicks, 0)
	return { label, value: row?.value ?? '—', percentage: row && total ? Math.round(row.clicks / total * 100) : 0 }
}
function download(result: { filename: string; mimeType: string; content: string }) { const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename; anchor.click(); URL.revokeObjectURL(url) }
async function exportStats(format: 'csv' | 'json') { try { download(await api.exportStats(props.link.id, format, { ...range(statsPeriod.value), granularity: granularity.value })) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } }
async function exportClicks(format: 'csv' | 'json') { try { download(await api.exportClicks(props.link.id, format, { ...range(clickPeriod.value), bot: clickBot.value === 'all' ? undefined : clickBot.value === 'bot' })) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } }
</script>

<template>
	<div class="link-detail" :style="appearanceStyle">
		<div v-if="link.mediaUrl && link.mediaMime?.startsWith('video/')" class="link-detail__media">
			<video :src="link.mediaUrl"
				muted
				loop
				autoplay
				playsinline
				controls
				preload="metadata" />
		</div>
		<header class="link-detail__summary">
			<div class="summary-line">
				<span v-if="link.favorite" class="favorite" aria-label="Favorite">★</span>
				<span class="access-pill"><NcIconSvgWrapper :path="link.passwordProtected ? mdiLockOutline : mdiWeb" :size="16" />{{ t('shortlinks', accessLabel) }}</span>
				<span class="short-url-pill"><a :href="link.shortUrl" target="_blank" rel="noopener noreferrer">…/{{ link.slug }}</a><button type="button" :aria-label="t('shortlinks', 'Copy link')" @click="copyShortUrl"><NcIconSvgWrapper :path="mdiContentCopy" :size="16" /></button></span>
				<span><NcIconSvgWrapper :path="mdiCursorDefaultClickOutline" :size="16" />{{ link.clickCount }}</span>
			</div>
			<small>{{ t('shortlinks', 'Created {time}', { time: relativeCreated }) }}<template v-if="showUpdated"> · {{ t('shortlinks', 'Updated {time}', { time: relativeUpdated }) }}</template></small>
		</header>

		<nav class="detail-tabs" :aria-label="t('shortlinks', 'Link detail tabs')" role="tablist">
			<button v-for="item in (['details', 'stats', 'clicks', 'activity'] as DetailTab[])"
				:key="item"
				role="tab"
				:aria-selected="tab === item"
				:class="{ active: tab === item }"
				@click="load(item)">
				{{ t('shortlinks', item === 'stats' ? 'Statistics' : item === 'clicks' ? 'Click log' : item === 'activity' ? 'Activity' : 'Details') }}
			</button>
		</nav>
		<NcLoadingIcon v-if="loading" class="detail-loading" :name="t('shortlinks', 'Loading')" />

		<section v-if="tab === 'details'" class="detail-panel">
			<div class="detail-actions">
				<NcButton v-if="link.canEdit" variant="primary" @click="emit('edit', link)">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPencilOutline" />
					</template>{{ t('shortlinks', 'Edit') }}
				</NcButton><NcButton v-if="link.canEdit" @click="toggle">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPower" />
					</template>{{ link.active ? t('shortlinks', 'Deactivate') : t('shortlinks', 'Activate') }}
				</NcButton>
			</div>
			<section class="detail-section">
				<h3><NcIconSvgWrapper :path="mdiLinkVariant" :size="22" />{{ t('shortlinks', 'Destination and alias') }}</h3><div class="destination-card">
					<a :href="link.targetUrl" target="_blank" rel="noopener noreferrer"><span>{{ link.targetUrl }}</span><NcIconSvgWrapper :path="mdiOpenInNew" :size="18" /></a><div>
						<code>{{ link.shortUrl }}</code><NcButton variant="tertiary" :aria-label="t('shortlinks', 'Copy link')" @click="copyShortUrl">
							<template #icon>
								<NcIconSvgWrapper :path="mdiContentCopy" />
							</template>
						</NcButton>
					</div>
				</div><div v-if="qrUrl" class="qr-card">
					<img :src="qrUrl" :alt="t('shortlinks', 'QR code for {title}', { title: link.title || link.slug })"><div>
						<strong>{{ t('shortlinks', 'QR code') }}</strong><small>{{ t('shortlinks', 'Scan to open the short link.') }}</small><div class="qr-actions">
							<NcButton size="small" @click="copyQr">
								<template #icon>
									<NcIconSvgWrapper :path="mdiContentCopy" />
								</template>{{ t('shortlinks', 'Copy') }}
							</NcButton><NcButton size="small" :href="qrUrl" :download="`${link.slug}-qr.svg`">
								<template #icon>
									<NcIconSvgWrapper :path="mdiDownload" />
								</template>{{ t('shortlinks', 'Download') }}
							</NcButton>
						</div>
					</div>
				</div>
			</section>
			<section v-if="link.description" class="detail-section">
				<h3>{{ t('shortlinks', 'Description') }}</h3><p class="description">
					{{ link.description }}
				</p>
			</section>
			<section class="detail-section">
				<h3><NcIconSvgWrapper :path="mdiLockOutline" :size="22" />{{ t('shortlinks', 'Access and sharing') }}</h3><dl class="property-grid">
					<div><dt>{{ t('shortlinks', 'Access') }}</dt><dd>{{ t('shortlinks', accessLabel) }}</dd></div><div><dt>{{ t('shortlinks', 'Redirect') }}</dt><dd><span class="status-badge">{{ link.redirectStatus }}</span></dd></div><div><dt>{{ t('shortlinks', 'Valid from') }}</dt><dd>{{ validFromLabel(link.startsAt) }}</dd></div><div><dt>{{ t('shortlinks', 'Expires at') }}</dt><dd>{{ expiresAtLabel(link.expiresAt) }}</dd></div><div><dt>{{ t('shortlinks', 'Visit limit') }}</dt><dd>{{ link.clickLimit ?? t('shortlinks', 'No limit') }}</dd></div>
				</dl><div v-if="shares.length" class="share-chips">
					<span v-for="share in shares" :key="share.id" class="share-chip"><NcIconSvgWrapper :path="share.type === 'user' ? mdiAccountOutline : mdiAccountGroupOutline" :size="18" /><span><strong>{{ share.principalId }}</strong><small>{{ shareLabel(share.purpose) }} · {{ shareLabel(share.permission) }}</small></span><button type="button" :aria-label="t('shortlinks', 'Remove')" @click="removeShare(share.id)">×</button></span>
				</div><NcButton v-if="link.canShare" variant="tertiary" @click="showShareDialog = true">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'Add person or group') }}
				</NcButton>
			</section>
			<section class="detail-section">
				<h3><NcIconSvgWrapper :path="mdiChartLine" :size="22" />{{ t('shortlinks', 'Last 30 days') }}</h3><MiniLineChart compact :rows="miniStats?.timeSeries ?? []" :color="link.color || undefined" /><dl class="mini-kpis">
					<div><dt>{{ t('shortlinks', 'Total clicks') }}</dt><dd>{{ link.clickCount }}</dd></div><div><dt>{{ t('shortlinks', 'Unique visitors') }}</dt><dd>{{ miniStats?.uniqueVisitors ?? 0 }}</dd></div><div><dt>{{ t('shortlinks', 'Clicks today') }}</dt><dd>{{ miniStats?.clicksToday ?? 0 }}</dd></div>
				</dl><div class="winner-grid">
					<div v-for="item in miniWinners" :key="item.label">
						<small>{{ t('shortlinks', item.label) }}</small><strong>{{ item.value }} <span>{{ item.percentage }}%</span></strong>
					</div>
				</div>
			</section>
			<section class="detail-section">
				<h3><NcIconSvgWrapper :path="mdiFolderOutline" :size="22" />{{ t('shortlinks', 'Organization') }}</h3><div class="organization-chips">
					<span v-if="folder"><NcIconSvgWrapper :path="folderIconPath(folder.icon)" :size="18" />{{ folder.name }}</span><span v-for="tag in link.tags" :key="tag.id"><i :style="{ backgroundColor: tag.color || 'var(--color-primary-element)' }" />{{ tag.name }}</span><span v-if="!folder && !link.tags.length">{{ t('shortlinks', 'Not organized yet') }}</span>
				</div>
			</section>
		</section>

		<section v-else-if="tab === 'stats'" class="detail-panel">
			<div class="panel-heading">
				<div><h2>{{ t('shortlinks', 'Statistics') }}</h2><p>{{ t('shortlinks', 'Understand reach, trends, and visitor context.') }}</p></div><div class="export-actions">
					<NcButton size="small" @click="exportStats('csv')">
						CSV
					</NcButton><NcButton size="small" @click="exportStats('json')">
						JSON
					</NcButton>
				</div>
			</div>
			<div class="period-buttons" role="group" :aria-label="t('shortlinks', 'Period')">
				<NcButton v-for="item in periods"
					:key="item.id"
					size="small"
					variant="tertiary"
					:pressed="statsPeriod === item.id"
					@click="statsPeriod = item.id; if (item.id !== 'custom') loadStats()">
					{{ t('shortlinks', item.label) }}
				</NcButton>
			</div>
			<div v-if="statsPeriod === 'custom'" class="custom-range">
				<label>{{ t('shortlinks', 'Start date') }}<input v-model="customFrom" type="date"></label><label>{{ t('shortlinks', 'End date') }}<input v-model="customTo" type="date"></label><NcButton variant="primary" @click="loadStats">
					{{ t('shortlinks', 'Apply') }}
				</NcButton>
			</div>
			<label class="select-field">{{ t('shortlinks', 'Granularity') }}<select v-model="granularity" @change="loadStats"><option value="hour">{{ t('shortlinks', 'Hourly') }}</option><option value="day">{{ t('shortlinks', 'Daily') }}</option><option value="week">{{ t('shortlinks', 'Weekly') }}</option><option value="month">{{ t('shortlinks', 'Monthly') }}</option></select></label>
			<h3 class="stats-range-title">
				{{ statsRangeLabel }}
			</h3>
			<dl class="stats-kpis">
				<div><dt>{{ t('shortlinks', 'Lifetime clicks') }}</dt><dd>{{ stats?.lifetimeClicks ?? link.clickCount }}</dd></div><div><dt>{{ t('shortlinks', 'Clicks in period') }}</dt><dd>{{ stats?.totalClicks ?? 0 }}</dd></div><div><dt>{{ t('shortlinks', 'Unique visitors') }}</dt><dd>{{ stats?.uniqueVisitors ?? 0 }}</dd></div><div><dt>{{ t('shortlinks', 'Clicks today') }}</dt><dd>{{ stats?.clicksToday ?? 0 }}</dd></div>
			</dl><div class="winner-grid winner-grid--stats">
				<div v-for="item in statsWinners" :key="item.label">
					<small>{{ t('shortlinks', item.label) }}</small><strong>{{ item.value }} <span>{{ item.percentage }}%</span></strong>
				</div>
			</div>
			<MiniLineChart :rows="stats?.timeSeries ?? []" :color="link.color || undefined" />
			<div class="dimensions">
				<StatsDimension :title="t('shortlinks', 'Most clicked links')"
					:icon="mdiCursorDefaultClickOutline"
					:rows="stats ? [{ value: link.title || link.slug, clicks: stats.totalClicks, uniqueVisitors: stats.uniqueVisitors }] : []"
					show-unique />
				<section v-for="(rows, dimension) in stats?.dimensions ?? {}" :key="dimension">
					<StatsDimension :title="dimensionLabel(dimension)"
						:icon="dimensionIcons[dimension] || mdiChartDonut"
						:rows="expandedDimensions[dimension] ? rows : rows.slice(0, 5)"
						show-unique /><NcButton v-if="rows.length > 5" variant="tertiary" @click="expandedDimensions[dimension] = !expandedDimensions[dimension]">
							{{ expandedDimensions[dimension] ? t('shortlinks', 'Show less') : t('shortlinks', 'Show all {count}', { count: rows.length }) }}
						</NcButton>
				</section>
			</div>
		</section>

		<section v-else-if="tab === 'clicks'" class="detail-panel">
			<div class="panel-heading">
				<div><h2>{{ t('shortlinks', 'Click log') }}</h2><p>{{ t('shortlinks', 'Individual visits retained according to the privacy settings.') }}</p></div><div class="export-actions">
					<NcButton size="small" @click="exportClicks('csv')">
						CSV
					</NcButton><NcButton size="small" @click="exportClicks('json')">
						JSON
					</NcButton>
				</div>
			</div>
			<div class="click-filters">
				<label>{{ t('shortlinks', 'Period') }}<select v-model="clickPeriod" @change="loadClicks(true)"><option v-for="item in periods" :key="item.id" :value="item.id">{{ t('shortlinks', item.label) }}</option></select></label><label>{{ t('shortlinks', 'Visitor type') }}<select v-model="clickBot" @change="loadClicks(true)"><option value="all">{{ t('shortlinks', 'All visitors') }}</option><option value="human">{{ t('shortlinks', 'Humans only') }}</option><option value="bot">{{ t('shortlinks', 'Bots only') }}</option></select></label>
			</div>
			<div v-if="clicks.length" class="click-cards">
				<article v-for="entry in clicks" :key="entry.id">
					<div class="click-card__icon">
						<NcIconSvgWrapper :path="entry.isBot ? mdiRobotOutline : mdiCursorDefaultClickOutline" />
					</div><div class="click-card__content">
						<strong>{{ entry.referrerDomain || t('shortlinks', 'Direct visit') }}</strong><div class="click-card__badges">
							<span><NcIconSvgWrapper :path="mdiWeb" :size="15" />{{ entry.browser || t('shortlinks', 'Unknown') }}</span><span><NcIconSvgWrapper :path="mdiLaptop" :size="15" />{{ entry.os || t('shortlinks', 'Unknown') }}</span><span><NcIconSvgWrapper :path="mdiCursorDefaultClickOutline" :size="15" />{{ entry.deviceType || t('shortlinks', 'Unknown') }}</span><span><NcIconSvgWrapper :path="mdiMapMarkerOutline" :size="15" />{{ [entry.country, entry.region].filter(Boolean).join(', ') || t('shortlinks', 'Unknown region') }}</span>
						</div>
					</div><time :datetime="new Date(entry.clickedAt * 1000).toISOString()" :title="new Date(entry.clickedAt * 1000).toLocaleString()">{{ relativeTime(entry.clickedAt) }}</time>
				</article>
			</div><p v-else class="empty-message">
				{{ t('shortlinks', 'No detailed click events are available for this period.') }}
			</p><NcButton v-if="clickHasMore" @click="loadClicks()">
				{{ t('shortlinks', 'Load more') }}
			</NcButton>
		</section>

		<section v-else class="detail-panel">
			<div class="panel-heading">
				<div><h2>{{ t('shortlinks', 'Activity') }}</h2><p>{{ t('shortlinks', 'A timeline of changes to this short link.') }}</p></div>
			</div>
			<ol v-if="activity.length" class="activity-list">
				<li v-for="entry in activity" :key="String(entry.id)">
					<span><NcIconSvgWrapper :path="eventIcon(entry.eventType)" :size="20" /></span><div><strong>{{ eventLabel(entry.eventType) }}</strong><time :datetime="new Date(entry.createdAt * 1000).toISOString()">{{ new Date(entry.createdAt * 1000).toLocaleString() }}</time></div>
				</li>
			</ol><p v-else class="empty-message">
				{{ t('shortlinks', 'No activity has been recorded yet.') }}
			</p>
		</section>

		<NcDialog v-if="showShareDialog" :name="t('shortlinks', 'Add person or group')" @closing="showShareDialog = false">
			<form id="shortlinks-share-form" class="share-form" @submit.prevent="addShare">
				<label>{{ t('shortlinks', 'Recipient type') }}<select v-model="shareType"><option value="user">{{ t('shortlinks', 'User') }}</option><option value="group">{{ t('shortlinks', 'Group') }}</option></select></label><NcTextField v-model="sharePrincipal"
					:label="t('shortlinks', 'User or group')"
					autocomplete="off"
					@update:model-value="principalResults = []" /><NcButton type="button" :disabled="searchingPrincipals || sharePrincipal.trim().length < 2" @click="searchPrincipals">
						{{ t('shortlinks', 'Search recipients') }}
					</NcButton><ul v-if="principalResults.length" class="principal-results">
						<li v-for="principal in principalResults" :key="`${principal.type}:${principal.id}`">
							<button type="button" @click="selectPrincipal(principal)">
								{{ principal.label }} <small>{{ principal.id }}</small>
							</button>
						</li>
					</ul><label>{{ t('shortlinks', 'Purpose') }}<select v-model="sharePurpose"><option value="management">{{ t('shortlinks', 'Management') }}</option><option value="access">{{ t('shortlinks', 'Redirect access') }}</option></select></label><label v-if="sharePurpose === 'management'">{{ t('shortlinks', 'Permission') }}<select v-model="sharePermission"><option value="view">{{ t('shortlinks', 'View') }}</option><option value="edit">{{ t('shortlinks', 'Edit') }}</option></select></label>
			</form>
			<template #actions>
				<NcButton @click="showShareDialog = false">
					{{ t('shortlinks', 'Cancel') }}
				</NcButton><NcButton type="submit"
					form="shortlinks-share-form"
					variant="primary"
					:disabled="!sharePrincipal.trim()">
					{{ t('shortlinks', 'Add permission') }}
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<style scoped>
.link-detail { --link-accent: var(--color-primary-element); display: grid; min-inline-size: 0; }

.link-detail__media { inline-size: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: color-mix(in srgb, var(--link-accent) 14%, var(--color-background-dark)); }

.link-detail__media img,.link-detail__media video{inline-size:100%;block-size:100%;object-fit:cover}

.link-detail__summary { display:grid;gap:6px;padding:14px 16px;border-block-end:1px solid var(--color-border);background:color-mix(in srgb,var(--link-accent) 7%,var(--color-main-background));}

.summary-line{display:flex;align-items:center;flex-wrap:wrap;gap:8px}

.summary-line>span{display:inline-flex;align-items:center;gap:4px}

.link-detail__summary small{color:var(--color-text-maxcontrast)}

.favorite{color:var(--color-warning);font-size:20px}

.access-pill,.short-url-pill{padding:4px 8px;border:1px solid var(--color-border);border-radius:999px;background:var(--color-main-background)}

.short-url-pill a{color:var(--color-primary-element);font-weight:600}

.short-url-pill button{display:grid;place-items:center;margin:0;padding:2px;border:0;background:transparent;color:inherit;cursor:pointer}

.detail-tabs{position:sticky;z-index:3;inset-block-start:0;display:flex;padding:8px 12px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.detail-tabs button{flex:1;min-block-size:36px;margin:0;padding:6px 8px;border:0;border-radius:0;background:transparent;color:var(--color-text-maxcontrast);font-weight:600;cursor:pointer}

.detail-tabs button:first-child{border-radius:var(--border-radius) 0 0 var(--border-radius)}

.detail-tabs button:last-child{border-radius:0 var(--border-radius) var(--border-radius) 0}

.detail-tabs button.active{background:var(--color-primary-element-light);color:var(--color-primary-element-text)}

.detail-loading{margin:20px auto}

.detail-panel{display:grid;gap:20px;padding:16px}

.detail-actions,.export-actions,.period-buttons{display:flex;flex-wrap:wrap;gap:8px}

.detail-section{display:grid;gap:12px;padding-block-end:20px;border-block-end:1px solid var(--color-border)}

.detail-section:last-child{border:0}

.detail-section h3,.panel-heading h2,.panel-heading p{margin:0}

.detail-section h3{display:flex;align-items:center;gap:8px}

.destination-card,.qr-card{padding:12px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background)}

.destination-card>a,.destination-card>div{display:flex;align-items:center;justify-content:space-between;gap:8px;min-inline-size:0}

.destination-card a span,.destination-card code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.qr-card{display:grid;grid-template-columns:96px minmax(0,1fr);align-items:center;gap:14px}

.qr-card img{inline-size:96px;block-size:96px}

.qr-card>div{display:grid;gap:6px}

.qr-card small,.panel-heading p{color:var(--color-text-maxcontrast)}

.description{margin:0;white-space:pre-wrap}

.property-grid,.mini-kpis,.stats-kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0}

.property-grid>div,.mini-kpis>div,.stats-kpis>div{padding:10px;border-radius:var(--border-radius);background:var(--color-background-hover)}

.property-grid dt,.mini-kpis dt,.stats-kpis dt{color:var(--color-text-maxcontrast);font-size:.8rem}

.property-grid dd,.mini-kpis dd,.stats-kpis dd{margin:2px 0 0;font-weight:700}

.mini-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}

.share-chips,.organization-chips{display:flex;flex-wrap:wrap;gap:8px}

.share-chip,.organization-chips>span{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid var(--color-border);border-radius:999px}

.share-chip>span{display:grid}

.share-chip small{color:var(--color-text-maxcontrast);font-size:.7rem}

.share-chip button{margin:0;padding:0;border:0;background:transparent;font-size:18px;cursor:pointer}

.organization-chips i{inline-size:8px;block-size:8px;border-radius:50%}

.panel-heading{display:flex;align-items:start;justify-content:space-between;gap:12px}

.custom-range,.click-filters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:end;gap:10px}

.custom-range label,.click-filters label,.select-field,.share-form label{display:grid;gap:4px;font-weight:600}

.custom-range input,.click-filters select,.select-field select,.share-form select{inline-size:100%;min-block-size:44px;margin:0}

.stats-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}

.stats-kpis dd{font-size:1.35rem}

.dimensions{display:grid;gap:28px}

.dimensions>section{display:grid;gap:6px}

.click-cards{display:grid;gap:8px}

.click-cards article{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;padding:12px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background)}

.click-card__icon{display:grid;place-items:center;inline-size:40px;block-size:40px;border-radius:50%;background:var(--color-primary-element-light)}

.click-cards article>div:nth-child(2){display:grid;min-inline-size:0}

.click-cards article span,.click-cards article small,.click-cards time{overflow:hidden;color:var(--color-text-maxcontrast);text-overflow:ellipsis;white-space:nowrap}

.click-cards time{grid-column:2;font-size:.78rem}

.empty-message{padding:24px;text-align:center;color:var(--color-text-maxcontrast)}

.activity-list{display:grid;gap:0;margin:0;padding:0;list-style:none}

.activity-list li{position:relative;display:grid;grid-template-columns:40px minmax(0,1fr);gap:10px;padding-block:8px}

.activity-list li::after{content:'';position:absolute;inset-block:48px -8px;inset-inline-start:19px;border-inline-start:1px solid var(--color-border)}

.activity-list li:last-child::after{display:none}

.activity-list li>span{display:grid;place-items:center;inline-size:40px;block-size:40px;border-radius:50%;background:var(--color-background-hover)}

.activity-list li>div{display:grid;align-content:center}

.activity-list time{color:var(--color-text-maxcontrast);font-size:.8rem}

.share-form{display:grid;gap:12px}

.principal-results{max-block-size:180px;margin:0;padding:4px;overflow:auto;list-style:none}

.principal-results button{inline-size:100%;padding:8px;border:0;border-radius:var(--border-radius);background:transparent;text-align:start}

.principal-results button:hover{background:var(--color-background-hover)}

.qr-actions{display:flex!important;flex-wrap:wrap;justify-content:start!important}

.status-badge{display:inline-flex;padding:2px 7px;border-radius:999px;background:var(--color-background-dark);font-size:.78rem}

.winner-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}

.winner-grid>div{display:grid;gap:2px;padding:10px;border:1px solid var(--color-border);border-radius:var(--border-radius)}

.winner-grid small,.winner-grid strong span{color:var(--color-text-maxcontrast);font-weight:400}

.winner-grid strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.stats-range-title{margin:0}

.custom-range,.click-filters{padding:10px;border-radius:var(--border-radius-large);background:var(--color-background-hover)}

.click-cards article{grid-template-columns:auto minmax(0,1fr) auto;align-items:start}

.click-card__content{display:grid!important;min-inline-size:0;gap:6px}

.click-card__badges{display:flex;flex-wrap:wrap;gap:5px}

.click-card__badges span{display:inline-flex;align-items:center;gap:3px;max-inline-size:100%;padding:3px 7px;border-radius:999px;background:var(--color-background-hover);color:var(--color-text-maxcontrast);font-size:.75rem}

.click-cards time{grid-column:auto;white-space:nowrap}
@media(max-width:480px){.property-grid,.mini-kpis,.stats-kpis,.winner-grid,.custom-range,.click-filters{grid-template-columns:1fr}.qr-card{grid-template-columns:72px minmax(0,1fr)}.qr-card img{inline-size:72px;block-size:72px}.detail-tabs{overflow-x:auto}.detail-tabs button{min-inline-size:max-content}.click-cards article{grid-template-columns:auto minmax(0,1fr)}.click-cards time{grid-column:2}}
</style>
