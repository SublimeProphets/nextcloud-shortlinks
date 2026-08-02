<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	mdiBookmarkPlusOutline, mdiDeleteOutline, mdiFolderMultipleOutline, mdiFolderRemoveOutline,
	mdiIdentifier, mdiInformationOutline, mdiLinkVariant, mdiPlus, mdiShareVariantOutline, mdiTagMultipleOutline,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcAppSettingsDialog from '@nextcloud/vue/components/NcAppSettingsDialog'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcFormBoxButton from '@nextcloud/vue/components/NcFormBoxButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { api } from '../api/client'
import type { Folder, FolderIcon, Tag } from '../types'
import AliasUrlSettings from './AliasUrlSettings.vue'
import BookmarkletGuide from './BookmarkletGuide.vue'
import FolderForm from './FolderForm.vue'
import FolderTreeList from './FolderTreeList.vue'
import TagForm from './TagForm.vue'
import TagList from './TagList.vue'

const props = defineProps<{ open: boolean; folders: Folder[]; tags: Tag[] }>()
const emit = defineEmits<{ 'update:open': [value: boolean]; changed: []; settingsSaved: [shortUrlTemplate: string] }>()
const editingFolder = ref<Folder | null>(null)
const creatingFolder = ref(false)
const deletingFolder = ref<Folder | null>(null)
const editingTag = ref<Tag | null>(null)
const creatingTag = ref(false)
const mergingTag = ref<Tag | null>(null)
const mergeTargetId = ref<number | null>(null)

const deleteLinkCount = computed(() => {
	if (!deletingFolder.value) return 0
	const ids = new Set<number>([deletingFolder.value.id])
	for (let changed = true; changed;) {
		changed = false
		for (const folder of props.folders) {
			if (folder.parentId !== null && ids.has(folder.parentId) && !ids.has(folder.id)) { ids.add(folder.id); changed = true }
		}
	}
	return props.folders.filter(folder => ids.has(folder.id)).reduce((sum, folder) => sum + folder.count, 0)
})

async function saveFolder(value: { name: string; parentId: number | null; icon: FolderIcon }) {
	try {
		if (editingFolder.value) { await api.updateFolder(editingFolder.value.id, value); editingFolder.value = null } else { await api.createFolder(value.name, value.parentId, value.icon); creatingFolder.value = false }
		emit('changed'); showSuccess(t('shortlinks', 'Folder saved'))
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function deleteSelectedFolder(deleteLinks: boolean) {
	if (!deletingFolder.value) return
	try { await api.deleteFolder(deletingFolder.value.id, deleteLinks); deletingFolder.value = null; emit('changed'); showSuccess(t('shortlinks', 'Folder deleted')) } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function saveTag(value: { name: string; color: string | null }) {
	try {
		if (editingTag.value) { await api.updateTag(editingTag.value.id, value.name, value.color); editingTag.value = null } else { await api.createTag(value.name, value.color); creatingTag.value = false }
		emit('changed'); showSuccess(t('shortlinks', 'Tag saved'))
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function deleteTag(tag: Tag) {
	if (!window.confirm(t('shortlinks', 'Delete the tag “{name}”?', { name: tag.name }))) return
	try { await api.deleteTag(tag.id); emit('changed') } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}

async function mergeTag() {
	if (!mergingTag.value || mergeTargetId.value === null) return
	try { await api.mergeTag(mergingTag.value.id, mergeTargetId.value); mergingTag.value = null; mergeTargetId.value = null; emit('changed'); showSuccess(t('shortlinks', 'Tags merged')) } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}
</script>

<template>
	<NcAppSettingsDialog :open="open"
		:name="t('shortlinks', 'Shortlinks settings')"
		show-navigation
		@update:open="emit('update:open', $event)">
		<NcAppSettingsSection id="bookmarklet"
			:name="t('shortlinks', 'Bookmarklet')"
			:description="t('shortlinks', 'Create short links directly from your browser toolbar.')"
			:order="10">
			<template #icon>
				<NcIconSvgWrapper :path="mdiBookmarkPlusOutline" />
			</template><BookmarkletGuide :show-heading="false" />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="aliases"
			:name="t('shortlinks', 'Automatic aliases')"
			:description="t('shortlinks', 'Choose how aliases are generated and how collisions are resolved.')"
			:order="15">
			<template #icon>
				<NcIconSvgWrapper :path="mdiIdentifier" />
			</template>
			<AliasUrlSettings section="alias" @saved="emit('settingsSaved', $event.shortUrlTemplate)" />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="sharing-url"
			:name="t('shortlinks', 'URL used for sharing')"
			:description="t('shortlinks', 'Choose the address that is displayed, copied, and shared.')"
			:order="16">
			<template #icon>
				<NcIconSvgWrapper :path="mdiShareVariantOutline" />
			</template>
			<AliasUrlSettings section="url" @saved="emit('settingsSaved', $event.shortUrlTemplate)" />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="folders"
			:name="t('shortlinks', 'Folders')"
			:description="t('shortlinks', 'Organize links in nested folders and choose their order.')"
			:order="20">
			<template #icon>
				<NcIconSvgWrapper :path="mdiFolderMultipleOutline" />
			</template>
			<div class="settings-section-content">
				<NcEmptyContent v-if="folders.length === 0" :name="t('shortlinks', 'No folders yet')" :description="t('shortlinks', 'Create a folder to group related short links.')" />
				<FolderTreeList v-else
					:folders="folders"
					mode="manage"
					@edit="editingFolder = $event"
					@delete="deletingFolder = $event"
					@changed="emit('changed')" />
				<NcButton variant="tertiary" class="add-button" @click="creatingFolder = true">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'New folder') }}
				</NcButton>
			</div>
		</NcAppSettingsSection>

		<NcAppSettingsSection id="tags"
			:name="t('shortlinks', 'Tags')"
			:description="t('shortlinks', 'Maintain reusable labels for filtering and grouping links.')"
			:order="30">
			<template #icon>
				<NcIconSvgWrapper :path="mdiTagMultipleOutline" />
			</template>
			<div class="settings-section-content">
				<NcEmptyContent v-if="tags.length === 0" :name="t('shortlinks', 'No tags yet')" :description="t('shortlinks', 'Create a tag to make links easier to find.')" />
				<TagList v-else
					:tags="tags"
					mode="manage"
					@edit="editingTag = $event"
					@merge="mergingTag = $event"
					@delete="deleteTag" />
				<NcButton variant="tertiary" class="add-button" @click="creatingTag = true">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'New tag') }}
				</NcButton>
			</div>
		</NcAppSettingsSection>

		<NcAppSettingsSection id="about"
			:name="t('shortlinks', 'About')"
			:description="t('shortlinks', 'Information about organizing links in Shortlinks.')"
			:order="40">
			<template #icon>
				<NcIconSvgWrapper :path="mdiInformationOutline" />
			</template>
			<div class="about-section">
				<NcIconSvgWrapper :path="mdiLinkVariant" :size="48" /><div><h3>{{ t('shortlinks', 'Shortlinks') }}</h3><p>{{ t('shortlinks', 'Create memorable redirects, organize them, and understand how they are used.') }}</p></div>
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
				</template><template #description>
					<span>{{ t('shortlinks', 'Moves') }} <strong>{{ deleteLinkCount }}</strong> {{ t('shortlinks', 'short links to trash.') }}</span>
				</template>
			</NcFormBoxButton>
		</div><template #actions>
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
.settings-section-content, .delete-choices, .merge-form { display: grid; gap: calc(var(--default-grid-baseline) * 3); }

.settings-section-content { inline-size: min(100%, 720px); }

.add-button { justify-self: start; margin-block-start: calc(var(--default-grid-baseline) * 2); }

.delete-choices, .merge-form { padding-block: calc(var(--default-grid-baseline) * 2); }

.delete-choices p, .merge-form p { margin: 0; }

.select-field { display: grid; gap: var(--default-grid-baseline); font-weight: 600; }

.select-field select { inline-size: 100%; min-block-size: 44px; margin: 0; font-weight: normal; }

.about-section { display: flex; gap: calc(var(--default-grid-baseline) * 4); align-items: flex-start; }

.about-section h3, .about-section p { margin: 0; }

.about-section p { margin-block-start: var(--default-grid-baseline); color: var(--color-text-maxcontrast); }
</style>
