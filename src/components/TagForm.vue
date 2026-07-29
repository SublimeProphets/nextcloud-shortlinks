<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import type { Tag } from '../types'

const props = withDefaults(defineProps<{ tag?: Tag }>(), { tag: undefined })
const emit = defineEmits<{ close: []; save: [value: { name: string; color: string | null }] }>()
const name = ref(props.tag?.name ?? '')
const useColor = ref(Boolean(props.tag?.color))
const color = ref(props.tag?.color ?? '#0082c9')

function submit() {
	if (!name.value.trim()) return
	emit('save', { name: name.value.trim(), color: useColor.value ? color.value : null })
}
</script>

<template>
	<NcDialog :name="tag ? t('shortlinks', 'Edit tag') : t('shortlinks', 'New tag')" size="normal" @closing="emit('close')">
		<form id="tag-form" class="tag-form" @submit.prevent="submit">
			<NcTextField v-model="name" required :label="t('shortlinks', 'Tag name')" />
			<NcCheckboxRadioSwitch v-model="useColor" type="switch">
				{{ t('shortlinks', 'Use a custom color') }}
			</NcCheckboxRadioSwitch>
			<label v-if="useColor" class="color-field">
				<span>{{ t('shortlinks', 'Tag color') }}</span>
				<input v-model="color" type="color">
			</label>
		</form>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
			<NcButton type="submit"
				form="tag-form"
				variant="primary"
				:disabled="!name.trim()">
				{{ tag ? t('shortlinks', 'Save changes') : t('shortlinks', 'Create tag') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.tag-form {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 4);
	padding-block: calc(var(--default-grid-baseline) * 2);
}

.color-field {
	display: flex;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 3);
	font-weight: 600;
}

.color-field input {
	inline-size: 56px;
	block-size: 40px;
}
</style>
