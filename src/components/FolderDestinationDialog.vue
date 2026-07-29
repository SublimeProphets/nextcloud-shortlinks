<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import type { Folder } from '../types'

const props = defineProps<{ folder: Folder; folders: Folder[]; mode: 'move' | 'copy' }>()
const emit = defineEmits<{ close: []; save: [parentId: number | null] }>()
const parentId = ref<number | null>(props.mode === 'move' ? props.folder.parentId : null)
const excludedIds = computed(() => {
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
const choices = computed(() => props.folders.filter(folder => !excludedIds.value.has(folder.id)))
</script>

<template>
	<NcDialog :name="mode === 'move' ? t('shortlinks', 'Move folder') : t('shortlinks', 'Copy folder')"
		size="normal"
		@closing="emit('close')">
		<div class="destination-dialog">
			<p>
				{{ mode === 'move'
					? t('shortlinks', 'Choose the new parent for “{name}”.', { name: folder.name })
					: t('shortlinks', 'Choose where the copy of “{name}” should be created. Subfolders and links are copied too.', { name: folder.name }) }}
			</p>
			<label class="select-field">
				<span>{{ t('shortlinks', 'Destination') }}</span>
				<select v-model="parentId">
					<option :value="null">{{ t('shortlinks', 'Top level') }}</option>
					<option v-for="choice in choices" :key="choice.id" :value="choice.id">{{ choice.name }}</option>
				</select>
			</label>
		</div>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
			<NcButton variant="primary" :disabled="mode === 'move' && parentId === folder.parentId" @click="emit('save', parentId)">
				{{ mode === 'move' ? t('shortlinks', 'Move') : t('shortlinks', 'Copy') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.destination-dialog,
.select-field { display: grid; gap: calc(var(--default-grid-baseline) * 3); }

.destination-dialog { padding-block: calc(var(--default-grid-baseline) * 2); }

.destination-dialog p { margin: 0; }

.select-field { gap: var(--default-grid-baseline); font-weight: 600; }

.select-field select { inline-size: 100%; min-block-size: 44px; margin: 0; font-weight: normal; }
</style>
