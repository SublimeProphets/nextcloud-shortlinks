<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import QuickLinkCreator from './QuickLinkCreator.vue'
import type { Folder, LinkDraft, Tag } from '../types'

withDefaults(defineProps<{
	folders: Folder[]
	tags: Tag[]
	redirectStatuses?: number[]
	allowedSchemes?: string[]
	baseUrl?: string | null
	create: (draft: Partial<LinkDraft>) => Promise<void>
}>(), {
	redirectStatuses: () => [301, 302, 307, 308],
	allowedSchemes: () => ['http', 'https'],
	baseUrl: null,
})
</script>

<template>
	<main class="dashboard-view" aria-labelledby="dashboard-heading">
		<h1 id="dashboard-heading" class="visually-hidden">
			{{ t('shortlinks', 'Dashboard') }}
		</h1>
		<QuickLinkCreator :folders="folders"
			:tags="tags"
			:redirect-statuses="redirectStatuses"
			:allowed-schemes="allowedSchemes"
			:base-url="baseUrl"
			:create="create" />
	</main>
</template>

<style scoped>
.dashboard-view {
	inline-size: 100%;
	padding: clamp(16px, 3vw, 32px);
}
</style>
