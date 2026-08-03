<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import MiniPieChart from './MiniPieChart.vue'

withDefaults(defineProps<{ title: string; icon: string; rows: Array<{ value: string; clicks: number; uniqueVisitors?: number }>; showUnique?: boolean }>(), { showUnique: false })
</script>

<template>
	<section class="stats-dimension">
		<h3><NcIconSvgWrapper :path="icon" :size="22" aria-hidden="true" />{{ title }}</h3>
		<div v-if="rows.length" class="stats-dimension__content">
			<MiniPieChart :rows="rows" />
			<div class="stats-dimension__table">
				<table>
					<thead>
						<tr>
							<th>{{ t('shortlinks', 'Value') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th><th v-if="showUnique">
								{{ t('shortlinks', 'Unique visitors') }}
							</th>
						</tr>
					</thead><tbody>
						<tr v-for="row in rows" :key="row.value">
							<td>{{ row.value }}</td><td>{{ row.clicks }}</td><td v-if="showUnique">
								{{ row.uniqueVisitors ?? 0 }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div><p v-else class="stats-dimension__empty">
			{{ t('shortlinks', 'No data for this period.') }}
		</p>
	</section>
</template>

<style scoped>
.stats-dimension { display: grid; gap: calc(var(--default-grid-baseline) * 3); min-inline-size: 0; }

.stats-dimension h3 { display: flex; align-items: center; gap: calc(var(--default-grid-baseline) * 2); margin: 0; }

.stats-dimension__content { display: grid; grid-template-columns: 170px minmax(0, 1fr); align-items: start; gap: calc(var(--default-grid-baseline) * 4); }

.stats-dimension__table { min-inline-size: 0; overflow-x: auto; }

.stats-dimension table { inline-size: 100%; border-collapse: collapse; }

.stats-dimension th, .stats-dimension td { padding: calc(var(--default-grid-baseline) * 2); border-block-end: 1px solid var(--color-border); text-align: start; }

.stats-dimension__empty { margin: 0; padding: calc(var(--default-grid-baseline) * 4); border-radius: var(--border-radius-large); background: var(--color-background-hover); color: var(--color-text-maxcontrast); text-align: center; }
@media (max-width: 700px) { .stats-dimension__content { grid-template-columns: 1fr; } }
</style>
