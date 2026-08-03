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
import type { Folder, FolderIcon, LinkPage, LinkPageDraft, ShortLink, UserSettings } from './types'

const store = useShortlinks()
const AppSettingsDialog = defineAsyncComponent(() => import('./components/AppSettingsDialog.vue'))
const DashboardView = defineAsyncComponent(() => import('./components/DashboardView.vue'))
const FolderDeleteDialog = defineAsyncComponent(() => import('./components/FolderDeleteDialog.vue'))
const FolderDestinationDialog = defineAsyncComponent(() => import('./components/FolderDestinationDialog.vue'))
const FolderForm = defineAsyncComponent(() => import('./components/FolderForm.vue'))
const LinkDetail = defineAsyncComponent(() => import('./components/LinkDetail.vue'))
const LinkForm = defineAsyncComponent(() => import('./components/LinkForm.vue'))
const PageEditor = defineAsyncComponent(() => import('./components/PageEditor.vue'))
const PageList = defineAsyncComponent(() => import('./components/PageList.vue'))
const StatsOverview = defineAsyncComponent(() => import('./components/StatsOverview.vue'))
const TagForm = defineAsyncComponent(() => import('./components/TagForm.vue'))
const capabilities = loadState<{ redirectStatuses: number[] }>('shortlinks', 'capabilities')
const settings = reactive(loadState<{ titleFetch: boolean; useThumbnails: boolean; showQuickStart: boolean; allowedSchemes: string[]; shortUrlTemplate: string | null }>('shortlinks', 'settings'))
const showCreate = ref(false)
const showFolderCreate = ref(false)
const showTagCreate = ref(false)
const showSettings = ref(false)
const showStats = ref(false)
const statsPagePeriod = ref<'7d' | '30d' | '90d' | 'thisYear' | 'lastYear' | 'all' | 'custom'>('30d')
const statsPageFrom = ref('')
const statsPageTo = ref('')
const statsDialogContext = ref<{ title: string; color: string | null; filters: Record<string, unknown> }>({ title: '', color: null, filters: {} })
const createFolderParentId = ref<number | null>(null)
const createLinkFolderId = ref<number | null>(null)
const createLinkTagIds = ref<number[]>([])
const destinationFolder = ref<Folder | null>(null)
const destinationMode = ref<'move' | 'copy'>('move')
const deletingFolder = ref<Folder | null>(null)
const selectedLink = ref<ShortLink | null>(null)
const editLink = ref<ShortLink | null>(null)
const pages = ref<LinkPage[]>([])
const pagesLoading = ref(false)
const editingPage = ref<LinkPage | 'new' | null>(null)
const createPageFolderId = ref<number | null>(null)
const createPageTagIds = ref<number[]>([])
const prefill = new URLSearchParams(location.search)
const isDashboard = computed(() => store.state.system === 'dashboard' && store.state.folderId === null && store.state.tagIds.length === 0)
const isStatistics = computed(() => store.state.system === 'statistics')
const isPages = computed(() => store.state.system.startsWith('pages-'))
const isTrash = computed(() => store.state.system === 'trash')

onMounted(async () => {
	await store.refresh()
	if (isPages.value || isTrash.value) await loadPages()
	if (prefill.get('url')) showCreate.value = true
})

async function loadPages() {
	pagesLoading.value = true
	try {
		const filter = isTrash.value ? 'trash' : store.state.system.replace(/^pages-/, '')
		pages.value = (await api.listPages(filter, 1, 100)).items
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally { pagesLoading.value = false }
}

async function selectNavigationView(value: { system: string; folderId: number | null }) {
	if (value.system.startsWith('pages-')) {
		store.state.system = value.system
		store.state.folderId = null
		store.state.tagIds = []
		store.state.selected.clear()
		editingPage.value = null
		await loadPages()
		return
	}
	await store.setFilter(value.system, value.folderId)
	if (value.system === 'trash') await loadPages()
}

function openPageCreate(value?: { folderId?: number; tagId?: number }) {
	createPageFolderId.value = value?.folderId ?? (store.state.folderId ?? null)
	createPageTagIds.value = value?.tagId ? [value.tagId] : [...store.state.tagIds]
	editingPage.value = 'new'
}

async function savePage(draft: LinkPageDraft) {
	try {
		if (editingPage.value && editingPage.value !== 'new') await api.updatePage(editingPage.value.id, draft)
		else await api.createPage(draft)
		showSuccess(t('shortlinks', editingPage.value === 'new' ? 'Page created' : 'Page saved'))
		editingPage.value = null
		createPageFolderId.value = null
		createPageTagIds.value = []
		if (!isPages.value) store.state.system = 'pages-all'
		await loadPages()
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function deletePage(page: LinkPage, permanent: boolean) {
	if (permanent && !window.confirm(t('shortlinks', 'Permanently delete “{title}”? This cannot be undone.', { title: page.title }))) return
	try { await api.deletePage(page.id, permanent); showSuccess(t('shortlinks', permanent ? 'Page permanently deleted' : 'Page moved to trash')); await loadPages() } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function restorePage(page: LinkPage) {
	try { await api.restorePage(page.id); showSuccess(t('shortlinks', 'Page restored')); await loadPages() } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

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

function openLinkCreate(folderId?: number | null, tagIds?: number[]) {
	createLinkFolderId.value = folderId === undefined ? store.state.folderId : folderId
	createLinkTagIds.value = tagIds ?? [...store.state.tagIds]
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

function currentStatsContext(): { title: string; color: string | null; filters: Record<string, unknown> } {
	const folder = store.state.folders.find(item => item.id === store.state.folderId)
	const activeTags = store.state.tags.filter(tag => store.state.tagIds.includes(tag.id))
	const systemLabels: Record<string, string> = { all: 'All links', favorites: 'Favorites', trending: 'Trending links', recent: 'Recently created', used: 'Recently used', expired: 'Expired', inactive: 'Inactive', trash: 'Trash' }
	return {
		title: folder?.name || (activeTags.length ? activeTags.map(tag => tag.name).join(', ') : t('shortlinks', systemLabels[store.state.system] || 'All links')),
		color: activeTags.length === 1 ? activeTags[0]?.color ?? null : null,
		filters: { system: store.state.system, folderId: store.state.folderId ?? undefined, tagIds: [...store.state.tagIds], tagMode: store.state.tagMode, active: store.state.active ?? undefined },
	}
}

function openViewStats() {
	statsDialogContext.value = currentStatsContext()
	showStats.value = true
}

function openStatisticsPage(value: { period: typeof statsPagePeriod.value; from?: string; to?: string }) {
	statsPagePeriod.value = value.period
	statsPageFrom.value = value.from ?? ''
	statsPageTo.value = value.to ?? ''
	store.state.system = 'statistics'
	store.state.folderId = null
	store.state.tagIds = []
	store.state.selected.clear()
}

function applyUserSettings(value: UserSettings) {
	settings.shortUrlTemplate = value.shortUrlTemplate
	settings.titleFetch = value.metadataCollectionEnabled && value.metadataAutocomplete
	settings.useThumbnails = value.useThumbnails
	settings.showQuickStart = value.showQuickStart
}
</script>

<template>
	<NcContent app-name="shortlinks">
		<Navigation :folders="store.state.folders"
			:tags="store.state.tags"
			:active-system="store.state.system"
			:active-folder-id="store.state.folderId"
			:active-tag-ids="store.state.tagIds"
			@filter="selectNavigationView($event)"
			@tag="store.openTag($event)"
			@create-link="openLinkCreate($event)"
			@create-folder="openFolderCreate($event)"
			@create-page="openPageCreate($event)"
			@move-folder="openFolderDestination($event, 'move')"
			@copy-folder="openFolderDestination($event, 'copy')"
			@export-folder="exportFolder($event)"
			@delete-folder="deletingFolder = $event"
			@statistics="openStatisticsPage"
			@settings="showSettings = true" />
		<NcAppContent>
			<ContentToolbar v-if="!editingPage && !isPages"
				:folders="store.state.folders"
				:tags="store.state.tags"
				:system="store.state.system"
				:folder-id="store.state.folderId"
				:tag-ids="store.state.tagIds"
				:tag-mode="store.state.tagMode"
				:search="store.state.search"
				:created-from="store.state.createdFrom"
				:active="store.state.active"
				:list-mode="!isDashboard && !isStatistics"
				@create-link="openLinkCreate()"
				@create-folder="openFolderCreate(store.state.folderId)"
				@create-page="openPageCreate()"
				@create-tag="showTagCreate = true"
				@filter="store.setFilter($event.system, $event.folderId)"
				@open-tag="store.openTag($event)"
				@set-tags="store.setTagFilter($event.ids, $event.mode)"
				@search="store.setSearchFilters($event)"
				@overview="openViewStats"
				@refresh="store.refresh()" />
			<PageEditor v-if="editingPage"
				:page="editingPage === 'new' ? undefined : editingPage"
				:folders="store.state.folders"
				:tags="store.state.tags"
				:prefill-folder-id="createPageFolderId"
				:prefill-tag-ids="createPageTagIds"
				@close="editingPage = null; createPageFolderId = null; createPageTagIds = []"
				@save="savePage" />
			<StatsOverview v-else-if="isStatistics"
				:key="`${statsPagePeriod}-${statsPageFrom}-${statsPageTo}`"
				mode="page"
				:context-title="t('shortlinks', 'All links')"
				:filters="{ system: 'all' }"
				:initial-period="statsPagePeriod"
				:initial-from="statsPageFrom"
				:initial-to="statsPageTo" />
			<DashboardView v-else-if="isDashboard"
				:folders="store.state.folders"
				:tags="store.state.tags"
				:redirect-statuses="capabilities.redirectStatuses"
				:allowed-schemes="settings.allowedSchemes"
				:short-url-template="settings.shortUrlTemplate"
				:allow-title-fetch="settings.titleFetch"
				:use-thumbnails="settings.useThumbnails"
				:show-quick-start="settings.showQuickStart"
				:create="store.create"
				@open="selectedLink = $event"
				@changed="store.refresh()"
				@settings-saved="applyUserSettings" />
			<PageList v-else-if="isPages"
				:pages="pages"
				:loading="pagesLoading"
				@create="openPageCreate()"
				@edit="editingPage = $event"
				@delete="deletePage"
				@restore="restorePage" />
			<template v-else>
				<PageList v-if="isTrash"
					:pages="pages"
					:loading="pagesLoading"
					trash
					@create="openPageCreate()"
					@edit="editingPage = $event"
					@delete="deletePage"
					@restore="restorePage" />
				<LinkList :links="store.state.links"
					:folders="store.state.folders"
					:tags="store.state.tags"
					:loading="store.state.loading"
					:error="store.state.error"
					:selected="store.state.selected"
					:has-more="store.state.hasMore"
					:system="store.state.system"
					:sort="store.state.sort"
					:direction="store.state.direction"
					:use-thumbnails="settings.useThumbnails"
					@create="showCreate = true"
					@open="selectedLink = $event"
					@options="store.setListOptions($event)"
					@toggle="store.toggleSelected($event)"
					@select-all="store.setSelected($event)"
					@refresh="store.refresh()"
					@bulk="store.bulk($event)"
					@more="store.loadMore()" />
			</template>
		</NcAppContent>
		<NcAppSidebar v-if="selectedLink"
			:name="selectedLink.title || selectedLink.slug"
			:background="selectedLink.mediaMime?.startsWith('video/') ? '' : (selectedLink.mediaUrl || selectedLink.thumbnailMediaUrl || '')"
			:starred="selectedLink.favorite"
			@close="selectedLink = null">
			<LinkDetail :link="selectedLink"
				:folders="store.state.folders"
				@edit="editLink = $event"
				@changed="store.refresh(); selectedLink = null" />
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
			:prefill-tag-ids="createLinkTagIds"
			@close="showCreate = false; createLinkFolderId = null; createLinkTagIds = []"
			@save="store.create($event).then(() => { showCreate = false; createLinkFolderId = null; createLinkTagIds = [] })" />
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
			@settings-saved="applyUserSettings"
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
		<StatsOverview v-if="showStats"
			:context-title="statsDialogContext.title"
			:context-color="statsDialogContext.color"
			:filters="statsDialogContext.filters"
			@close="showStats = false" />
	</NcContent>
</template>
