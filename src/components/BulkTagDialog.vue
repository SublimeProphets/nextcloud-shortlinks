<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import type { Tag } from '../types'
import TagList from './TagList.vue'

defineProps<{ tags: Tag[]; count: number }>()
const emit = defineEmits<{ close: []; apply: [changes: { addTagIds?: number[]; removeTagIds?: number[] }] }>()
const operation = ref<'add' | 'remove'>('add')
const selectedIds = ref<number[]>([])

function toggle(tag: Tag) {
	selectedIds.value = selectedIds.value.includes(tag.id) ? selectedIds.value.filter(id => id !== tag.id) : [...selectedIds.value, tag.id]
}

function apply() {
	emit('apply', operation.value === 'add' ? { addTagIds: selectedIds.value } : { removeTagIds: selectedIds.value })
}
</script>

<template>
	<NcDialog :name="t('shortlinks', 'Manage tags for {count} links', { count })" size="normal" @closing="emit('close')">
		<div class="bulk-tags">
			<div class="operation">
				<NcCheckboxRadioSwitch v-model="operation"
					type="radio"
					value="add"
					name="tag-operation">
					{{ t('shortlinks', 'Add tags') }}
				</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-model="operation"
					type="radio"
					value="remove"
					name="tag-operation">
					{{ t('shortlinks', 'Remove tags') }}
				</NcCheckboxRadioSwitch>
			</div>
			<div class="tag-picker">
				<TagList :tags="tags"
					mode="select"
					:selected-ids="selectedIds"
					@toggle="toggle" />
			</div>
		</div>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton><NcButton variant="primary" :disabled="selectedIds.length === 0" @click="apply">
				{{ operation === 'add' ? t('shortlinks', 'Add') : t('shortlinks', 'Remove') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.bulk-tags { display: grid; gap: calc(var(--default-grid-baseline) * 3); padding-block: calc(var(--default-grid-baseline) * 2); }

.operation { display: flex; gap: calc(var(--default-grid-baseline) * 4); }

.tag-picker { max-block-size: 420px; overflow: auto; border: 1px solid var(--color-border); border-radius: var(--border-radius-large); }
</style>
