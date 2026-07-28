<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import { api } from '../api/client'
import type { ActivityEntry, LinkShare, LinkStats, ShortLink } from '../types'

type DetailTab = 'details' | 'stats' | 'activity' | 'shares'

const props = defineProps<{ link: ShortLink }>(); const emit = defineEmits<{ changed: []; edit: [link: ShortLink] }>()
const tabs = computed<DetailTab[]>(() => props.link.canShare ? ['details', 'stats', 'activity', 'shares'] : ['details', 'stats', 'activity'])
const tab = ref<DetailTab>('details'); const stats = ref<LinkStats | null>(null); const activity = ref<ActivityEntry[]>([])
const timeSeries = computed(() => stats.value?.timeSeries ?? [])
const shares = ref<LinkShare[]>([])
const sharePrincipal = ref(''); const shareType = ref<'user' | 'group'>('user'); const sharePurpose = ref<'management' | 'access'>('management'); const sharePermission = ref<'view' | 'edit'>('view')
/**
 * Load a detail tab on demand.
 *
 * @param next Target tab
 */
async function load(next: DetailTab) { tab.value = next; try { if (next === 'stats') stats.value = await api.stats(props.link.id); if (next === 'activity') activity.value = (await api.activity(props.link.id)).items; if (next === 'shares') shares.value = await api.shares(props.link.id) } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
/**
 *
 */
async function toggle() { try { await api.updateLink(props.link.id, { active: !props.link.active, version: props.link.version }); emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function addShare() { if (!sharePrincipal.value.trim()) return; try { await api.createShare(props.link.id, { type: shareType.value, principalId: sharePrincipal.value.trim(), purpose: sharePurpose.value, permission: sharePurpose.value === 'access' ? 'view' : sharePermission.value }); sharePrincipal.value = ''; await load('shares') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function removeShare(shareId: number) { try { await api.deleteShare(props.link.id, shareId); await load('shares') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function exportStats(format: 'csv' | 'json') { try { const result = await api.exportStats(props.link.id, format); const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename; anchor.click(); URL.revokeObjectURL(url) } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
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
		<h3>{{ t('shortlinks', 'Statistics') }}</h3><NcButton @click="exportStats('csv')">
			{{ t('shortlinks', 'Export statistics as CSV') }}
		</NcButton><NcButton @click="exportStats('json')">
			{{ t('shortlinks', 'Export statistics as JSON') }}
		</NcButton><p>{{ t('shortlinks', 'Total clicks') }}: {{ stats?.totalClicks ?? link.clickCount }}</p><p>{{ t('shortlinks', 'Unique visitors') }}: {{ stats?.uniqueVisitors ?? 0 }}</p><table v-if="timeSeries.length">
			<thead><tr><th>{{ t('shortlinks', 'Day') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th><th>{{ t('shortlinks', 'Unique visitors') }}</th></tr></thead><tbody>
				<tr v-for="row in timeSeries" :key="row.day">
					<td>{{ row.day }}</td><td>{{ row.clicks }}</td><td>{{ row.uniqueVisitors }}</td>
				</tr>
			</tbody>
		</table>
		<div v-for="(rows, dimension) in stats?.dimensions ?? {}" :key="dimension">
			<template v-if="rows.length">
				<h4>{{ dimensionLabel(dimension) }}</h4>
				<table>
					<thead><tr><th>{{ t('shortlinks', 'Value') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th><th>{{ t('shortlinks', 'Unique visitors') }}</th></tr></thead>
					<tbody>
						<tr v-for="row in rows" :key="row.value">
							<td>{{ row.value }}</td><td>{{ row.clicks }}</td><td>{{ row.uniqueVisitors }}</td>
						</tr>
					</tbody>
				</table>
			</template>
		</div>
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
			<label>{{ t('shortlinks', 'User or group ID') }}<input v-model="sharePrincipal" required autocomplete="off"></label>
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
