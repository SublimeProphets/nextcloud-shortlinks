<script setup lang="ts">
import { ref } from 'vue'
import { mdiContentCopy, mdiFolderMoveOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import type { Folder } from '../types'
import FolderTreeList from './FolderTreeList.vue'

defineProps<{ folders: Folder[]; count: number }>()
const emit = defineEmits<{ close: []; apply: [value: { mode: 'move' | 'copy'; folderId: number | null }] }>()
const folderId = ref<number | null>(null)
</script>

<template>
	<NcDialog :name="t('shortlinks', 'Move or copy {count} links', { count })" size="normal" @closing="emit('close')">
		<div class="bulk-destination">
			<p>{{ t('shortlinks', 'Choose a destination, then move the selected links or create independent copies.') }}</p><div class="folder-picker">
				<FolderTreeList :folders="folders"
					mode="select"
					allow-root
					:selected-id="folderId"
					:root-label="t('shortlinks', 'No folder')"
					@select="folderId = $event" />
			</div>
		</div>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
			<NcButton variant="primary" @click="emit('apply', { mode: 'move', folderId })">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderMoveOutline" />
				</template>{{ t('shortlinks', 'Move') }}
			</NcButton>
			<NcButton variant="primary" @click="emit('apply', { mode: 'copy', folderId })">
				<template #icon>
					<NcIconSvgWrapper :path="mdiContentCopy" />
				</template>{{ t('shortlinks', 'Copy') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.bulk-destination { display: grid; gap: calc(var(--default-grid-baseline) * 3); padding-block: calc(var(--default-grid-baseline) * 2); }

.bulk-destination p { margin: 0; color: var(--color-text-maxcontrast); }

.folder-picker { max-block-size: 420px; overflow: auto; border: 1px solid var(--color-border); border-radius: var(--border-radius-large); }
</style>
