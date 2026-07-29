<script setup lang="ts">
import { computed } from 'vue'
import { mdiDeleteOutline, mdiFolderRemoveOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcFormBoxButton from '@nextcloud/vue/components/NcFormBoxButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import type { Folder } from '../types'

const props = defineProps<{ folder: Folder; folders: Folder[] }>()
const emit = defineEmits<{ close: []; delete: [deleteLinks: boolean] }>()
const linkCount = computed(() => {
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
	return props.folders.filter(folder => ids.has(folder.id)).reduce((sum, folder) => sum + folder.count, 0)
})
</script>

<template>
	<NcDialog :name="t('shortlinks', 'Delete folder “{name}”', { name: folder.name })" size="normal" @closing="emit('close')">
		<div class="delete-choices">
			<p>{{ t('shortlinks', 'Choose what should happen to the short links in this folder and its subfolders.') }}</p>
			<NcFormBoxButton :label="t('shortlinks', 'Delete folder, keep links')"
				:description="t('shortlinks', 'The links are moved to Unfiled and remain available.')"
				@click="emit('delete', false)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderRemoveOutline" />
				</template>
			</NcFormBoxButton>
			<NcFormBoxButton :label="t('shortlinks', 'Delete folder and links')" inverted-accent @click="emit('delete', true)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiDeleteOutline" />
				</template>
				<template #description>
					<span>{{ t('shortlinks', 'Moves') }} <strong>{{ linkCount }}</strong> {{ t('shortlinks', 'short links to trash.') }}</span>
				</template>
			</NcFormBoxButton>
		</div>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.delete-choices { display: grid; gap: calc(var(--default-grid-baseline) * 3); padding-block: calc(var(--default-grid-baseline) * 2); }

.delete-choices p { margin: 0; }
</style>
