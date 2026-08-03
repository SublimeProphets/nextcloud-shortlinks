<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@nextcloud/l10n'
import type { StatRow } from '../types'

const props = withDefaults(defineProps<{ rows?: StatRow[]; color?: string; label?: string; compact?: boolean }>(), {
	rows: () => [],
	color: 'var(--color-primary-element)',
	label: '',
	compact: false,
})
const width = 640
const height = 360
const padding = 32
const maximum = computed(() => Math.max(1, ...props.rows.flatMap(row => [row.clicks, row.uniqueVisitors])))
const points = computed(() => props.rows.map((row, index) => ({
	...row,
	x: props.rows.length <= 1 ? width / 2 : padding + index * ((width - padding * 2) / (props.rows.length - 1)),
	y: height - padding - (row.clicks / maximum.value) * (height - padding * 2),
})))
const path = computed(() => points.value.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '))
const area = computed(() => points.value.length ? `${path.value} L ${points.value.at(-1)?.x} ${height - padding} L ${points.value[0]?.x} ${height - padding} Z` : '')
const uniquePoints = computed(() => props.rows.map((row, index) => ({
	...row,
	x: props.rows.length <= 1 ? width / 2 : padding + index * ((width - padding * 2) / (props.rows.length - 1)),
	y: height - padding - (row.uniqueVisitors / maximum.value) * (height - padding * 2),
})))
const uniquePath = computed(() => uniquePoints.value.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '))
const barWidth = computed(() => Math.max(3, Math.min(24, ((width - padding * 2) / Math.max(1, props.rows.length)) * 0.68)))
</script>

<template>
	<div class="line-chart"
		:class="{ 'line-chart--compact': compact }"
		role="img"
		:aria-label="label || t('shortlinks', 'Clicks over time')">
		<svg v-if="rows.length" viewBox="0 0 640 360" preserveAspectRatio="none">
			<template v-if="compact">
				<rect v-for="point in points"
					:key="point.day"
					:x="point.x - barWidth / 2"
					:y="point.y"
					:width="barWidth"
					:height="Math.max(2, height - padding - point.y)"
					:style="{ color }">
					<title>{{ point.day }}: {{ point.clicks }} {{ t('shortlinks', 'clicks') }}</title>
				</rect>
			</template><template v-else>
				<line v-for="step in 5"
					:key="step"
					x1="32"
					x2="608"
					:y1="32 + (step - 1) * 74"
					:y2="32 + (step - 1) * 74"
					class="line-chart__grid" />
				<path :d="area" class="line-chart__area" :style="{ color }" />
				<path :d="path" class="line-chart__line" :style="{ color }" />
				<path :d="uniquePath" class="line-chart__line line-chart__line--unique" />
				<circle v-for="point in points"
					:key="`clicks-${point.day}`"
					:cx="point.x"
					:cy="point.y"
					r="5"
					:style="{ color }">
					<title>{{ point.day }}: {{ point.clicks }} {{ t('shortlinks', 'clicks') }}, {{ point.uniqueVisitors }} {{ t('shortlinks', 'unique visitors') }}</title>
				</circle>
				<circle v-for="point in uniquePoints"
					:key="`visitors-${point.day}`"
					:cx="point.x"
					:cy="point.y"
					r="4"
					class="line-chart__unique-point">
					<title>{{ point.day }}: {{ point.uniqueVisitors }} {{ t('shortlinks', 'unique visitors') }}</title>
				</circle>
				<text x="4" y="36">{{ maximum }}</text><text x="16" y="332">0</text>
				<text x="32" y="354">{{ points[0]?.day }}</text><text x="608" y="354" text-anchor="end">{{ points.at(-1)?.day }}</text>
			</template>
		</svg>
		<p v-else>
			{{ t('shortlinks', 'No statistics are available for this period.') }}
		</p><div v-if="rows.length && !compact" class="line-chart__legend">
			<span><i :style="{ background: color }" />{{ t('shortlinks', 'Clicks') }}</span><span><i />{{ t('shortlinks', 'Unique visitors') }}</span>
		</div>
	</div>
</template>

<style scoped>
.line-chart { position: relative; display: grid; place-items: center; inline-size: 100%; aspect-ratio: 16 / 9; min-block-size: 180px; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); }

.line-chart svg { inline-size: 100%; block-size: 100%; overflow: visible; }

.line-chart__grid { stroke: var(--color-border); stroke-width: 1; vector-effect: non-scaling-stroke; }

.line-chart__area { fill: currentColor; opacity: .1; }

.line-chart__line { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }

.line-chart__line--unique { color: var(--color-text-maxcontrast); stroke-dasharray: 9 7; }

.line-chart circle { fill: var(--color-main-background); stroke: currentColor; stroke-width: 3; vector-effect: non-scaling-stroke; }

.line-chart__unique-point { color: var(--color-text-maxcontrast); }

.line-chart text { fill: var(--color-text-maxcontrast); font-size: 13px; }

.line-chart__legend { position: absolute; inset-block-start: 10px; inset-inline-end: 12px; display: flex; gap: 12px; padding: 3px 6px; border-radius: var(--border-radius); background: color-mix(in srgb, var(--color-main-background) 88%, transparent); font-size: .75rem; }

.line-chart__legend span { display: inline-flex; align-items: center; gap: 5px; }

.line-chart__legend i { inline-size: 16px; block-size: 3px; border-radius: 2px; background: var(--color-text-maxcontrast); }

.line-chart--compact { aspect-ratio: auto; min-block-size: 3rem; block-size: 3rem; border: 0; border-radius: var(--border-radius); background: var(--color-background-hover); }

.line-chart--compact rect { fill: currentColor; opacity: .8; }

.line-chart p { color: var(--color-text-maxcontrast); }
</style>
