<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import LinkThumbnail from './LinkThumbnail.vue'

withDefaults(defineProps<{
	url: string
	title: string
	valid: boolean
	thumbnailSrc?: string
	loading?: boolean
	urlError?: string
	urlHint?: string
}>(), {
	thumbnailSrc: '',
	loading: false,
	urlError: '',
	urlHint: '',
})
const emit = defineEmits<{
	'update:url': [value: string]
	'update:title': [value: string]
	titleEdited: []
}>()

function updateTitle(value: string | number) {
	emit('update:title', String(value))
	emit('titleEdited')
}
</script>

<template>
	<div class="link-preview-editor" :class="{ 'link-preview-editor--expanded': valid }">
		<LinkThumbnail v-if="valid"
			size="large"
			:src="thumbnailSrc"
			:alt="title ? t('shortlinks', 'Share thumbnail for {title}', { title }) : t('shortlinks', 'Share thumbnail')" />
		<div class="link-preview-editor__fields">
			<NcTextField :model-value="url"
				type="url"
				required
				:label="t('shortlinks', 'Destination URL')"
				:helper-text="url ? urlError : urlHint"
				:error="Boolean(url && urlError)"
				@update:model-value="emit('update:url', String($event))" />
			<NcTextField v-if="valid"
				:model-value="title"
				:label="t('shortlinks', 'Title')"
				:helper-text="loading ? t('shortlinks', 'Loading page preview…') : t('shortlinks', 'Found automatically and editable.')"
				@update:model-value="updateTitle" />
			<span v-if="loading" class="link-preview-editor__loading" aria-live="polite">
				<NcLoadingIcon :size="18" />{{ t('shortlinks', 'Loading page preview…') }}
			</span>
		</div>
	</div>
</template>

<style scoped>
.link-preview-editor { min-inline-size: 0; }

.link-preview-editor--expanded { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: calc(var(--default-grid-baseline) * 3); padding: calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); }

.link-preview-editor__fields { display: grid; min-inline-size: 0; gap: calc(var(--default-grid-baseline) * 2); }

.link-preview-editor__loading { display: inline-flex; align-items: center; gap: var(--default-grid-baseline); color: var(--color-text-maxcontrast); font-size: .85rem; }

@media (max-width: 700px) {
	.link-preview-editor--expanded { grid-template-columns: 72px minmax(0, 1fr); }
	.link-preview-editor--expanded :deep(.link-thumbnail) { inline-size: 72px; block-size: 72px; }
}
</style>
