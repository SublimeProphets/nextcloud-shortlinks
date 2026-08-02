<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
	mdiAccountGroupOutline, mdiChartDonut, mdiEarth, mdiLaptop, mdiLinkVariant,
	mdiMapMarkerOutline, mdiRobotOutline, mdiWeb,
} from '@mdi/js'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'
import type { StatsOverview } from '../types'
import StatsDimension from './StatsDimension.vue'

type Period = '7d' | '30d' | '90d' | 'thisYear' | 'lastYear' | 'all' | 'custom'
const props = withDefaults(defineProps<{
	mode?: 'dialog' | 'page'
	contextTitle?: string
	contextColor?: string | null
	filters?: Record<string, unknown>
	initialPeriod?: Period
	initialFrom?: string
	initialTo?: string
}>(), {
	mode: 'dialog', contextTitle: '', contextColor: null, filters: () => ({}), initialPeriod: '30d', initialFrom: '', initialTo: '',
})
const emit = defineEmits<{ close: [] }>()
const data = ref<StatsOverview | null>(null)
const loading = ref(false)
const period = ref<Period>(props.initialPeriod)
const customFrom = ref(props.initialFrom || new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10))
const customTo = ref(props.initialTo || new Date().toISOString().slice(0, 10))
const periods: Array<{ id: Period; label: string }> = [
	{ id: '7d', label: 'Last 7 days' }, { id: '30d', label: 'Last 30 days' }, { id: '90d', label: 'Last 3 months' },
	{ id: 'thisYear', label: 'This year' }, { id: 'lastYear', label: 'Last year' }, { id: 'all', label: 'Since the beginning' }, { id: 'custom', label: 'Custom' },
]
const dimensionConfig: Record<string, { label: string; icon: string }> = {
	referrer: { label: 'Referrers', icon: mdiWeb },
	country: { label: 'Countries', icon: mdiEarth },
	region: { label: 'Regions', icon: mdiMapMarkerOutline },
	browser: { label: 'Browsers', icon: mdiWeb },
	os: { label: 'Operating systems', icon: mdiLaptop },
	device: { label: 'Devices', icon: mdiLaptop },
	authentication: { label: 'Authentication', icon: mdiAccountGroupOutline },
	bot: { label: 'Bots', icon: mdiRobotOutline },
}
const heroStyle = computed(() => ({ '--stats-accent': props.contextColor || 'var(--color-primary-element)' }))
const inactiveCount = computed(() => data.value ? Math.max(0, data.value.totalLinks - data.value.activeLinks) : 0)
const topRows = computed(() => data.value?.topLinks.map(link => ({ value: link.title || link.slug, clicks: link.clicks })) ?? [])

watch(() => props.filters, load, { deep: true })
onMounted(load)

function range(): { from: number; to: number } {
	const now = new Date(); const to = Math.floor(now.getTime() / 1000)
	if (period.value === '7d') return { from: to - 7 * 86400, to }
	if (period.value === '30d') return { from: to - 30 * 86400, to }
	if (period.value === '90d') return { from: to - 90 * 86400, to }
	if (period.value === 'thisYear') return { from: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1000), to }
	if (period.value === 'lastYear') return { from: Math.floor(new Date(now.getFullYear() - 1, 0, 1).getTime() / 1000), to: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1000) - 1 }
	if (period.value === 'all') return { from: 0, to }
	const fromValue = Math.floor(new Date(`${customFrom.value}T00:00:00`).getTime() / 1000)
	const toValue = Math.floor(new Date(`${customTo.value}T23:59:59`).getTime() / 1000)
	return { from: Number.isFinite(fromValue) ? fromValue : to - 30 * 86400, to: Number.isFinite(toValue) ? Math.min(to, toValue) : to }
}

async function load() {
	loading.value = true
	try { data.value = await api.statsOverview({ ...props.filters, ...range() }) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { loading.value = false }
}
function selectPeriod(value: Period) { period.value = value; if (value !== 'custom') load() }
</script>

<template>
	<component :is="mode === 'dialog' ? NcDialog : 'section'" v-bind="mode === 'dialog' ? { name: t('shortlinks', 'Statistics overview'), size: 'large' } : { 'aria-label': t('shortlinks', 'Statistics overview') }" @closing="emit('close')">
		<div class="stats-overview" :class="{ 'stats-overview--page': mode === 'page' }">
			<header class="stats-hero" :style="heroStyle">
				<h3>{{ t('shortlinks', 'Statistics for') }}</h3><h2>{{ contextTitle || t('shortlinks', 'All links') }}</h2>
				<div class="period-buttons" role="group" :aria-label="t('shortlinks', 'Period')">
					<NcButton v-for="item in periods"
						:key="item.id"
						size="small"
						variant="tertiary"
						:pressed="period === item.id"
						@click="selectPeriod(item.id)">
						{{ t('shortlinks', item.label) }}
					</NcButton>
				</div>
				<div v-if="period === 'custom'" class="custom-range">
					<label><span>{{ t('shortlinks', 'Start date') }}</span><input v-model="customFrom" type="date"></label><label><span>{{ t('shortlinks', 'End date') }}</span><input v-model="customTo" type="date"></label><NcButton variant="primary" @click="load">
						{{ t('shortlinks', 'Apply') }}
					</NcButton>
				</div>
				<p v-if="data" class="link-count">
					<strong>{{ data.totalLinks }}</strong> {{ t('shortlinks', 'links total') }}<span v-if="inactiveCount"> · {{ t('shortlinks', '{count} inactive', { count: inactiveCount }) }}</span>
				</p>
			</header>

			<NcLoadingIcon v-if="loading && !data" :name="t('shortlinks', 'Loading statistics')" />
			<template v-if="data">
				<dl class="stats-summary">
					<div><dt>{{ t('shortlinks', 'Lifetime clicks') }}</dt><dd>{{ data.totalClicks }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Clicks in period') }}</dt><dd>{{ data.periodClicks }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Unique visitors') }}</dt><dd>{{ data.uniqueVisitors }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Clicks today') }}</dt><dd>{{ data.clicksToday }}</dd></div>
				</dl>
				<div class="stats-sections">
					<StatsDimension :title="t('shortlinks', 'Most clicked links')" :icon="mdiLinkVariant" :rows="topRows" />
					<StatsDimension v-for="(rows, dimension) in data.dimensions"
						:key="dimension"
						:title="t('shortlinks', dimensionConfig[dimension]?.label || dimension)"
						:icon="dimensionConfig[dimension]?.icon || mdiChartDonut"
						:rows="rows" />
				</div>
			</template>
		</div>
		<template v-if="mode === 'dialog'" #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Close') }}
			</NcButton>
		</template>
	</component>
</template>

<style scoped>
.stats-overview { display: grid; gap: calc(var(--default-grid-baseline) * 5); min-inline-size: 0; padding-block: calc(var(--default-grid-baseline) * 2); }

.stats-overview--page { padding: clamp(16px, 3vw, 32px); }

.stats-hero { display: grid; gap: calc(var(--default-grid-baseline) * 2); padding: clamp(20px, 4vw, 36px); border: 1px solid color-mix(in srgb, var(--stats-accent) 28%, var(--color-border)); border-radius: var(--border-radius-large); background: color-mix(in srgb, var(--stats-accent) 10%, var(--color-main-background)); }

.stats-hero h2, .stats-hero h3, .stats-hero p { margin: 0; }

.stats-hero h3 { color: var(--color-text-maxcontrast); font-size: 1rem; }

.stats-hero h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); }

.period-buttons { display: flex; flex-wrap: wrap; gap: var(--default-grid-baseline); }

.custom-range { display: flex; align-items: end; flex-wrap: wrap; gap: calc(var(--default-grid-baseline) * 3); }

.custom-range label { display: grid; gap: var(--default-grid-baseline); font-weight: 600; }

.custom-range input { min-block-size: 44px; margin: 0; }

.link-count { font-size: 1.05rem; }

.link-count strong { font-size: 1.35rem; }

.stats-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: calc(var(--default-grid-baseline) * 3); margin: 0; }

.stats-summary > div { display: grid; gap: var(--default-grid-baseline); padding: calc(var(--default-grid-baseline) * 4); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); }

.stats-summary dt { color: var(--color-text-maxcontrast); }

.stats-summary dd { margin: 0; font-size: 1.7rem; font-weight: 700; }

.stats-sections { display: grid; gap: calc(var(--default-grid-baseline) * 6); }
@media (max-width: 900px) { .stats-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px) { .stats-summary { grid-template-columns: 1fr; } }
</style>
