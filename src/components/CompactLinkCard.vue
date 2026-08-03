<script setup lang="ts">
import { computed } from 'vue'
import {
	mdiCalendarClockOutline, mdiCalendarEndOutline, mdiContentCopy, mdiCursorDefaultClickOutline,
	mdiInformationOutline, mdiLockOutline, mdiQrcode, mdiStar,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { api } from '../api/client'
import { folderIconPath } from '../folderIcons'
import type { Folder, ShortLink } from '../types'
import LinkThumbnail from './LinkThumbnail.vue'

const props = withDefaults(defineProps<{ link: ShortLink; folder?: Folder; selectable?: boolean; selected?: boolean; showThumbnail?: boolean }>(), {
	folder: undefined,
	selectable: false,
	selected: false,
	showThumbnail: true,
})
const emit = defineEmits<{ open: [link: ShortLink]; toggle: [id: number] }>()
const createdRelative = computed(() => relativeTime(props.link.createdAt))
const shortUrlLabel = computed(() => `.../${props.link.slug}`)
const startsRelative = computed(() => props.link.startsAt === null ? '' : relativeTime(props.link.startsAt))
const expiresRelative = computed(() => props.link.expiresAt === null ? '' : relativeTime(props.link.expiresAt))

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

async function copyLink() {
	try { await navigator.clipboard.writeText(props.link.shortUrl); showSuccess(t('shortlinks', 'Copied')) } catch { showError(t('shortlinks', 'Could not copy')) }
}

async function copyQr() {
	try {
		const response = await fetch(api.qrUrl(props.link.id, 'svg'), { credentials: 'same-origin', headers: { Accept: 'image/svg+xml' } })
		if (!response.ok) throw new Error(t('shortlinks', 'Could not load QR code'))
		const svg = await response.text()
		const blob = new Blob([svg], { type: 'image/svg+xml' })
		if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
			try { await navigator.clipboard.write([new ClipboardItem({ 'image/svg+xml': blob })]) } catch { await navigator.clipboard.writeText(svg) }
		} else await navigator.clipboard.writeText(svg)
		showSuccess(t('shortlinks', 'QR code copied as SVG'))
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}
</script>

<template>
	<article class="compact-link-card"
		:class="{ 'is-selected': selected, 'is-selectable': selectable, 'has-media': Boolean(link.mediaUrl) }"
		:style="{ '--link-accent': link.color || 'var(--color-primary-element)' }">
		<input v-if="selectable"
			type="checkbox"
			class="compact-link-card__checkbox"
			:checked="selected"
			:disabled="!link.canEdit"
			:aria-label="t('shortlinks', 'Select {title}', { title: link.title || link.slug })"
			@click.stop
			@change="emit('toggle', link.id)">
		<NcIconSvgWrapper v-if="link.favorite"
			class="compact-link-card__favorite"
			:path="mdiStar"
			:size="20"
			:aria-label="t('shortlinks', 'Favorite')" />
		<div v-if="link.mediaUrl" class="compact-link-card__media" aria-hidden="true">
			<video v-if="link.mediaMime?.startsWith('video/')"
				:src="link.mediaUrl"
				muted
				loop
				autoplay
				playsinline
				preload="metadata" />
			<img v-else :src="link.mediaUrl" alt="">
		</div>

		<button type="button"
			class="compact-link-card__main"
			:aria-label="t('shortlinks', 'Open details for {title}', { title: link.title || link.slug })"
			@click="emit('open', link)">
			<LinkThumbnail v-if="showThumbnail"
				size="normal"
				:src="link.thumbnailMediaUrl || (link.thumbnailUrl ? api.thumbnailUrl(link.id) : '')"
				:alt="t('shortlinks', 'Share thumbnail for {title}', { title: link.title || link.slug })" />
			<span class="compact-link-card__identity"><strong>{{ link.title || link.slug }}</strong><span class="compact-link-card__url" :title="link.shortUrl">{{ shortUrlLabel }}</span></span>
		</button>

		<div class="compact-link-card__lower">
			<div class="compact-link-card__meta">
				<span><NcIconSvgWrapper :path="mdiCursorDefaultClickOutline" :size="16" aria-hidden="true" />{{ link.clickCount }} {{ t('shortlinks', 'visits') }}</span>
				<span v-if="folder"><NcIconSvgWrapper :path="folderIconPath(folder.icon)" :size="16" aria-hidden="true" />{{ folder.name }}</span>
				<span v-for="tag in link.tags" :key="tag.id" class="tag-chip"><i :style="{ backgroundColor: tag.color || 'var(--color-primary-element)' }" />{{ tag.name }}</span>
				<span v-if="link.passwordProtected"><NcIconSvgWrapper :path="mdiLockOutline" :size="16" aria-hidden="true" />{{ t('shortlinks', 'Password') }}</span>
				<span v-if="link.startsAt"><NcIconSvgWrapper :path="mdiCalendarClockOutline" :size="16" aria-hidden="true" />{{ t('shortlinks', 'Available {time}', { time: startsRelative }) }}</span>
				<span v-if="link.expiresAt"><NcIconSvgWrapper :path="mdiCalendarEndOutline" :size="16" aria-hidden="true" />{{ t('shortlinks', 'Expires {time}', { time: expiresRelative }) }}</span>
				<span class="created-label">{{ t('shortlinks', 'Created {time}', { time: createdRelative }) }}</span>
			</div>
			<div class="compact-link-card__actions" role="toolbar" :aria-label="t('shortlinks', 'Actions for {title}', { title: link.title || link.slug })">
				<NcButton size="small" variant="primary" @click="emit('open', link)">
					<template #icon>
						<NcIconSvgWrapper :path="mdiInformationOutline" />
					</template>{{ t('shortlinks', 'Details') }}
				</NcButton>
				<NcButton size="small"
					variant="secondary"
					:aria-label="t('shortlinks', 'Copy link')"
					:title="t('shortlinks', 'Copy link')"
					@click="copyLink">
					<template #icon>
						<NcIconSvgWrapper :path="mdiContentCopy" />
					</template>
				</NcButton>
				<NcButton size="small"
					variant="secondary"
					:aria-label="t('shortlinks', 'Copy QR code as SVG')"
					:title="t('shortlinks', 'Copy QR code as SVG')"
					@click="copyQr">
					<template #icon>
						<NcIconSvgWrapper :path="mdiQrcode" />
					</template>
				</NcButton>
			</div>
		</div>
	</article>
</template>

<style scoped>
.compact-link-card { --link-accent: var(--color-primary-element); position: relative; display: grid; min-block-size: 164px; gap: calc(var(--default-grid-baseline) * 3); min-inline-size: 0; padding: calc(var(--default-grid-baseline) * 3); overflow: hidden; border: 1px solid color-mix(in srgb, var(--link-accent) 34%, var(--color-border)); border-radius: var(--border-radius-large); background: color-mix(in srgb, var(--link-accent) 7%, var(--color-main-background)); transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease; }

.compact-link-card:hover, .compact-link-card:focus-within { border-color: var(--link-accent); background: color-mix(in srgb, var(--link-accent) 11%, var(--color-main-background)); box-shadow: 0 4px 16px var(--color-box-shadow); }

.compact-link-card.is-selected { border-color: var(--color-primary-element); box-shadow: inset 0 0 0 1px var(--color-primary-element); }

.compact-link-card__checkbox { position: absolute; z-index: 2; inset-block-start: 8px; inset-inline-start: 8px; inline-size: 20px; block-size: 20px; margin: 0; }

.compact-link-card__favorite { position: absolute; z-index: 2; inset-block-start: 10px; inset-inline-end: 10px; color: var(--color-warning); }

.compact-link-card__media { margin: calc(var(--default-grid-baseline) * -3) calc(var(--default-grid-baseline) * -3) 0; aspect-ratio: 16 / 5; overflow: hidden; background: var(--color-background-dark); }

.compact-link-card__media img, .compact-link-card__media video { inline-size: 100%; block-size: 100%; object-fit: cover; }

.compact-link-card.has-media .compact-link-card__favorite, .compact-link-card.has-media .compact-link-card__checkbox { color: #fff; filter: drop-shadow(0 1px 3px #000); }

.compact-link-card__main { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; min-inline-size: 0; inline-size: 100%; gap: calc(var(--default-grid-baseline) * 3); margin: 0; padding: 0; border: 0; background: transparent; color: var(--color-main-text); font: inherit; text-align: start; cursor: pointer; }

.compact-link-card.is-selectable .compact-link-card__main { padding-inline-start: 20px; }

.compact-link-card__identity { display: grid; min-inline-size: 0; }

.compact-link-card__identity strong, .compact-link-card__url { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.compact-link-card__identity strong { font-size: 1.02rem; }

.compact-link-card__url { color: var(--color-primary-element); font-size: .9rem; }

.compact-link-card__lower { position: relative; min-block-size: 48px; }

.compact-link-card__meta, .compact-link-card__actions { position: absolute; inset: 0; display: flex; align-items: center; flex-wrap: wrap; gap: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 2); transition: opacity .16s ease; }

.compact-link-card__meta { color: var(--color-text-maxcontrast); font-size: .8rem; }

.compact-link-card__meta > span { display: inline-flex; align-items: center; min-inline-size: 0; gap: var(--default-grid-baseline); }

.compact-link-card__meta .tag-chip { padding: 2px 7px; border: 1px solid var(--color-border); border-radius: 999px; color: var(--color-main-text); }

.compact-link-card__meta .tag-chip i { inline-size: 7px; block-size: 7px; border-radius: 50%; }

.created-label { margin-inline-start: auto; }

.compact-link-card__actions { z-index: 1; justify-content: flex-start; opacity: 0; pointer-events: none; }

.compact-link-card:hover .compact-link-card__meta, .compact-link-card:focus-within .compact-link-card__meta { opacity: 0; pointer-events: none; }

.compact-link-card:hover .compact-link-card__actions, .compact-link-card:focus-within .compact-link-card__actions { opacity: 1; pointer-events: auto; }
@media (hover: none) { .compact-link-card__lower { min-block-size: 96px; } .compact-link-card__meta, .compact-link-card__actions { position: static; } .compact-link-card__actions { margin-block-start: calc(var(--default-grid-baseline) * 2); opacity: 1; pointer-events: auto; } }
</style>
