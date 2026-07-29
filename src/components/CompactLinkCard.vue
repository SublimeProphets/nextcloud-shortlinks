<script setup lang="ts">
import { computed } from 'vue'
import { mdiCursorDefaultClickOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import type { ShortLink } from '../types'

const props = defineProps<{ link: ShortLink }>()
const emit = defineEmits<{ open: [link: ShortLink] }>()
const createdRelative = computed(() => relativeTime(props.link.createdAt))
const shortUrlLabel = computed(() => `.../${props.link.slug}`)

function relativeTime(timestamp: number): string {
	const seconds = timestamp - Math.floor(Date.now() / 1000)
	const absolute = Math.abs(seconds)
	const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
	if (absolute < 60) return formatter.format(seconds, 'second')
	if (absolute < 3600) return formatter.format(Math.round(seconds / 60), 'minute')
	if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), 'hour')
	if (absolute < 30 * 86400) return formatter.format(Math.round(seconds / 86400), 'day')
	if (absolute < 365 * 86400) return formatter.format(Math.round(seconds / (30 * 86400)), 'month')
	return formatter.format(Math.round(seconds / (365 * 86400)), 'year')
}
</script>

<template>
	<article class="compact-link-card">
		<button type="button"
			class="compact-link-card__main"
			:aria-label="t('shortlinks', 'Open details for {title}', { title: link.title || link.slug })"
			@click="emit('open', link)">
			<strong>{{ link.title || link.slug }}</strong>
			<span class="compact-link-card__url" :title="link.shortUrl">{{ shortUrlLabel }}</span>
		</button>
		<div class="compact-link-card__meta">
			<span><NcIconSvgWrapper :path="mdiCursorDefaultClickOutline" :size="16" aria-hidden="true" />{{ link.clickCount }} {{ t('shortlinks', 'visits') }}</span>
			<span>{{ t('shortlinks', 'Created {time}', { time: createdRelative }) }}</span>
		</div>
	</article>
</template>

<style scoped>
.compact-link-card { display: grid; gap: calc(var(--default-grid-baseline) * 2); min-inline-size: 0; padding: calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); transition: border-color .15s ease, background-color .15s ease; }

.compact-link-card:hover { border-color: var(--color-border-maxcontrast); background: var(--color-background-hover); }

.compact-link-card__main { display: grid; min-inline-size: 0; inline-size: 100%; margin: 0; padding: 0; border: 0; background: transparent; color: var(--color-main-text); font: inherit; text-align: start; cursor: pointer; }

.compact-link-card__main strong,
.compact-link-card__url { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.compact-link-card__url { color: var(--color-primary-element); font-size: .9rem; }

.compact-link-card__meta { display: flex; justify-content: space-between; gap: calc(var(--default-grid-baseline) * 2); color: var(--color-text-maxcontrast); font-size: .8rem; }

.compact-link-card__meta span { display: inline-flex; align-items: center; gap: var(--default-grid-baseline); }
@media (max-width: 420px) { .compact-link-card__meta { align-items: flex-start; flex-direction: column; } }
</style>
