<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	mdiArrowDown,
	mdiArrowUp,
	mdiDeleteOutline,
	mdiFolderMultipleOutline,
	mdiFolderRemoveOutline,
	mdiInformationOutline,
	mdiLinkVariant,
	mdiMerge,
	mdiPencilOutline,
	mdiPlus,
	mdiTagMultipleOutline,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcAppSettingsDialog from '@nextcloud/vue/components/NcAppSettingsDialog'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcFormBoxButton from '@nextcloud/vue/components/NcFormBoxButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import { api } from '../api/client'
import { folderIconPath } from '../folderIcons'
import type { Folder, FolderIcon, Tag } from '../types'
import FolderForm from './FolderForm.vue'
import TagForm from './TagForm.vue'

const props = defineProps<{ open: boolean; folders: Folder[]; tags: Tag[] }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; changed: [] }>()
const editingFolder = ref<Folder | null>(null)
const creatingFolder = ref(false)
const deletingFolder = ref<Folder | null>(null)
const editingTag = ref<Tag | null>(null)
const creatingTag = ref(false)
const mergingTag = ref<Tag | null>(null)
const mergeTargetId = ref<number | null>(null)
const draggedFolder = ref<Folder | null>(null)
const dropTargetId = ref<number | null>(null)

const orderedFolders = computed(() => {
	const result: Array<{ folder: Folder; depth: number }> = []
	function append(parentId: number | null, depth: number) {
		props.folders
			.filter(folder => folder.parentId === parentId)
			.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
			.forEach(folder => {
				result.push({ folder, depth })
				append(folder.id, depth + 1)
			})
	}
	append(null, 0)
	return result
})

const deleteLinkCount = computed(() => {
	if (!deletingFolder.value) return 0
	const ids = new Set<number>([deletingFolder.value.id])
	for (let changed = true; changed;) {
		changed = false
		for (const folder of props.folders) {
			if (folder.parentId !== null && ids.has(folder.parentId) && !ids.has(folder.id)) {
				ids.add(folder.id)
				changed = true
			}
		}
	}
	return props.folders.filter(folder => ids.has(folder.id)).reduce((sum, folder) => sum + folder.count, 0)
})

function siblings(folder: Folder): Folder[] {
	return props.folders
		.filter(item => item.parentId === folder.parentId)
		.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
}

function linkCountLabel(count: number): string {
	return count === 1
		? t('shortlinks', '{count} link', { count })
		: t('shortlinks', '{count} links', { count })
}

async function saveFolder(value: { name: string; parentId: number | null; icon: FolderIcon }) {
	try {
		if (editingFolder.value) {
			await api.updateFolder(editingFolder.value.id, value)
			editingFolder.value = null
		} else {
			await api.createFolder(value.name, value.parentId, value.icon)
			creatingFolder.value = false
		}
		emit('changed')
		showSuccess(t('shortlinks', 'Folder saved'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function moveFolder(folder: Folder, offset: -1 | 1) {
	const current = siblings(folder)
	const index = current.findIndex(item => item.id === folder.id)
	const target = index + offset
	if (index < 0 || target < 0 || target >= current.length) return
	const ids = current.map(item => item.id)
	const [moved] = ids.splice(index, 1)
	if (moved === undefined) return
	ids.splice(target, 0, moved)
	await reorder(folder.parentId, ids)
}

async function reorder(parentId: number | null, ids: number[]) {
	try {
		await api.reorderFolders(parentId, ids)
		emit('changed')
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

function dragStart(folder: Folder, event: DragEvent) {
	draggedFolder.value = folder
	event.dataTransfer?.setData('text/plain', String(folder.id))
	if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function dragOver(folder: Folder, event: DragEvent) {
	if (draggedFolder.value?.parentId !== folder.parentId || draggedFolder.value.id === folder.id) return
	event.preventDefault()
	dropTargetId.value = folder.id
	if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

async function drop(folder: Folder, event: DragEvent) {
	event.preventDefault()
	const source = draggedFolder.value
	draggedFolder.value = null
	dropTargetId.value = null
	if (!source || source.parentId !== folder.parentId || source.id === folder.id) return
	const ids = siblings(folder).map(item => item.id).filter(id => id !== source.id)
	ids.splice(ids.indexOf(folder.id), 0, source.id)
	await reorder(folder.parentId, ids)
}

async function deleteSelectedFolder(deleteLinks: boolean) {
	if (!deletingFolder.value) return
	try {
		await api.deleteFolder(deletingFolder.value.id, deleteLinks)
		deletingFolder.value = null
		emit('changed')
		showSuccess(t('shortlinks', 'Folder deleted'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function saveTag(value: { name: string; color: string | null }) {
	try {
		if (editingTag.value) {
			await api.updateTag(editingTag.value.id, value.name, value.color)
			editingTag.value = null
		} else {
			await api.createTag(value.name, value.color)
			creatingTag.value = false
		}
		emit('changed')
		showSuccess(t('shortlinks', 'Tag saved'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function deleteTag(tag: Tag) {
	if (!window.confirm(t('shortlinks', 'Delete the tag “{name}”?', { name: tag.name }))) return
	try {
		await api.deleteTag(tag.id)
		emit('changed')
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function mergeTag() {
	if (!mergingTag.value || mergeTargetId.value === null) return
	try {
		await api.mergeTag(mergingTag.value.id, mergeTargetId.value)
		mergingTag.value = null
		mergeTargetId.value = null
		emit('changed')
		showSuccess(t('shortlinks', 'Tags merged'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}
</script>

<template>
	<NcAppSettingsDialog :open="open"
		:name="t('shortlinks', 'Shortlinks settings')"
		show-navigation
		@update:open="emit('update:open', $event)">
		<NcAppSettingsSection id="folders"
			:name="t('shortlinks', 'Folders')"
			:description="t('shortlinks', 'Organize links in nested folders and choose their order.')"
			:order="10">
			<template #icon>
				<NcIconSvgWrapper :path="mdiFolderMultipleOutline" />
			</template>
			<div class="settings-section-content">
				<NcButton variant="primary" @click="creatingFolder = true">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'New folder') }}
				</NcButton>
				<p v-if="folders.length > 1" class="settings-hint">
					{{ t('shortlinks', 'Drag folders to reorder them, or use the arrow actions for keyboard access. Folders can only be reordered within the same parent.') }}
				</p>
				<NcEmptyContent v-if="folders.length === 0" :name="t('shortlinks', 'No folders yet')" :description="t('shortlinks', 'Create a folder to group related short links.')" />
				<ul v-else class="management-list" :aria-label="t('shortlinks', 'Folders')">
					<li v-for="entry in orderedFolders"
						:key="entry.folder.id"
						draggable="true"
						:class="{ 'management-list__drop-target': dropTargetId === entry.folder.id }"
						:style="{ '--folder-depth': entry.depth }"
						@dragstart="dragStart(entry.folder, $event)"
						@dragover="dragOver(entry.folder, $event)"
						@dragleave="dropTargetId = null"
						@dragend="draggedFolder = null; dropTargetId = null"
						@drop="drop(entry.folder, $event)">
						<NcListItem :name="entry.folder.name"
							:details="linkCountLabel(entry.folder.count)"
							:actions-aria-label="t('shortlinks', 'Folder actions for {name}', { name: entry.folder.name })"
							@click="editingFolder = entry.folder">
							<template #icon>
								<NcIconSvgWrapper :path="folderIconPath(entry.folder.icon)" />
							</template>
							<template #subname>
								{{ entry.folder.parentId === null ? t('shortlinks', 'Top level') : t('shortlinks', 'Nested folder') }}
							</template>
							<template #actions>
								<NcActionButton :name="t('shortlinks', 'Move up')" :disabled="siblings(entry.folder)[0]?.id === entry.folder.id" @click="moveFolder(entry.folder, -1)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiArrowUp" />
									</template>
								</NcActionButton>
								<NcActionButton :name="t('shortlinks', 'Move down')" :disabled="siblings(entry.folder).at(-1)?.id === entry.folder.id" @click="moveFolder(entry.folder, 1)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiArrowDown" />
									</template>
								</NcActionButton>
								<NcActionButton :name="t('shortlinks', 'Edit')" @click="editingFolder = entry.folder">
									<template #icon>
										<NcIconSvgWrapper :path="mdiPencilOutline" />
									</template>
								</NcActionButton>
								<NcActionButton :name="t('shortlinks', 'Delete')" @click="deletingFolder = entry.folder">
									<template #icon>
										<NcIconSvgWrapper :path="mdiDeleteOutline" />
									</template>
								</NcActionButton>
							</template>
						</NcListItem>
					</li>
				</ul>
			</div>
		</NcAppSettingsSection>

		<NcAppSettingsSection id="tags"
			:name="t('shortlinks', 'Tags')"
			:description="t('shortlinks', 'Maintain reusable labels for filtering and grouping links.')"
			:order="20">
			<template #icon>
				<NcIconSvgWrapper :path="mdiTagMultipleOutline" />
			</template>
			<div class="settings-section-content">
				<NcButton variant="primary" @click="creatingTag = true">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'New tag') }}
				</NcButton>
				<NcEmptyContent v-if="tags.length === 0" :name="t('shortlinks', 'No tags yet')" :description="t('shortlinks', 'Create a tag to make links easier to find.')" />
				<ul v-else class="management-list">
					<li v-for="tag in tags" :key="tag.id">
						<NcListItem :name="tag.name" :details="linkCountLabel(tag.count)">
							<template #icon>
								<span class="tag-color" :style="{ backgroundColor: tag.color || 'var(--color-primary-element)' }" />
							</template>
							<template #actions>
								<NcActionButton :name="t('shortlinks', 'Edit')" @click="editingTag = tag">
									<template #icon>
										<NcIconSvgWrapper :path="mdiPencilOutline" />
									</template>
								</NcActionButton>
								<NcActionButton v-if="tags.length > 1" :name="t('shortlinks', 'Merge')" @click="mergingTag = tag">
									<template #icon>
										<NcIconSvgWrapper :path="mdiMerge" />
									</template>
								</NcActionButton>
								<NcActionButton :name="t('shortlinks', 'Delete')" @click="deleteTag(tag)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiDeleteOutline" />
									</template>
								</NcActionButton>
							</template>
						</NcListItem>
					</li>
				</ul>
			</div>
		</NcAppSettingsSection>

		<NcAppSettingsSection id="about"
			:name="t('shortlinks', 'About')"
			:description="t('shortlinks', 'Information about organizing links in Shortlinks.')"
			:order="30">
			<template #icon>
				<NcIconSvgWrapper :path="mdiInformationOutline" />
			</template>
			<div class="about-section">
				<NcIconSvgWrapper :path="mdiLinkVariant" :size="48" />
				<div><h3>{{ t('shortlinks', 'Shortlinks') }}</h3><p>{{ t('shortlinks', 'Create memorable redirects, organize them, and understand how they are used.') }}</p></div>
			</div>
		</NcAppSettingsSection>
	</NcAppSettingsDialog>

	<FolderForm v-if="creatingFolder"
		:folders="folders"
		@close="creatingFolder = false"
		@save="saveFolder" />
	<FolderForm v-if="editingFolder"
		:folders="folders"
		:folder="editingFolder"
		@close="editingFolder = null"
		@save="saveFolder" />
	<TagForm v-if="creatingTag" @close="creatingTag = false" @save="saveTag" />
	<TagForm v-if="editingTag"
		:tag="editingTag"
		@close="editingTag = null"
		@save="saveTag" />

	<NcDialog v-if="deletingFolder"
		:name="t('shortlinks', 'Delete folder “{name}”', { name: deletingFolder.name })"
		size="normal"
		@closing="deletingFolder = null">
		<div class="delete-choices">
			<p>{{ t('shortlinks', 'Choose what should happen to the short links in this folder and its subfolders.') }}</p>
			<NcFormBoxButton :label="t('shortlinks', 'Delete folder, keep links')" :description="t('shortlinks', 'The links are moved to Unfiled and remain available.')" @click="deleteSelectedFolder(false)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderRemoveOutline" />
				</template>
			</NcFormBoxButton>
			<NcFormBoxButton :label="t('shortlinks', 'Delete folder and links')" inverted-accent @click="deleteSelectedFolder(true)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiDeleteOutline" />
				</template>
				<template #description>
					<span>{{ t('shortlinks', 'Moves') }} <strong>{{ deleteLinkCount }}</strong> {{ t('shortlinks', 'short links to trash.') }}</span>
				</template>
			</NcFormBoxButton>
		</div>
		<template #actions>
			<NcButton @click="deletingFolder = null">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
		</template>
	</NcDialog>

	<NcDialog v-if="mergingTag"
		:name="t('shortlinks', 'Merge tag “{name}”', { name: mergingTag.name })"
		size="normal"
		@closing="mergingTag = null">
		<div class="merge-form">
			<p>{{ t('shortlinks', 'All links receive the target tag, then the original tag is deleted.') }}</p><label class="select-field"><span>{{ t('shortlinks', 'Merge into') }}</span><select v-model="mergeTargetId"><option :value="null">—</option><option v-for="tag in tags.filter(item => item.id !== mergingTag?.id)" :key="tag.id" :value="tag.id">{{ tag.name }}</option></select></label>
		</div>
		<template #actions>
			<NcButton @click="mergingTag = null">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton><NcButton variant="primary" :disabled="mergeTargetId === null" @click="mergeTag">
				{{ t('shortlinks', 'Merge') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.settings-section-content,
.delete-choices,
.merge-form {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 3);
}

.settings-section-content > :first-child {
	justify-self: start;
}

.settings-hint {
	margin: 0;
	color: var(--color-text-maxcontrast);
}

.management-list {
	inline-size: min(100%, 680px);
	margin: 0;
	padding: 0;
	list-style: none;
}

.management-list > li {
	padding-inline-start: calc(var(--folder-depth, 0) * 24px);
	border-block-end: 1px solid var(--color-border);
	transition: background-color .15s ease;
}

.management-list > li[draggable="true"] {
	cursor: grab;
}

.management-list__drop-target {
	background: var(--color-primary-element-light-hover);
	box-shadow: inset 0 2px var(--color-primary-element);
}

.tag-color {
	display: block;
	inline-size: 20px;
	block-size: 20px;
	border: 1px solid var(--color-border-dark);
	border-radius: 50%;
}

.delete-choices,
.merge-form {
	padding-block: calc(var(--default-grid-baseline) * 2);
}

.delete-choices p,
.merge-form p {
	margin: 0;
}

.select-field {
	display: grid;
	gap: var(--default-grid-baseline);
	font-weight: 600;
}

.select-field select {
	inline-size: 100%;
	min-block-size: 44px;
	margin: 0;
	font-weight: normal;
}

.about-section {
	display: flex;
	gap: calc(var(--default-grid-baseline) * 4);
	align-items: flex-start;
}

.about-section h3,
.about-section p {
	margin: 0;
}

.about-section p {
	margin-block-start: var(--default-grid-baseline);
	color: var(--color-text-maxcontrast);
}
</style>
