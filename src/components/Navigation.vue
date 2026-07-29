<script setup lang="ts">
import {
	mdiCalendarRemoveOutline,
	mdiCogOutline,
	mdiCursorDefaultClickOutline,
	mdiHistory,
	mdiLinkOff,
	mdiLinkVariant,
	mdiStarOutline,
	mdiTagOutline,
	mdiTrashCanOutline,
	mdiTrendingUp,
	mdiViewDashboardOutline,
} from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationCaption from '@nextcloud/vue/components/NcAppNavigationCaption'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { computed, ref, watch } from 'vue'
import type { Folder, Tag } from '../types'
import FolderNavigationItem from './FolderNavigationItem.vue'

const props = defineProps<{ folders: Folder[]; tags: Tag[]; activeSystem: string; activeFolderId: number | null; activeTagIds: number[] }>()
const emit = defineEmits<{
	filter: [value: { system: string; folderId: number | null }]
	tag: [id: number]
	settings: []
	createLink: [folderId: number]
	createFolder: [parentId: number]
	moveFolder: [folder: Folder]
	copyFolder: [folder: Folder]
	exportFolder: [folder: Folder]
	deleteFolder: [folder: Folder]
}>()
const systemItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: mdiViewDashboardOutline },
	{ id: 'all', label: 'All links', icon: mdiLinkVariant },
	{ id: 'favorites', label: 'Favorites', icon: mdiStarOutline },
	{ id: 'trending', label: 'Trending links', icon: mdiTrendingUp },
	{ id: 'recent', label: 'Recently created', icon: mdiHistory },
	{ id: 'used', label: 'Recently used', icon: mdiCursorDefaultClickOutline },
	{ id: 'expired', label: 'Expired', icon: mdiCalendarRemoveOutline },
	{ id: 'inactive', label: 'Inactive', icon: mdiLinkOff },
]
const expandedIds = ref(new Set<number>())
const rootFolders = computed(() => props.folders
	.filter(folder => folder.parentId === null)
	.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)))

watch([() => props.folders, () => props.activeFolderId], () => {
	const next = new Set(expandedIds.value)
	if (next.size === 0) rootFolders.value.forEach(folder => next.add(folder.id))
	let current = props.activeFolderId
	while (current !== null) {
		const folder = props.folders.find(item => item.id === current)
		if (!folder) break
		if (folder.parentId !== null) next.add(folder.parentId)
		current = folder.parentId
	}
	expandedIds.value = next
}, { immediate: true, deep: true })

function toggleFolder(value: { id: number; open: boolean }) {
	const next = new Set(expandedIds.value)
	value.open ? next.add(value.id) : next.delete(value.id)
	expandedIds.value = next
}
</script>

<template>
	<NcAppNavigation :aria-label="t('shortlinks', 'Shortlinks navigation')">
		<ul class="navigation-section navigation-section--main">
			<NcAppNavigationItem v-for="item in systemItems"
				:key="item.id"
				:name="t('shortlinks', item.label)"
				:active="activeSystem === item.id && activeFolderId === null"
				@click="emit('filter', { system: item.id, folderId: null })">
				<template #icon>
					<NcIconSvgWrapper :path="item.icon" />
				</template>
			</NcAppNavigationItem>

			<NcAppNavigationCaption :name="t('shortlinks', 'Folders')" />
			<FolderNavigationItem v-for="folder in rootFolders"
				:key="folder.id"
				:folder="folder"
				:folders="folders"
				:active-folder-id="activeFolderId"
				:expanded-ids="expandedIds"
				@select="emit('filter', { system: 'all', folderId: $event.id })"
				@toggle="toggleFolder"
				@create-link="emit('createLink', $event.id)"
				@create-folder="emit('createFolder', $event.id)"
				@move="emit('moveFolder', $event)"
				@copy="emit('copyFolder', $event)"
				@export="emit('exportFolder', $event)"
				@delete="emit('deleteFolder', $event)" />

			<NcAppNavigationCaption :name="t('shortlinks', 'Tags')" />
			<NcAppNavigationItem v-for="tag in tags"
				:key="tag.id"
				:name="tag.name"
				:counter-number="tag.count"
				:active="activeTagIds.includes(tag.id)"
				@click="emit('tag', tag.id)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiTagOutline" />
				</template>
			</NcAppNavigationItem>
		</ul>
		<template #footer>
			<ul class="navigation-section navigation-section--footer">
				<NcAppNavigationItem :name="t('shortlinks', 'Trash')"
					:active="activeSystem === 'trash' && activeFolderId === null"
					@click="emit('filter', { system: 'trash', folderId: null })">
					<template #icon>
						<NcIconSvgWrapper :path="mdiTrashCanOutline" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem :name="t('shortlinks', 'Settings')" @click="emit('settings')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiCogOutline" />
					</template>
				</NcAppNavigationItem>
			</ul>
		</template>
	</NcAppNavigation>
</template>

<style scoped>
.navigation-section {
	display: flex;
	inline-size: 100%;
	margin: 0;
	padding: var(--app-navigation-padding);
	flex-direction: column;
	gap: var(--default-grid-baseline);
	list-style: none;
}

.navigation-section--footer {
	flex: 0 0 auto;
	padding-block-start: calc(var(--default-grid-baseline) * 2);
	border-block-start: 1px solid var(--color-border);
}
</style>
