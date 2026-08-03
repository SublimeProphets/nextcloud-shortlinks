<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'
import type { UserSettings } from '../types'

const emit = defineEmits<{ saved: [settings: UserSettings] }>()
const loading = ref(true)
const saving = ref(false)
const initialized = ref(false)
const singleSection = ref(true)
const autosaveEnabled = ref(true)
const autosaveDelay = ref<2 | 5 | 10 | 30>(10)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(async () => {
	try {
		const settings = await api.getUserSettings()
		singleSection.value = settings.pageEditorSingleSection
		autosaveEnabled.value = settings.pageAutosaveEnabled
		autosaveDelay.value = settings.pageAutosaveDelay
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		loading.value = false
		initialized.value = true
	}
})

watch([singleSection, autosaveEnabled, autosaveDelay], () => {
	if (!initialized.value) return
	if (timer) clearTimeout(timer)
	timer = setTimeout(save, 300)
})
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })

async function save() {
	saving.value = true
	try {
		const updated = await api.updateUserSettings({
			pageEditorSingleSection: singleSection.value,
			pageAutosaveEnabled: autosaveEnabled.value,
			pageAutosaveDelay: autosaveDelay.value,
		})
		singleSection.value = updated.pageEditorSingleSection
		autosaveEnabled.value = updated.pageAutosaveEnabled
		autosaveDelay.value = updated.pageAutosaveDelay
		emit('saved', updated)
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		saving.value = false
	}
}
</script>

<template>
	<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading page settings')" />
	<div v-else class="page-user-settings">
		<section>
			<h3>{{ t('shortlinks', 'Editor') }}</h3>
			<NcCheckboxRadioSwitch v-model="singleSection" type="switch">
				{{ t('shortlinks', 'Keep only one editor section open at a time') }}
			</NcCheckboxRadioSwitch>
			<p>{{ t('shortlinks', 'Turn this off to compare and edit several Page sections at once.') }}</p>
		</section>
		<section>
			<h3>{{ t('shortlinks', 'Autosave') }}</h3>
			<NcCheckboxRadioSwitch v-model="autosaveEnabled" type="switch">
				{{ t('shortlinks', 'Save page changes automatically') }}
			</NcCheckboxRadioSwitch>
			<p>{{ t('shortlinks', 'Autosave runs after you stop making changes. New pages are saved manually the first time.') }}</p>
			<div v-if="autosaveEnabled"
				class="autosave-delays"
				role="radiogroup"
				:aria-label="t('shortlinks', 'Autosave delay')">
				<NcCheckboxRadioSwitch v-for="delay in ([2, 5, 10, 30] as const)"
					:key="delay"
					v-model="autosaveDelay"
					type="radio"
					:value="delay">
					{{ t('shortlinks', '{seconds} seconds', { seconds: delay }) }}
				</NcCheckboxRadioSwitch>
			</div>
		</section>
		<small aria-live="polite">{{ saving ? t('shortlinks', 'Saving…') : t('shortlinks', 'Changes are saved automatically') }}</small>
	</div>
</template>

<style scoped>
.page-user-settings { display: grid; max-inline-size: 720px; gap: calc(var(--default-grid-baseline) * 5); }

.page-user-settings section { display: grid; gap: calc(var(--default-grid-baseline) * 2); }

.page-user-settings h3 { margin: 0; font-size: 1.15rem; }

.autosave-delays { display: flex; flex-wrap: wrap; gap: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 4); padding-inline-start: 44px; }

.page-user-settings p, .page-user-settings small { margin: 0; color: var(--color-text-maxcontrast); }
</style>
