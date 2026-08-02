<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@nextcloud/l10n'

const props = defineProps<{ rows: Array<{ value: string; clicks: number }> }>()
const colors = ['var(--color-primary-element)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-primary-element-hover)', 'var(--color-text-maxcontrast)']
const grouped = computed(() => {
	const sorted = [...props.rows].filter(row => row.clicks > 0).sort((a, b) => b.clicks - a.clicks)
	const top = sorted.slice(0, 5)
	const other = sorted.slice(5).reduce((sum, row) => sum + row.clicks, 0)
	return other > 0 ? [...top, { value: t('shortlinks', 'Other'), clicks: other }] : top
})
const total = computed(() => grouped.value.reduce((sum, row) => sum + row.clicks, 0))
const gradient = computed(() => {
	if (total.value === 0) return 'var(--color-background-dark)'
	let current = 0
	const segments = grouped.value.map((row, index) => {
		const start = current
		current += row.clicks / total.value * 100
		return `${colors[index % colors.length]} ${start}% ${current}%`
	})
	return `conic-gradient(${segments.join(', ')})`
})
const label = computed(() => grouped.value.map(row => `${row.value}: ${row.clicks}`).join(', '))
</script>

<template>
	<div class="pie-chart-wrap">
		<div class="pie-chart"
			role="img"
			:aria-label="label"
			:style="{ background: gradient }">
			<span>{{ total }}</span>
		</div>
		<ul>
			<li v-for="(row, index) in grouped" :key="row.value">
				<i :style="{ background: colors[index % colors.length] }" /><span>{{ row.value }}</span><strong>{{ row.clicks }}</strong>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.pie-chart-wrap { display: grid; align-content: start; justify-items: center; gap: calc(var(--default-grid-baseline) * 3); min-inline-size: 150px; }

.pie-chart { display: grid; inline-size: 116px; block-size: 116px; border-radius: 50%; place-items: center; }

.pie-chart::before { content: ''; grid-area: 1 / 1; inline-size: 62px; block-size: 62px; border-radius: 50%; background: var(--color-main-background); }

.pie-chart span { z-index: 1; grid-area: 1 / 1; font-weight: 700; }

.pie-chart-wrap ul { display: grid; inline-size: 100%; gap: var(--default-grid-baseline); margin: 0; padding: 0; list-style: none; font-size: .82rem; }

.pie-chart-wrap li { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; align-items: center; gap: var(--default-grid-baseline); }

.pie-chart-wrap li i { inline-size: 8px; block-size: 8px; border-radius: 50%; }

.pie-chart-wrap li span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
