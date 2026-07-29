<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'
import type { StatsOverview } from '../types'

const emit = defineEmits<{ close: [] }>()
const data = ref<StatsOverview | null>(null)
const loading = ref(false)
const days = ref(30)

async function load() {
	loading.value = true
	try {
		const to = Math.floor(Date.now() / 1000)
		data.value = await api.statsOverview({ from: to - days.value * 86400, to })
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		loading.value = false
	}
}

function dimensionLabel(value: string): string {
	const labels: Record<string, string> = { referrer: 'Referrers', country: 'Countries', region: 'Regions', browser: 'Browsers', os: 'Operating systems', device: 'Devices', authentication: 'Authentication', bot: 'Bots' }
	return t('shortlinks', labels[value] ?? value)
}

onMounted(load)
</script>

<template>
	<NcDialog :name="t('shortlinks', 'Statistics overview')" size="large" @closing="emit('close')">
		<div class="stats-overview">
			<label>{{ t('shortlinks', 'Period') }}<select v-model.number="days" @change="load"><option :value="7">{{ t('shortlinks', 'Last 7 days') }}</option><option :value="30">{{ t('shortlinks', 'Last 30 days') }}</option><option :value="90">{{ t('shortlinks', 'Last 90 days') }}</option></select></label>
			<NcButton :disabled="loading" @click="load">
				{{ t('shortlinks', 'Refresh') }}
			</NcButton>
			<NcLoadingIcon v-if="loading && !data" :name="t('shortlinks', 'Loading statistics')" />
			<template v-if="data">
				<dl class="stats-summary">
					<div><dt>{{ t('shortlinks', 'Total links') }}</dt><dd>{{ data.totalLinks }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Active links') }}</dt><dd>{{ data.activeLinks }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Lifetime clicks') }}</dt><dd>{{ data.totalClicks }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Clicks in period') }}</dt><dd>{{ data.periodClicks }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Unique visitors') }}</dt><dd>{{ data.uniqueVisitors }}</dd></div>
					<div><dt>{{ t('shortlinks', 'Clicks today') }}</dt><dd>{{ data.clicksToday }}</dd></div>
				</dl>
				<section>
					<h3>{{ t('shortlinks', 'Most clicked links') }}</h3>
					<table>
						<thead><tr><th>{{ t('shortlinks', 'Title') }}</th><th>{{ t('shortlinks', 'Alias') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th></tr></thead><tbody>
							<tr v-for="link in data.topLinks" :key="link.id">
								<td>{{ link.title || link.slug }}</td><td>{{ link.slug }}</td><td>{{ link.clicks }}</td>
							</tr>
						</tbody>
					</table>
				</section>
				<section v-for="(rows, dimension) in data.dimensions" :key="dimension">
					<template v-if="rows.length">
						<h3>{{ dimensionLabel(dimension) }}</h3>
						<table>
							<thead><tr><th>{{ t('shortlinks', 'Value') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th></tr></thead><tbody>
								<tr v-for="row in rows" :key="row.value">
									<td>{{ row.value }}</td><td>{{ row.clicks }}</td>
								</tr>
							</tbody>
						</table>
					</template>
				</section>
			</template>
		</div>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Close') }}
			</NcButton>
		</template>
	</NcDialog>
</template>
