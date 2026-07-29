<script setup lang="ts">
import {
	mdiContentCopy,
	mdiDeleteOutline,
	mdiExportVariant,
	mdiFolderMoveOutline,
	mdiFolderPlusOutline,
	mdiLinkPlus,
} from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { computed } from 'vue'
import { folderIconPath } from '../folderIcons'
import type { Folder } from '../types'

defineOptions({ name: 'FolderNavigationItem' })
const props = defineProps<{
	folder: Folder
	folders: Folder[]
	activeFolderId: number | null
	expandedIds: Set<number>
}>()
const emit = defineEmits<{
	select: [folder: Folder]
	toggle: [value: { id: number; open: boolean }]
	createLink: [folder: Folder]
	createFolder: [folder: Folder]
	move: [folder: Folder]
	copy: [folder: Folder]
	export: [folder: Folder]
	delete: [folder: Folder]
}>()
const children = computed(() => props.folders
	.filter(folder => folder.parentId === props.folder.id)
	.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)))
const expanded = computed(() => props.expandedIds.has(props.folder.id))
</script>

<template>
	<NcAppNavigationItem :name="folder.name"
		:counter-number="folder.count"
		:active="activeFolderId === folder.id"
		:allow-collapse="children.length > 0"
		:open="expanded"
		:force-menu="true"
		:actions-aria-label="t('shortlinks', 'Folder actions for {name}', { name: folder.name })"
		@update:open="emit('toggle', { id: folder.id, open: $event })"
		@click="emit('select', folder)">
		<template #icon>
			<NcIconSvgWrapper :path="folderIconPath(folder.icon)" />
		</template>
		<template #actions>
			<NcActionButton :name="t('shortlinks', 'Create link in folder')" @click="emit('createLink', folder)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiLinkPlus" />
				</template>
			</NcActionButton>
			<NcActionButton :name="t('shortlinks', 'New subfolder')" @click="emit('createFolder', folder)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderPlusOutline" />
				</template>
			</NcActionButton>
			<NcActionSeparator />
			<NcActionButton :name="t('shortlinks', 'Move')" @click="emit('move', folder)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderMoveOutline" />
				</template>
			</NcActionButton>
			<NcActionButton :name="t('shortlinks', 'Copy')" @click="emit('copy', folder)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiContentCopy" />
				</template>
			</NcActionButton>
			<NcActionButton :name="t('shortlinks', 'Export')" @click="emit('export', folder)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiExportVariant" />
				</template>
			</NcActionButton>
			<NcActionButton :name="t('shortlinks', 'Delete')" @click="emit('delete', folder)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiDeleteOutline" />
				</template>
			</NcActionButton>
		</template>

		<FolderNavigationItem v-for="child in children"
			:key="child.id"
			:folder="child"
			:folders="folders"
			:active-folder-id="activeFolderId"
			:expanded-ids="expandedIds"
			@select="emit('select', $event)"
			@toggle="emit('toggle', $event)"
			@create-link="emit('createLink', $event)"
			@create-folder="emit('createFolder', $event)"
			@move="emit('move', $event)"
			@copy="emit('copy', $event)"
			@export="emit('export', $event)"
			@delete="emit('delete', $event)" />
	</NcAppNavigationItem>
</template>
