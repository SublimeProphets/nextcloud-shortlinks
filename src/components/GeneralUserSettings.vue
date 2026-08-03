<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import { api } from '../api/client'
import type { UserSettings } from '../types'

const emit = defineEmits<{ saved: [settings: UserSettings] }>()
const loading = ref(true)
const saving = ref(false)
const initialized = ref(false)
const settings = reactive({ useThumbnails: true, metadataAutocomplete: true, showQuickStart: true, metadataCollectionEnabled: true })
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(async () => {
	try { Object.assign(settings, await api.getUserSettings()) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { loading.value = false; initialized.value = true }
})

watch(() => [settings.useThumbnails, settings.metadataAutocomplete, settings.showQuickStart], () => {
	if (!initialized.value) return
	if (timer) clearTimeout(timer)
	timer = setTimeout(save, 300)
})

async function save() {
	saving.value = true
	try {
		const updated = await api.updateUserSettings({
			useThumbnails: settings.useThumbnails,
			metadataAutocomplete: settings.metadataAutocomplete,
			showQuickStart: settings.showQuickStart,
		})
		Object.assign(settings, updated)
		emit('saved', updated)
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { saving.value = false }
}
</script>

<template>
	<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading general settings')" />
	<div v-else class="general-settings">
		<NcCheckboxRadioSwitch v-model="settings.useThumbnails" type="switch">
			{{ t('shortlinks', 'Use thumbnails') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="settings.metadataAutocomplete" type="switch" :disabled="!settings.metadataCollectionEnabled">
			{{ t('shortlinks', 'Automatically scan destinations for a title and sharing image') }}
		</NcCheckboxRadioSwitch>
		<NcNoteCard v-if="!settings.metadataCollectionEnabled" type="info" :text="t('shortlinks', 'Your administrator has disabled destination metadata collection for this server.')" />
		<NcCheckboxRadioSwitch v-model="settings.showQuickStart" type="switch">
			{{ t('shortlinks', 'Show Quick Start Guide on Dashboard') }}
		</NcCheckboxRadioSwitch>
		<p class="save-state" aria-live="polite">
			{{ saving ? t('shortlinks', 'Saving…') : t('shortlinks', 'Changes are saved automatically') }}
		</p>
	</div>
</template>

<style scoped>
.general-settings { display: grid; max-inline-size: 720px; gap: calc(var(--default-grid-baseline) * 3); }

.save-state { margin: 0; color: var(--color-text-maxcontrast); font-size: .85rem; }
</style>
