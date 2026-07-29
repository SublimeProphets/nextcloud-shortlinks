<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcAppSidebar from '@nextcloud/vue/components/NcAppSidebar'
import NcContent from '@nextcloud/vue/components/NcContent'
import { api } from './api/client'
import ContentToolbar from './components/ContentToolbar.vue'
import LinkList from './components/LinkList.vue'
import Navigation from './components/Navigation.vue'
import { useShortlinks } from './stores/useShortlinks'
import type { FolderIcon, ShortLink } from './types'

const store = useShortlinks()
const AppSettingsDialog = defineAsyncComponent(() => import('./components/AppSettingsDialog.vue'))
const BookmarkletDialog = defineAsyncComponent(() => import('./components/BookmarkletDialog.vue'))
const DashboardView = defineAsyncComponent(() => import('./components/DashboardView.vue'))
const FolderForm = defineAsyncComponent(() => import('./components/FolderForm.vue'))
const LinkDetail = defineAsyncComponent(() => import('./components/LinkDetail.vue'))
const LinkForm = defineAsyncComponent(() => import('./components/LinkForm.vue'))
const StatsOverview = defineAsyncComponent(() => import('./components/StatsOverview.vue'))
const TagForm = defineAsyncComponent(() => import('./components/TagForm.vue'))
const capabilities = loadState<{ redirectStatuses: number[] }>('shortlinks', 'capabilities')
const settings = loadState<{ titleFetch: boolean; allowedSchemes: string[]; baseUrl: string | null }>('shortlinks', 'settings')
const showCreate = ref(false)
const showFolderCreate = ref(false)
const showTagCreate = ref(false)
const showSettings = ref(false)
const showStats = ref(false)
const showBookmarklet = ref(false)
const selectedLink = ref<ShortLink | null>(null)
const editLink = ref<ShortLink | null>(null)
const prefill = new URLSearchParams(location.search)
const isDashboard = computed(() => store.state.system === 'dashboard' && store.state.folderId === null && store.state.tagIds.length === 0)

onMounted(async () => {
	await store.refresh()
	if (prefill.get('url')) showCreate.value = true
})

async function createFolder(value: { name: string; parentId: number | null; icon: FolderIcon }) {
	try {
		await api.createFolder(value.name, value.parentId, value.icon)
		showFolderCreate.value = false
		await store.refresh()
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function createTag(value: { name: string; color: string | null }) {
	try {
		await api.createTag(value.name, value.color)
		showTagCreate.value = false
		await store.refresh()
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}
</script>

<template>
	<NcContent app-name="shortlinks">
		<Navigation :folders="store.state.folders"
			:tags="store.state.tags"
			:active-system="store.state.system"
			:active-folder-id="store.state.folderId"
			:active-tag-ids="store.state.tagIds"
			@filter="store.setFilter($event.system, $event.folderId)"
			@tag="store.openTag($event)"
			@bookmarklet="showBookmarklet = true"
			@settings="showSettings = true" />
		<NcAppContent>
			<ContentToolbar :folders="store.state.folders"
				:tags="store.state.tags"
				:system="store.state.system"
				:folder-id="store.state.folderId"
				:tag-ids="store.state.tagIds"
				:tag-mode="store.state.tagMode"
				:search="store.state.search"
				:created-from="store.state.createdFrom"
				:active="store.state.active"
				:list-mode="!isDashboard"
				@create-link="showCreate = true"
				@create-folder="showFolderCreate = true"
				@create-tag="showTagCreate = true"
				@filter="store.setFilter($event.system, $event.folderId)"
				@open-tag="store.openTag($event)"
				@set-tags="store.setTagFilter($event.ids, $event.mode)"
				@search="store.setSearchFilters($event)"
				@overview="showStats = true"
				@refresh="store.refresh()" />
			<DashboardView v-if="isDashboard"
				:folders="store.state.folders"
				:tags="store.state.tags"
				:redirect-statuses="capabilities.redirectStatuses"
				:allowed-schemes="settings.allowedSchemes"
				:base-url="settings.baseUrl"
				:create="store.create" />
			<LinkList v-else
				:links="store.state.links"
				:folders="store.state.folders"
				:tags="store.state.tags"
				:loading="store.state.loading"
				:error="store.state.error"
				:selected="store.state.selected"
				:has-more="store.state.hasMore"
				:system="store.state.system"
				:sort="store.state.sort"
				:direction="store.state.direction"
				@create="showCreate = true"
				@open="selectedLink = $event"
				@options="store.setListOptions($event)"
				@toggle="store.toggleSelected($event)"
				@refresh="store.refresh()"
				@bulk="store.bulk($event)"
				@more="store.loadMore()" />
		</NcAppContent>
		<NcAppSidebar v-if="selectedLink" :name="selectedLink.title || selectedLink.slug" @close="selectedLink = null">
			<LinkDetail :link="selectedLink" @edit="editLink = $event" @changed="store.refresh(); selectedLink = null" />
		</NcAppSidebar>

		<LinkForm v-if="showCreate"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:redirect-statuses="capabilities.redirectStatuses"
			:allowed-schemes="settings.allowedSchemes"
			:base-url="settings.baseUrl"
			:allow-title-fetch="settings.titleFetch"
			:prefill-url="prefill.get('url') || ''"
			:prefill-title="prefill.get('title') || ''"
			@close="showCreate = false"
			@save="store.create($event).then(() => showCreate = false)" />
		<LinkForm v-if="editLink"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:redirect-statuses="capabilities.redirectStatuses"
			:allowed-schemes="settings.allowedSchemes"
			:base-url="settings.baseUrl"
			:allow-title-fetch="settings.titleFetch"
			:link="editLink"
			@close="editLink = null"
			@save="store.update(editLink, $event).then(() => { editLink = null; selectedLink = null })" />
		<FolderForm v-if="showFolderCreate"
			:folders="store.state.folders"
			@close="showFolderCreate = false"
			@save="createFolder" />
		<TagForm v-if="showTagCreate" @close="showTagCreate = false" @save="createTag" />
		<AppSettingsDialog v-model:open="showSettings"
			:folders="store.state.folders"
			:tags="store.state.tags"
			@changed="store.refresh()" />
		<BookmarkletDialog v-if="showBookmarklet" @close="showBookmarklet = false" />
		<StatsOverview v-if="showStats" @close="showStats = false" />
	</NcContent>
</template>
