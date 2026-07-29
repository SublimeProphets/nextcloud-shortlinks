<script setup lang="ts">
import {
	mdiBookmarkPlusOutline,
	mdiCalendarRemoveOutline,
	mdiCogOutline,
	mdiCursorDefaultClickOutline,
	mdiHistory,
	mdiLinkOff,
	mdiLinkVariant,
	mdiStarOutline,
	mdiTagOutline,
	mdiTrashCanOutline,
	mdiViewDashboardOutline,
} from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationCaption from '@nextcloud/vue/components/NcAppNavigationCaption'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { folderIconPath } from '../folderIcons'
import type { Folder, Tag } from '../types'

const props = defineProps<{ folders: Folder[]; tags: Tag[]; activeSystem: string; activeFolderId: number | null; activeTagIds: number[] }>()
const emit = defineEmits<{ filter: [value: { system: string; folderId: number | null }]; tag: [id: number]; bookmarklet: []; settings: [] }>()
const systemItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: mdiViewDashboardOutline },
	{ id: 'all', label: 'All links', icon: mdiLinkVariant },
	{ id: 'favorites', label: 'Favorites', icon: mdiStarOutline },
	{ id: 'recent', label: 'Recently created', icon: mdiHistory },
	{ id: 'used', label: 'Recently used', icon: mdiCursorDefaultClickOutline },
	{ id: 'expired', label: 'Expired', icon: mdiCalendarRemoveOutline },
	{ id: 'inactive', label: 'Inactive', icon: mdiLinkOff },
	{ id: 'trash', label: 'Trash', icon: mdiTrashCanOutline },
]

function folderName(folder: Folder): string {
	let depth = 0
	let parentId = folder.parentId
	while (parentId !== null && depth < 10) {
		const parent = props.folders.find(item => item.id === parentId)
		if (!parent) break
		depth++
		parentId = parent.parentId
	}
	return `${'— '.repeat(depth)}${folder.name}`
}
</script>

<template>
	<NcAppNavigation :aria-label="t('shortlinks', 'Shortlinks navigation')">
		<ul>
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
			<NcAppNavigationItem v-for="folder in folders"
				:key="folder.id"
				:name="folderName(folder)"
				:counter-number="folder.count"
				:active="activeFolderId === folder.id"
				@click="emit('filter', { system: 'all', folderId: folder.id })">
				<template #icon>
					<NcIconSvgWrapper :path="folderIconPath(folder.icon)" />
				</template>
			</NcAppNavigationItem>
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
			<NcAppNavigationItem pinned :name="t('shortlinks', 'Create bookmarklet')" @click="emit('bookmarklet')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiBookmarkPlusOutline" />
				</template>
			</NcAppNavigationItem>
			<NcAppNavigationItem pinned :name="t('shortlinks', 'App settings')" @click="emit('settings')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiCogOutline" />
				</template>
			</NcAppNavigationItem>
		</ul>
	</NcAppNavigation>
</template>
