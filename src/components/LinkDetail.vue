<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { mdiAccountGroupOutline, mdiChartDonut, mdiEarth, mdiLaptop, mdiMapMarkerOutline, mdiRobotOutline, mdiWeb } from '@mdi/js'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import { api } from '../api/client'
import type { ActivityEntry, ClickEntry, LinkShare, LinkStats, Principal, ShortLink } from '../types'
import StatsDimension from './StatsDimension.vue'

type DetailTab = 'details' | 'stats' | 'clicks' | 'activity' | 'shares'

const props = defineProps<{ link: ShortLink }>(); const emit = defineEmits<{ changed: []; edit: [link: ShortLink] }>()
const tabs = computed<DetailTab[]>(() => props.link.canShare ? ['details', 'stats', 'clicks', 'activity', 'shares'] : ['details', 'stats', 'clicks', 'activity'])
const tab = ref<DetailTab>('details'); const stats = ref<LinkStats | null>(null); const activity = ref<ActivityEntry[]>([])
const timeSeries = computed(() => stats.value?.timeSeries ?? [])
const shares = ref<LinkShare[]>([])
const clicks = ref<ClickEntry[]>([]); const clickPage = ref(1); const clickHasMore = ref(false); const clickBot = ref<'all' | 'human' | 'bot'>('all'); const clickDays = ref(30)
const granularity = ref<'hour' | 'day' | 'week' | 'month'>('day'); const statsDays = ref(30)
const principalResults = ref<Principal[]>([]); const searchingPrincipals = ref(false)
const sharePrincipal = ref(''); const shareType = ref<'user' | 'group'>('user'); const sharePurpose = ref<'management' | 'access'>('management'); const sharePermission = ref<'view' | 'edit'>('view')
const dimensionIcons: Record<string, string> = { referrer: mdiWeb, country: mdiEarth, region: mdiMapMarkerOutline, browser: mdiWeb, os: mdiLaptop, device: mdiLaptop, authentication: mdiAccountGroupOutline, bot: mdiRobotOutline }
/**
 * Load a detail tab on demand.
 *
 * @param next Target tab
 */
async function load(next: DetailTab) { tab.value = next; try { if (next === 'stats') stats.value = await api.stats(props.link.id, { ...range(granularity.value === 'hour' ? Math.min(7, statsDays.value) : statsDays.value), granularity: granularity.value, compare: true }); if (next === 'clicks') await loadClicks(true); if (next === 'activity') activity.value = (await api.activity(props.link.id)).items; if (next === 'shares') shares.value = await api.shares(props.link.id) } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function loadClicks(reset = false) { const page = reset ? 1 : clickPage.value + 1; const result = await api.clicks(props.link.id, { ...range(clickDays.value), page, perPage: 100, bot: clickBot.value === 'all' ? undefined : clickBot.value === 'bot' }); clicks.value = reset ? result.items : [...clicks.value, ...result.items]; clickPage.value = result.pagination.page; clickHasMore.value = result.pagination.hasMore === 1 }
function range(days: number): { from: number; to: number } { const to = Math.floor(Date.now() / 1000); return { from: to - days * 86400, to } }
/**
 *
 */
async function toggle() { try { await api.updateLink(props.link.id, { active: !props.link.active, version: props.link.version }); emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function addShare() { if (!sharePrincipal.value.trim()) return; try { await api.createShare(props.link.id, { type: shareType.value, principalId: sharePrincipal.value.trim(), purpose: sharePurpose.value, permission: sharePurpose.value === 'access' ? 'view' : sharePermission.value }); sharePrincipal.value = ''; await load('shares') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function removeShare(shareId: number) { try { await api.deleteShare(props.link.id, shareId); await load('shares') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function exportStats(format: 'csv' | 'json') { try { const result = await api.exportStats(props.link.id, format, { ...range(granularity.value === 'hour' ? Math.min(7, statsDays.value) : statsDays.value), granularity: granularity.value }); const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename; anchor.click(); URL.revokeObjectURL(url) } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function searchPrincipals() { const query = sharePrincipal.value.trim(); if (query.length < 2) return; searchingPrincipals.value = true; try { principalResults.value = await api.searchPrincipals(query) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { searchingPrincipals.value = false } }
function selectPrincipal(principal: Principal) { shareType.value = principal.type; sharePrincipal.value = principal.id; principalResults.value = [] }
function shareLabel(value: string): string { const labels: Record<string, string> = { user: 'User', group: 'Group', management: 'Management', access: 'Redirect access', view: 'View', edit: 'Edit' }; return t('shortlinks', labels[value] ?? value) }
function dimensionLabel(value: string): string { const labels: Record<string, string> = { referrer: 'Referrers', country: 'Countries', region: 'Regions', browser: 'Browsers', os: 'Operating systems', device: 'Devices', authentication: 'Authentication', bot: 'Bots' }; return t('shortlinks', labels[value] ?? value) }
onMounted(() => load('details'))
</script>

<template>
	<nav class="detail-tabs" :aria-label="t('shortlinks', 'Link detail tabs')">
		<button v-for="item in tabs"
			:key="item"
			:aria-current="tab === item ? 'page' : undefined"
			@click="load(item)">
			{{ t('shortlinks', item) }}
		</button>
	</nav>
	<section v-if="tab === 'details'" class="detail-panel">
		<dl><dt>{{ t('shortlinks', 'Target') }}</dt><dd><a :href="link.targetUrl">{{ link.targetUrl }}</a></dd><dt>{{ t('shortlinks', 'Alias') }}</dt><dd>{{ link.slug }}</dd><dt>{{ t('shortlinks', 'Access') }}</dt><dd>{{ link.accessMode }}</dd><dt>{{ t('shortlinks', 'Redirect') }}</dt><dd>{{ link.redirectStatus }}</dd><dt>{{ t('shortlinks', 'Clicks') }}</dt><dd>{{ link.clickCount }}<span v-if="link.clickLimit"> / {{ link.clickLimit }}</span></dd></dl><NcButton v-if="link.canEdit" @click="toggle">
			{{ link.active ? t('shortlinks', 'Deactivate') : t('shortlinks', 'Activate') }}
		</NcButton>
		<NcButton v-if="link.canEdit" @click="emit('edit', link)">
			{{ t('shortlinks', 'Edit') }}
		</NcButton>
	</section>
	<section v-else-if="tab === 'stats'" class="detail-panel">
		<h3>{{ t('shortlinks', 'Statistics') }}</h3><label>{{ t('shortlinks', 'Period') }}<select v-model.number="statsDays" @change="load('stats')"><option :value="7">{{ t('shortlinks', 'Last 7 days') }}</option><option :value="30">{{ t('shortlinks', 'Last 30 days') }}</option><option :value="90">{{ t('shortlinks', 'Last 90 days') }}</option></select></label><label>{{ t('shortlinks', 'Granularity') }}<select v-model="granularity" @change="load('stats')"><option value="hour">{{ t('shortlinks', 'Hourly') }}</option><option value="day">{{ t('shortlinks', 'Daily') }}</option><option value="week">{{ t('shortlinks', 'Weekly') }}</option><option value="month">{{ t('shortlinks', 'Monthly') }}</option></select></label><NcButton @click="exportStats('csv')">
			{{ t('shortlinks', 'Export statistics as CSV') }}
		</NcButton><NcButton @click="exportStats('json')">
			{{ t('shortlinks', 'Export statistics as JSON') }}
		</NcButton><p>{{ t('shortlinks', 'Clicks in period') }}: {{ stats?.totalClicks ?? 0 }}</p><p>{{ t('shortlinks', 'Lifetime clicks') }}: {{ stats?.lifetimeClicks ?? link.clickCount }}</p><p>{{ t('shortlinks', 'Unique visitors') }}: {{ stats?.uniqueVisitors ?? 0 }}</p><p v-if="stats?.comparison">
			{{ t('shortlinks', 'Previous period') }}: {{ stats.comparison.clicks }}<template v-if="stats.comparison.changePercent !== null">
				({{ stats.comparison.changePercent }}%)
			</template>
		</p><table v-if="timeSeries.length">
			<thead><tr><th>{{ t('shortlinks', 'Period') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th><th>{{ t('shortlinks', 'Unique visitors') }}</th></tr></thead><tbody>
				<tr v-for="row in timeSeries" :key="row.day">
					<td>{{ row.day }}</td><td>{{ row.clicks }}</td><td>{{ row.uniqueVisitors }}</td>
				</tr>
			</tbody>
		</table>
		<StatsDimension v-for="(rows, dimension) in stats?.dimensions ?? {}"
			:key="dimension"
			:title="dimensionLabel(dimension)"
			:icon="dimensionIcons[dimension] || mdiChartDonut"
			:rows="rows"
			show-unique />
	</section>
	<section v-else-if="tab === 'clicks'" class="detail-panel">
		<h3>{{ t('shortlinks', 'Click log') }}</h3>
		<label>{{ t('shortlinks', 'Period') }}<select v-model.number="clickDays" @change="loadClicks(true)"><option :value="7">{{ t('shortlinks', 'Last 7 days') }}</option><option :value="30">{{ t('shortlinks', 'Last 30 days') }}</option><option :value="90">{{ t('shortlinks', 'Last 90 days') }}</option></select></label><label>{{ t('shortlinks', 'Visitor type') }}<select v-model="clickBot" @change="loadClicks(true)"><option value="all">{{ t('shortlinks', 'All visitors') }}</option><option value="human">{{ t('shortlinks', 'Humans only') }}</option><option value="bot">{{ t('shortlinks', 'Bots only') }}</option></select></label>
		<p v-if="!clicks.length">
			{{ t('shortlinks', 'No detailed click events are available for this period.') }}
		</p>
		<table v-else>
			<thead><tr><th>{{ t('shortlinks', 'Time') }}</th><th>{{ t('shortlinks', 'Referrer') }}</th><th>{{ t('shortlinks', 'Browser') }}</th><th>{{ t('shortlinks', 'Operating system') }}</th><th>{{ t('shortlinks', 'Device') }}</th><th>{{ t('shortlinks', 'Region') }}</th></tr></thead><tbody>
				<tr v-for="entry in clicks" :key="entry.id">
					<td>{{ new Date(entry.clickedAt * 1000).toLocaleString() }}</td><td>{{ entry.referrerDomain || entry.referrerType }}</td><td>{{ entry.browser }} {{ entry.browserVersion || '' }}</td><td>{{ entry.os }} {{ entry.osVersion || '' }}</td><td>{{ entry.deviceType }}</td><td>{{ [entry.country, entry.region].filter(Boolean).join(' · ') || '—' }}</td>
				</tr>
			</tbody>
		</table>
		<NcButton v-if="clickHasMore" @click="loadClicks()">
			{{ t('shortlinks', 'Load more') }}
		</NcButton>
	</section>
	<section v-else-if="tab === 'activity'" class="detail-panel">
		<h3>{{ t('shortlinks', 'Activity') }}</h3><ul>
			<li v-for="entry in activity" :key="String(entry.id)">
				{{ entry.eventType }} · {{ new Date(entry.createdAt * 1000).toLocaleString() }}
			</li>
		</ul>
	</section>
	<section v-else class="detail-panel">
		<h3>{{ t('shortlinks', 'Shares and access') }}</h3>
		<p>{{ t('shortlinks', 'Management shares control who can view or edit this link. Access entries control restricted redirects.') }}</p>
		<form class="share-form" @submit.prevent="addShare">
			<label>{{ t('shortlinks', 'Recipient type') }}<select v-model="shareType"><option value="user">{{ t('shortlinks', 'User') }}</option><option value="group">{{ t('shortlinks', 'Group') }}</option></select></label>
			<label>{{ t('shortlinks', 'User or group') }}<input v-model="sharePrincipal"
				required
				autocomplete="off"
				@input="principalResults = []"></label><NcButton type="button" :disabled="searchingPrincipals || sharePrincipal.trim().length < 2" @click="searchPrincipals">
					{{ t('shortlinks', 'Search recipients') }}
				</NcButton>
			<ul v-if="principalResults.length" class="principal-results">
				<li v-for="principal in principalResults" :key="`${principal.type}:${principal.id}`">
					<button type="button" @click="selectPrincipal(principal)">
						{{ principal.label }} ({{ principal.id }}) · {{ shareLabel(principal.type) }}
					</button>
				</li>
			</ul>
			<label>{{ t('shortlinks', 'Purpose') }}<select v-model="sharePurpose"><option value="management">{{ t('shortlinks', 'Management') }}</option><option value="access">{{ t('shortlinks', 'Redirect access') }}</option></select></label>
			<label v-if="sharePurpose === 'management'">{{ t('shortlinks', 'Permission') }}<select v-model="sharePermission"><option value="view">{{ t('shortlinks', 'View') }}</option><option value="edit">{{ t('shortlinks', 'Edit') }}</option></select></label>
			<NcButton type="submit" variant="primary">
				{{ t('shortlinks', 'Add permission') }}
			</NcButton>
		</form>
		<ul class="share-list">
			<li v-for="share in shares" :key="share.id">
				<span>{{ shareLabel(share.type) }}: {{ share.principalId }} · {{ shareLabel(share.purpose) }} · {{ shareLabel(share.permission) }}</span>
				<NcButton @click="removeShare(share.id)">
					{{ t('shortlinks', 'Remove') }}
				</NcButton>
			</li>
		</ul>
	</section>
</template>
