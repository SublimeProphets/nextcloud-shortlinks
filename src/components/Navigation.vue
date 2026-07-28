<script setup lang="ts">
import { ref } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationCaption from '@nextcloud/vue/components/NcAppNavigationCaption'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { Folder, Tag } from '../types'

const props = defineProps<{ folders: Folder[]; tags: Tag[]; activeSystem: string; activeFolderId: number | null; activeTagIds: number[] }>()
const emit = defineEmits<{ create: []; filter: [value: { system: string; folderId: number | null }]; tag: [id: number]; changed: [] }>()
const newFolder = ref(''); const newFolderParent = ref<number | null>(null); const newTag = ref('')
const editFolderId = ref<number | null>(null); const editFolderName = ref(''); const editFolderParent = ref<number | null>(null); const editFolderPosition = ref(0)
const editTagId = ref<number | null>(null); const editTagName = ref(''); const editTagColor = ref(''); const mergeTargetId = ref<number | null>(null)
const systemItems = [{ id: 'all', label: 'All links' }, { id: 'favorites', label: 'Favorites' }, { id: 'recent', label: 'Recently created' }, { id: 'used', label: 'Recently used' }, { id: 'expired', label: 'Expired' }, { id: 'inactive', label: 'Inactive' }, { id: 'trash', label: 'Trash' }]
/**
 *
 */
async function addFolder() { try { if (newFolder.value.trim()) { await api.createFolder(newFolder.value.trim(), newFolderParent.value); newFolder.value = ''; emit('changed') } } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
/**
 *
 */
async function addTag() { try { if (newTag.value.trim()) { await api.createTag(newTag.value.trim()); newTag.value = ''; emit('changed') } } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
function folderName(folder: Folder): string { let depth = 0; let parentId = folder.parentId; while (parentId !== null && depth < 10) { const parent = props.folders.find(item => item.id === parentId); if (!parent) break; depth++; parentId = parent.parentId } return `${'— '.repeat(depth)}${folder.name}` }
function loadFolder() { const folder = props.folders.find(item => item.id === editFolderId.value); editFolderName.value = folder?.name ?? ''; editFolderParent.value = folder?.parentId ?? null; editFolderPosition.value = folder?.position ?? 0 }
async function saveFolder() { if (editFolderId.value === null) return; try { await api.updateFolder(editFolderId.value, { name: editFolderName.value, parentId: editFolderParent.value, position: editFolderPosition.value }); emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function deleteFolder(deleteLinks: boolean) { if (editFolderId.value === null || !window.confirm(t('shortlinks', deleteLinks ? 'Delete this folder and move its links to trash?' : 'Delete this folder and keep its links?'))) return; try { await api.deleteFolder(editFolderId.value, deleteLinks); editFolderId.value = null; emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
function loadTag() { const tag = props.tags.find(item => item.id === editTagId.value); editTagName.value = tag?.name ?? ''; editTagColor.value = tag?.color ?? ''; mergeTargetId.value = null }
async function saveTag() { if (editTagId.value === null) return; try { await api.updateTag(editTagId.value, editTagName.value, editTagColor.value || null); emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function mergeTag() { if (editTagId.value === null || mergeTargetId.value === null) return; try { await api.mergeTag(editTagId.value, mergeTargetId.value); editTagId.value = null; emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function deleteTag() { if (editTagId.value === null || !window.confirm(t('shortlinks', 'Delete this tag?'))) return; try { await api.deleteTag(editTagId.value); editTagId.value = null; emit('changed') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
</script>

<template>
	<NcAppNavigation :aria-label="t('shortlinks', 'Shortlinks navigation')">
		<template #header>
			<NcButton variant="primary" wide @click="emit('create')">
				{{ t('shortlinks', 'New short link') }}
			</NcButton>
		</template>
		<ul>
			<NcAppNavigationItem v-for="item in systemItems"
				:key="item.id"
				:name="t('shortlinks', item.label)"
				:active="activeSystem === item.id && activeFolderId === null"
				@click="emit('filter', { system: item.id, folderId: null })" />
			<NcAppNavigationCaption :name="t('shortlinks', 'Folders')" />
			<NcAppNavigationItem v-for="folder in folders"
				:key="folder.id"
				:name="folderName(folder)"
				:counter-number="folder.count"
				:active="activeFolderId === folder.id"
				@click="emit('filter', { system: 'all', folderId: folder.id })" />
		</ul>
		<form class="navigation-create" @submit.prevent="addFolder">
			<NcTextField v-model="newFolder" :label="t('shortlinks', 'New folder')" /><label>{{ t('shortlinks', 'Parent folder') }}<select v-model="newFolderParent"><option :value="null">{{ t('shortlinks', 'No folder') }}</option><option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folderName(folder) }}</option></select></label><NcButton type="submit">
				{{ t('shortlinks', 'Add') }}
			</NcButton>
		</form>
		<details class="navigation-manage">
			<summary>{{ t('shortlinks', 'Manage folders') }}</summary>
			<label>{{ t('shortlinks', 'Folder') }}<select v-model="editFolderId" @change="loadFolder"><option :value="null">—</option><option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folderName(folder) }}</option></select></label>
			<template v-if="editFolderId !== null">
				<NcTextField v-model="editFolderName" :label="t('shortlinks', 'Folder name')" />
				<label>{{ t('shortlinks', 'Parent folder') }}<select v-model="editFolderParent"><option :value="null">{{ t('shortlinks', 'No folder') }}</option><option v-for="folder in folders.filter(item => item.id !== editFolderId)" :key="folder.id" :value="folder.id">{{ folderName(folder) }}</option></select></label>
				<label>{{ t('shortlinks', 'Position') }}<input v-model.number="editFolderPosition" type="number" min="0"></label>
				<NcButton @click="saveFolder">
					{{ t('shortlinks', 'Save') }}
				</NcButton><NcButton @click="deleteFolder(false)">
					{{ t('shortlinks', 'Delete, keep links') }}
				</NcButton><NcButton @click="deleteFolder(true)">
					{{ t('shortlinks', 'Delete with links') }}
				</NcButton>
			</template>
		</details>
		<NcAppNavigationCaption :name="t('shortlinks', 'Tags')" />
		<ul>
			<NcAppNavigationItem v-for="tag in tags"
				:key="tag.id"
				:name="`${tag.name} (${tag.count})`"
				:active="activeTagIds.includes(tag.id)"
				@click="emit('tag', tag.id)" />
		</ul>
		<form class="navigation-create" @submit.prevent="addTag">
			<NcTextField v-model="newTag" :label="t('shortlinks', 'New tag')" /><NcButton type="submit">
				{{ t('shortlinks', 'Add') }}
			</NcButton>
		</form>
		<details class="navigation-manage">
			<summary>{{ t('shortlinks', 'Manage tags') }}</summary>
			<label>{{ t('shortlinks', 'Tag') }}<select v-model="editTagId" @change="loadTag"><option :value="null">—</option><option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option></select></label>
			<template v-if="editTagId !== null">
				<NcTextField v-model="editTagName" :label="t('shortlinks', 'Tag name')" />
				<label>{{ t('shortlinks', 'Tag color') }}<input v-model="editTagColor" type="color"></label>
				<NcButton @click="saveTag">
					{{ t('shortlinks', 'Save') }}
				</NcButton><NcButton @click="deleteTag">
					{{ t('shortlinks', 'Delete') }}
				</NcButton>
				<label>{{ t('shortlinks', 'Merge into') }}<select v-model="mergeTargetId"><option :value="null">—</option><option v-for="tag in tags.filter(item => item.id !== editTagId)" :key="tag.id" :value="tag.id">{{ tag.name }}</option></select></label><NcButton :disabled="mergeTargetId === null" @click="mergeTag">
					{{ t('shortlinks', 'Merge') }}
				</NcButton>
			</template>
		</details>
	</NcAppNavigation>
</template>
