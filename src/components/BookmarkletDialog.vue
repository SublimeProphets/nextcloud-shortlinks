<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mdiBookmarkPlusOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'

const emit = defineEmits<{ close: [] }>()
const code = ref('')
const mobileAlternative = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
	try {
		const result = await api.bookmarklet()
		code.value = result.code
		mobileAlternative.value = result.mobileAlternative
	} catch (caught) {
		error.value = caught instanceof Error ? caught.message : String(caught)
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<NcDialog :name="t('shortlinks', 'Create bookmarklet')" size="normal" @closing="emit('close')">
		<div class="bookmarklet-dialog">
			<div class="bookmarklet-intro">
				<NcIconSvgWrapper :path="mdiBookmarkPlusOutline" :size="36" aria-hidden="true" />
				<p>{{ t('shortlinks', 'Create a short link for the page you are viewing without opening Shortlinks first.') }}</p>
			</div>

			<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading bookmarklet')" :size="32" />
			<p v-else-if="error" class="error" role="alert">
				{{ error }}
			</p>
			<template v-else>
				<ol class="bookmarklet-steps">
					<li>{{ t('shortlinks', 'Show your browser bookmarks bar.') }}</li>
					<li>{{ t('shortlinks', 'Drag the button below to the bookmarks bar.') }}</li>
					<li>{{ t('shortlinks', 'Open any website and select the new bookmark.') }}</li>
				</ol>
				<div class="bookmarklet-drag-area">
					<a :href="code"
						class="bookmarklet-drag-button button-vue button-vue--size-normal button-vue--vue-primary button-vue--primary"
						draggable="true"
						@click.prevent>
						<NcIconSvgWrapper :path="mdiBookmarkPlusOutline" :size="20" aria-hidden="true" />
						<span>{{ t('shortlinks', 'Add to Shortlinks') }}</span>
					</a>
					<span>{{ t('shortlinks', 'Drag this button') }}</span>
				</div>
				<p v-if="mobileAlternative" class="bookmarklet-mobile">
					{{ mobileAlternative }}
				</p>
			</template>
		</div>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Close') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.bookmarklet-dialog {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 4);
	padding-block: calc(var(--default-grid-baseline) * 2);
}

.bookmarklet-intro {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 3);
	padding: calc(var(--default-grid-baseline) * 4);
	border-radius: var(--border-radius-large);
	background: var(--color-primary-element-light);
}

.bookmarklet-intro p,
.bookmarklet-mobile {
	margin: 0;
}

.bookmarklet-steps {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 2);
	margin: 0;
	padding-inline-start: calc(var(--default-grid-baseline) * 6);
}

.bookmarklet-drag-area {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: calc(var(--default-grid-baseline) * 3);
	padding: calc(var(--default-grid-baseline) * 4);
	border: 1px dashed var(--color-border-maxcontrast);
	border-radius: var(--border-radius-large);
	background: var(--color-background-dark);
}

.bookmarklet-drag-button {
	display: inline-flex;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 2);
	min-block-size: 44px;
	padding-inline: calc(var(--default-grid-baseline) * 4);
	border-radius: var(--border-radius-pill);
	text-decoration: none;
	cursor: grab;
}

.bookmarklet-drag-button:active {
	cursor: grabbing;
}

.bookmarklet-mobile {
	color: var(--color-text-maxcontrast);
	font-size: 0.9em;
}
</style>
