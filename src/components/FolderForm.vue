<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { folderIconOptions } from '../folderIcons'
import type { Folder, FolderIcon } from '../types'

const props = withDefaults(defineProps<{ folders: Folder[]; folder?: Folder }>(), { folder: undefined })
const emit = defineEmits<{ close: []; save: [value: { name: string; parentId: number | null; icon: FolderIcon }] }>()
const name = ref(props.folder?.name ?? '')
const parentId = ref<number | null>(props.folder?.parentId ?? null)
const icon = ref<FolderIcon>(props.folder?.icon ?? 'folder')
const descendants = computed(() => {
	if (!props.folder) return new Set<number>()
	const ids = new Set<number>([props.folder.id])
	for (let changed = true; changed;) {
		changed = false
		for (const folder of props.folders) {
			if (folder.parentId !== null && ids.has(folder.parentId) && !ids.has(folder.id)) {
				ids.add(folder.id)
				changed = true
			}
		}
	}
	return ids
})
const availableParents = computed(() => props.folders.filter(folder => !descendants.value.has(folder.id)))

function submit() {
	if (!name.value.trim()) return
	emit('save', { name: name.value.trim(), parentId: parentId.value, icon: icon.value })
}
</script>

<template>
	<NcDialog :name="folder ? t('shortlinks', 'Edit folder') : t('shortlinks', 'New folder')"
		size="normal"
		@closing="emit('close')">
		<form id="folder-form" class="folder-form" @submit.prevent="submit">
			<NcTextField v-model="name" required :label="t('shortlinks', 'Folder name')" />
			<fieldset class="icon-picker">
				<legend>{{ t('shortlinks', 'Folder icon') }}</legend>
				<NcButton v-for="option in folderIconOptions"
					:key="option.id"
					type="button"
					:pressed="icon === option.id"
					:aria-label="t('shortlinks', option.label)"
					@click="icon = option.id">
					<template #icon>
						<NcIconSvgWrapper :path="option.path" />
					</template>
					{{ t('shortlinks', option.label) }}
				</NcButton>
			</fieldset>
			<label class="select-field">
				<span>{{ t('shortlinks', 'Parent folder') }}</span>
				<select v-model="parentId">
					<option :value="null">{{ t('shortlinks', 'No folder') }}</option>
					<option v-for="parent in availableParents" :key="parent.id" :value="parent.id">{{ parent.name }}</option>
				</select>
			</label>
		</form>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
			<NcButton type="submit"
				form="folder-form"
				variant="primary"
				:disabled="!name.trim()">
				{{ folder ? t('shortlinks', 'Save changes') : t('shortlinks', 'Create folder') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.folder-form {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 4);
	padding-block: calc(var(--default-grid-baseline) * 2);
}

.icon-picker {
	display: flex;
	flex-wrap: wrap;
	gap: calc(var(--default-grid-baseline) * 2);
	margin: 0;
	padding: 0;
	border: 0;
}

.icon-picker legend {
	inline-size: 100%;
	margin-block-end: var(--default-grid-baseline);
	font-weight: 600;
}

.select-field {
	display: grid;
	gap: var(--default-grid-baseline);
	font-weight: 600;
}

.select-field select {
	inline-size: 100%;
	margin: 0;
	font-weight: normal;
}
</style>
