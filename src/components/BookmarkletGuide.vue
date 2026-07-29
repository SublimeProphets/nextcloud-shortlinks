<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mdiBookmarkPlusOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'

withDefaults(defineProps<{ compact?: boolean; showHeading?: boolean }>(), { compact: false, showHeading: true })
const code = ref('')
const mobileAlternative = ref('')
const loading = ref(true)
const error = ref('')
let bookmarkletRequest: ReturnType<typeof api.bookmarklet> | null = null

onMounted(async () => {
	try {
		bookmarkletRequest ??= api.bookmarklet()
		const result = await bookmarkletRequest
		code.value = result.code
		mobileAlternative.value = result.mobileAlternative
	} catch (caught) {
		error.value = caught instanceof Error ? caught.message : String(caught)
		bookmarkletRequest = null
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<div class="bookmarklet-guide" :class="{ 'bookmarklet-guide--compact': compact }">
		<div v-if="showHeading" class="bookmarklet-guide__intro">
			<NcIconSvgWrapper :path="mdiBookmarkPlusOutline" :size="compact ? 28 : 36" aria-hidden="true" />
			<div>
				<h2>{{ t('shortlinks', 'Create links from any website') }}</h2>
				<p>{{ t('shortlinks', 'The bookmarklet turns the page you are viewing into a new short link without interrupting your flow.') }}</p>
			</div>
		</div>
		<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading bookmarklet')" :size="32" />
		<p v-else-if="error" class="error" role="alert">
			{{ error }}
		</p>
		<template v-else>
			<ol class="bookmarklet-guide__steps">
				<li>{{ t('shortlinks', 'Show your browser bookmarks bar.') }}</li>
				<li>{{ t('shortlinks', 'Drag the button below to the bookmarks bar.') }}</li>
				<li v-if="!compact">
					{{ t('shortlinks', 'Open any website and select the new bookmark.') }}
				</li>
			</ol>
			<div class="bookmarklet-guide__drag-area">
				<a :href="code"
					class="bookmarklet-guide__button button-vue button-vue--size-normal button-vue--vue-primary button-vue--primary"
					draggable="true"
					@click.prevent>
					<NcIconSvgWrapper :path="mdiBookmarkPlusOutline" :size="20" aria-hidden="true" />
					<span>{{ t('shortlinks', 'Add to Shortlinks') }}</span>
				</a>
				<span>{{ t('shortlinks', 'Drag this button') }}</span>
			</div>
			<p v-if="mobileAlternative && !compact" class="bookmarklet-guide__mobile">
				{{ mobileAlternative }}
			</p>
		</template>
	</div>
</template>

<style scoped>
.bookmarklet-guide { display: grid; gap: calc(var(--default-grid-baseline) * 4); }

.bookmarklet-guide__intro { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: calc(var(--default-grid-baseline) * 3); padding: calc(var(--default-grid-baseline) * 4); border-radius: var(--border-radius-large); background: var(--color-primary-element-light); }

.bookmarklet-guide__intro h2,
.bookmarklet-guide__intro p,
.bookmarklet-guide__mobile { margin: 0; }

.bookmarklet-guide__intro p { margin-block-start: var(--default-grid-baseline); color: var(--color-text-maxcontrast); }

.bookmarklet-guide__steps { display: grid; gap: calc(var(--default-grid-baseline) * 2); margin: 0; padding-inline-start: calc(var(--default-grid-baseline) * 6); }

.bookmarklet-guide__drag-area { display: flex; align-items: center; flex-wrap: wrap; gap: calc(var(--default-grid-baseline) * 3); padding: calc(var(--default-grid-baseline) * 4); border: 1px dashed var(--color-border-maxcontrast); border-radius: var(--border-radius-large); background: var(--color-background-dark); }

.bookmarklet-guide__button { display: inline-flex; align-items: center; gap: calc(var(--default-grid-baseline) * 2); min-block-size: 44px; padding-inline: calc(var(--default-grid-baseline) * 4); border-radius: var(--border-radius-pill); text-decoration: none; cursor: grab; }

.bookmarklet-guide__button:active { cursor: grabbing; }

.bookmarklet-guide__mobile { color: var(--color-text-maxcontrast); font-size: .9em; }

.bookmarklet-guide--compact { gap: calc(var(--default-grid-baseline) * 3); }

.bookmarklet-guide--compact .bookmarklet-guide__intro { padding: 0; background: transparent; }

.bookmarklet-guide--compact .bookmarklet-guide__intro h2 { font-size: 1.15rem; }

.bookmarklet-guide--compact .bookmarklet-guide__drag-area { padding: calc(var(--default-grid-baseline) * 3); }
</style>
