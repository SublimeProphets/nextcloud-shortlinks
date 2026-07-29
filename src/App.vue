<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref } from 'vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcAppSidebar from '@nextcloud/vue/components/NcAppSidebar'
import NcContent from '@nextcloud/vue/components/NcContent'
import { api } from './api/client'
import ContentToolbar from './components/ContentToolbar.vue'
import LinkList from './components/LinkList.vue'
import Navigation from './components/Navigation.vue'
import { useShortlinks } from './stores/useShortlinks'
import type { Folder, FolderIcon, ShortLink } from './types'

const store = useShortlinks()
const AppSettingsDialog = defineAsyncComponent(() => import('./components/AppSettingsDialog.vue'))
const DashboardView = defineAsyncComponent(() => import('./components/DashboardView.vue'))
const FolderDeleteDialog = defineAsyncComponent(() => import('./components/FolderDeleteDialog.vue'))
const FolderDestinationDialog = defineAsyncComponent(() => import('./components/FolderDestinationDialog.vue'))
const FolderForm = defineAsyncComponent(() => import('./components/FolderForm.vue'))
const LinkDetail = defineAsyncComponent(() => import('./components/LinkDetail.vue'))
const LinkForm = defineAsyncComponent(() => import('./components/LinkForm.vue'))
const StatsOverview = defineAsyncComponent(() => import('./components/StatsOverview.vue'))
const TagForm = defineAsyncComponent(() => import('./components/TagForm.vue'))
const capabilities = loadState<{ redirectStatuses: number[] }>('shortlinks', 'capabilities')
const settings = reactive(loadState<{ titleFetch: boolean; allowedSchemes: string[]; shortUrlTemplate: string | null }>('shortlinks', 'settings'))
const showCreate = ref(false)
const showFolderCreate = ref(false)
const showTagCreate = ref(false)
const showSettings = ref(false)
const showStats = ref(false)
const createFolderParentId = ref<number | null>(null)
const createLinkFolderId = ref<number | null>(null)
const destinationFolder = ref<Folder | null>(null)
const destinationMode = ref<'move' | 'copy'>('move')
const deletingFolder = ref<Folder | null>(null)
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
		createFolderParentId.value = null
		await store.refresh()
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

function openFolderCreate(parentId: number | null = null) {
	createFolderParentId.value = parentId
	showFolderCreate.value = true
}

function openLinkCreate(folderId: number | null = null) {
	createLinkFolderId.value = folderId
	showCreate.value = true
}

function openFolderDestination(folder: Folder, mode: 'move' | 'copy') {
	destinationFolder.value = folder
	destinationMode.value = mode
}

async function saveFolderDestination(parentId: number | null) {
	if (!destinationFolder.value) return
	try {
		if (destinationMode.value === 'move') {
			await api.updateFolder(destinationFolder.value.id, { parentId })
			showSuccess(t('shortlinks', 'Folder moved'))
		} else {
			await api.copyFolder(destinationFolder.value.id, parentId)
			showSuccess(t('shortlinks', 'Folder copied'))
		}
		destinationFolder.value = null
		await store.refresh()
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function exportFolder(folder: Folder) {
	try {
		const folderIds = [folder.id]
		for (let index = 0; index < folderIds.length; index++) {
			store.state.folders.filter(item => item.parentId === folderIds[index]).forEach(item => folderIds.push(item.id))
		}
		const result = await api.exportLinks('json', { system: 'all', folderIds })
		const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }))
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = `${folder.name}-${result.filename}`
		anchor.click()
		URL.revokeObjectURL(url)
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function deleteFolder(deleteLinks: boolean) {
	if (!deletingFolder.value) return
	try {
		await api.deleteFolder(deletingFolder.value.id, deleteLinks)
		deletingFolder.value = null
		showSuccess(t('shortlinks', 'Folder deleted'))
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
			@create-link="openLinkCreate($event)"
			@create-folder="openFolderCreate($event)"
			@move-folder="openFolderDestination($event, 'move')"
			@copy-folder="openFolderDestination($event, 'copy')"
			@export-folder="exportFolder($event)"
			@delete-folder="deletingFolder = $event"
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
				@create-link="openLinkCreate()"
				@create-folder="openFolderCreate()"
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
				:short-url-template="settings.shortUrlTemplate"
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
			:short-url-template="settings.shortUrlTemplate"
			:allow-title-fetch="settings.titleFetch"
			:prefill-url="prefill.get('url') || ''"
			:prefill-title="prefill.get('title') || ''"
			:prefill-folder-id="createLinkFolderId"
			@close="showCreate = false; createLinkFolderId = null"
			@save="store.create($event).then(() => { showCreate = false; createLinkFolderId = null })" />
		<LinkForm v-if="editLink"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:redirect-statuses="capabilities.redirectStatuses"
			:allowed-schemes="settings.allowedSchemes"
			:short-url-template="settings.shortUrlTemplate"
			:allow-title-fetch="settings.titleFetch"
			:link="editLink"
			@close="editLink = null"
			@save="store.update(editLink, $event).then(() => { editLink = null; selectedLink = null })" />
		<FolderForm v-if="showFolderCreate"
			:folders="store.state.folders"
			:prefill-parent-id="createFolderParentId"
			@close="showFolderCreate = false; createFolderParentId = null"
			@save="createFolder" />
		<TagForm v-if="showTagCreate" @close="showTagCreate = false" @save="createTag" />
		<AppSettingsDialog v-model:open="showSettings"
			:folders="store.state.folders"
			:tags="store.state.tags"
			@settings-saved="settings.shortUrlTemplate = $event"
			@changed="store.refresh()" />
		<FolderDestinationDialog v-if="destinationFolder"
			:folder="destinationFolder"
			:folders="store.state.folders"
			:mode="destinationMode"
			@close="destinationFolder = null"
			@save="saveFolderDestination" />
		<FolderDeleteDialog v-if="deletingFolder"
			:folder="deletingFolder"
			:folders="store.state.folders"
			@close="deletingFolder = null"
			@delete="deleteFolder" />
		<StatsOverview v-if="showStats" @close="showStats = false" />
	</NcContent>
</template>
