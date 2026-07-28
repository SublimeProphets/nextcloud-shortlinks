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

defineProps<{ folders: Folder[]; tags: Tag[]; activeSystem: string; activeFolderId: number | null }>()
const emit = defineEmits<{ create: []; filter: [value: { system: string; folderId: number | null }]; changed: [] }>()
const newFolder = ref(''); const newTag = ref('')
const systemItems = [{ id: 'all', label: 'All links' }, { id: 'favorites', label: 'Favorites' }, { id: 'recent', label: 'Recently created' }, { id: 'used', label: 'Recently used' }, { id: 'expired', label: 'Expired' }, { id: 'inactive', label: 'Inactive' }, { id: 'trash', label: 'Trash' }]
/**
 *
 */
async function addFolder() { try { if (newFolder.value.trim()) { await api.createFolder(newFolder.value.trim()); newFolder.value = ''; emit('changed') } } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
/**
 *
 */
async function addTag() { try { if (newTag.value.trim()) { await api.createTag(newTag.value.trim()); newTag.value = ''; emit('changed') } } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
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
				:name="folder.name"
				:counter-number="folder.count"
				:active="activeFolderId === folder.id"
				@click="emit('filter', { system: 'all', folderId: folder.id })" />
		</ul>
		<form class="navigation-create" @submit.prevent="addFolder">
			<NcTextField v-model="newFolder" :label="t('shortlinks', 'New folder')" /><NcButton type="submit">
				{{ t('shortlinks', 'Add') }}
			</NcButton>
		</form>
		<NcAppNavigationCaption :name="t('shortlinks', 'Tags')" />
		<ul><NcAppNavigationItem v-for="tag in tags" :key="tag.id" :name="`${tag.name} (${tag.count})`" /></ul>
		<form class="navigation-create" @submit.prevent="addTag">
			<NcTextField v-model="newTag" :label="t('shortlinks', 'New tag')" /><NcButton type="submit">
				{{ t('shortlinks', 'Add') }}
			</NcButton>
		</form>
	</NcAppNavigation>
</template>
