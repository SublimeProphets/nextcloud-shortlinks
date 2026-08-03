<script setup lang="ts">
import { computed } from 'vue'
import { mdiClose, mdiImageEditOutline, mdiImagePlusOutline, mdiMovieOpenOutline, mdiPaletteOutline } from '@mdi/js'
import { FilePickerClosed, getFilePickerBuilder } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcColorPicker from '@nextcloud/vue/components/NcColorPicker'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import LinkThumbnail from './LinkThumbnail.vue'

const props = withDefaults(defineProps<{
	thumbnailPath?: string | null
	mediaPath?: string | null
	color?: string | null
	thumbnailSrc?: string
	mediaSrc?: string
	mediaMime?: string | null
}>(), { thumbnailPath: null, mediaPath: null, color: null, thumbnailSrc: '', mediaSrc: '', mediaMime: null })
const emit = defineEmits<{
	'update:thumbnailPath': [value: string | null]
	'update:mediaPath': [value: string | null]
	'update:color': [value: string | null]
}>()
const palette = computed(() => [
	themeHex('--color-primary-element', '#0082c9'),
	themeHex('--color-success', '#2d7d46'),
	themeHex('--color-warning', '#e6a100'),
	themeHex('--color-error', '#d52b1e'),
	'#5b5fc7', '#8c42ab', '#008a9a', '#c45f00',
])
const selectedColor = computed({ get: () => props.color ?? undefined, set: value => emit('update:color', value ?? null) })

function themeHex(variable: string, fallback: string): string {
	if (typeof window === 'undefined') return fallback
	const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
	return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
}

async function pick(kind: 'thumbnail' | 'media') {
	try {
		const picker = getFilePickerBuilder(kind === 'thumbnail' ? t('shortlinks', 'Choose a custom thumbnail') : t('shortlinks', 'Choose decorative media'))
			.setMultiSelect(false)
			.setMimeTypeFilter(kind === 'thumbnail' ? ['image/*'] : ['image/*', 'video/*'])
			.allowDirectories(false)
			.build()
		const nodes = await picker.pickNodes()
		const path = nodes[0]?.path
		if (!path) return
		if (kind === 'thumbnail') emit('update:thumbnailPath', path)
		else emit('update:mediaPath', path)
	} catch (error) {
		if (!(error instanceof FilePickerClosed)) throw error
	}
}
</script>

<template>
	<section class="appearance-fields" :aria-label="t('shortlinks', 'Appearance and media')">
		<div class="appearance-field">
			<div class="field-heading">
				<strong>{{ t('shortlinks', 'Share thumbnail') }}</strong><small>{{ t('shortlinks', 'Used in link previews and compact lists.') }}</small>
			</div>
			<button type="button"
				class="thumbnail-picker"
				:aria-label="t('shortlinks', 'Change thumbnail')"
				@click="pick('thumbnail')">
				<LinkThumbnail size="large" :src="thumbnailSrc" alt="" />
				<span><NcIconSvgWrapper :path="mdiImageEditOutline" :size="20" />{{ t('shortlinks', 'Change thumbnail') }}</span>
			</button>
			<div v-if="thumbnailPath" class="selected-file">
				<NcIconSvgWrapper :path="mdiImagePlusOutline" :size="18" /><span>{{ thumbnailPath }}</span><NcButton variant="tertiary" :aria-label="t('shortlinks', 'Remove custom thumbnail')" @click="emit('update:thumbnailPath', null)">
					<template #icon>
						<NcIconSvgWrapper :path="mdiClose" />
					</template>
				</NcButton>
			</div>
		</div>

		<div class="appearance-field">
			<div class="field-heading">
				<strong>{{ t('shortlinks', 'Decorative media') }}</strong><small>{{ t('shortlinks', 'Images or videos decorate Pages, the sidebar, and cards. A 16:9 format works best.') }}</small>
			</div>
			<div v-if="mediaSrc" class="media-preview">
				<video v-if="mediaMime?.startsWith('video/')"
					:src="mediaSrc"
					muted
					controls
					preload="metadata" />
				<img v-else :src="mediaSrc" alt="">
			</div>
			<div class="field-actions">
				<NcButton @click="pick('media')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiMovieOpenOutline" />
					</template>{{ mediaPath ? t('shortlinks', 'Change media') : t('shortlinks', 'Choose media') }}
				</NcButton><NcButton v-if="mediaPath" variant="tertiary" @click="emit('update:mediaPath', null)">
					{{ t('shortlinks', 'Remove') }}
				</NcButton>
			</div>
			<small v-if="mediaPath" class="path-label">{{ mediaPath }}</small>
		</div>

		<div class="appearance-field">
			<div class="field-heading">
				<strong>{{ t('shortlinks', 'Link color') }}</strong><small>{{ t('shortlinks', 'Theme colors come first. Cards automatically soften the color for readable contrast.') }}</small>
			</div>
			<NcColorPicker v-model="selectedColor"
				:palette="palette"
				advanced-fields
				clearable>
				<template #default="{ attrs }">
					<NcButton v-bind="attrs">
						<template #icon>
							<span class="color-swatch" :style="{ backgroundColor: color || 'var(--color-primary-element)' }"><NcIconSvgWrapper :path="mdiPaletteOutline" /></span>
						</template>{{ color ? color : t('shortlinks', 'Choose color') }}
					</NcButton>
				</template>
			</NcColorPicker>
		</div>
	</section>
</template>

<style scoped>
.appearance-fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: calc(var(--default-grid-baseline) * 4); }

.appearance-field { display: grid; align-content: start; gap: calc(var(--default-grid-baseline) * 2); min-inline-size: 0; padding: calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); }

.field-heading { display: grid; gap: var(--default-grid-baseline); }

.field-heading small,.path-label { color: var(--color-text-maxcontrast); }

.path-label { overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }

.thumbnail-picker { position: relative; justify-self: start; margin: 0; padding: 0; overflow: hidden; border: 0; border-radius: var(--border-radius-large); background: transparent; cursor: pointer; }

.thumbnail-picker>span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; color: #fff; background: rgb(0 0 0 / 62%); opacity: 0; transition: opacity .15s ease; }

.thumbnail-picker:hover>span,.thumbnail-picker:focus-visible>span { opacity: 1; }

.selected-file,.field-actions { display:flex;align-items:center;gap:8px;min-inline-size:0; }

.selected-file>span { overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }

.selected-file>button { margin-inline-start:auto; }

.media-preview { overflow:hidden;inline-size:100%;aspect-ratio:16/9;border-radius:var(--border-radius-large);background:var(--color-background-dark); }

.media-preview img,.media-preview video { inline-size:100%;block-size:100%;object-fit:cover; }

.color-swatch { display:grid;place-items:center;inline-size:24px;block-size:24px;border-radius:50%;color:#fff; }
@media(max-width:900px){.appearance-fields{grid-template-columns:1fr;}}
</style>
