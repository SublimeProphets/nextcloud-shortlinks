<script setup lang="ts">
import { ref } from 'vue'
import { mdiFileUploadOutline } from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import { api } from '../api/client'

type ImportFormat = 'auto' | 'shortlinks-backup' | 'json' | 'csv' | 'yourls-csv' | 'yourls-xml'
const props = withDefaults(defineProps<{ mode: 'import' | 'export'; allowImportSuggestions?: boolean }>(), { allowImportSuggestions: true })
const emit = defineEmits<{ requestCompatibility: [] }>()
const fileInput = ref<HTMLInputElement>()
const content = ref('')
const filename = ref('')
const format = ref<ImportFormat>('auto')
const conflict = ref('skip')
const busy = ref(false)
const preview = ref<{ format: string; total: number; created: number; skipped: number; errors: Array<{ row: number; message: string }> } | null>(null)

function download(result: { filename: string; mimeType: string; content: string }) {
	const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }))
	const anchor = document.createElement('a')
	anchor.href = url
	anchor.download = result.filename
	anchor.click()
	URL.revokeObjectURL(url)
}

async function exportData() {
	busy.value = true
	try { download(await api.exportBackup()); showSuccess(t('shortlinks', 'Complete backup exported')) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { busy.value = false }
}

async function selectFile(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0]
	if (!file) return
	if (file.size > 5 * 1024 * 1024) { showError(t('shortlinks', 'Imports are limited to 5 MiB.')); return }
	filename.value = file.name
	content.value = await file.text()
	preview.value = null
	await runImport(true)
}

async function runImport(dryRun: boolean) {
	if (!content.value) return
	busy.value = true
	try {
		const result = await api.importLinks(format.value, content.value, dryRun, conflict.value)
		preview.value = result
		if (!dryRun) showSuccess(t('shortlinks', '{count} links imported', { count: result.created }))
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { busy.value = false }
}
</script>

<template>
	<div class="transfer-settings">
		<template v-if="mode === 'export'">
			<NcNoteCard type="info" :text="t('shortlinks', 'This backup includes all links, personal configuration, folders, and tags. Folder- and tag-based exports are also available from their contextual menus.')" />
			<NcButton variant="primary" :disabled="busy" @click="exportData">
				{{ busy ? t('shortlinks', 'Preparing export…') : t('shortlinks', 'Export complete backup') }}
			</NcButton>
		</template>
		<template v-else>
			<NcNoteCard type="info">
				{{ t('shortlinks', 'Import a complete Shortlinks backup, a link-only JSON/CSV export, or a CSV/XML export from') }}
				<a href="https://github.com/GautamGupta/YOURLS-Import-Export" target="_blank" rel="noopener noreferrer">GautamGupta/YOURLS-Import-Export</a>.
			</NcNoteCard>
			<label class="select-field"><span>{{ t('shortlinks', 'Import type') }}</span><select v-model="format">
				<option value="auto">{{ t('shortlinks', 'Detect automatically') }}</option>
				<option value="shortlinks-backup">{{ t('shortlinks', 'Complete Shortlinks backup') }}</option>
				<option value="json">{{ t('shortlinks', 'Shortlinks JSON') }}</option>
				<option value="csv">{{ t('shortlinks', 'Shortlinks CSV') }}</option>
				<option value="yourls-csv">{{ t('shortlinks', 'YOURLS Import/Export CSV') }}</option>
				<option value="yourls-xml">{{ t('shortlinks', 'YOURLS Import/Export XML') }}</option>
			</select></label>
			<label class="select-field"><span>{{ t('shortlinks', 'If an alias already exists') }}</span><select v-model="conflict"><option value="skip">{{ t('shortlinks', 'Skip link') }}</option><option value="new-alias">{{ t('shortlinks', 'Generate a new alias') }}</option></select></label>
			<input ref="fileInput"
				class="visually-hidden"
				type="file"
				accept=".json,.csv,.xml,application/json,text/csv,text/xml,application/xml"
				@change="selectFile">
			<NcButton :disabled="busy" @click="fileInput?.click()">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFileUploadOutline" />
				</template>{{ filename || t('shortlinks', 'Choose import file') }}
			</NcButton>
			<div v-if="preview" class="import-preview" role="status">
				<strong>{{ t('shortlinks', '{count} links detected', { count: preview.total }) }}</strong>
				<span>{{ t('shortlinks', 'Detected format: {format}', { format: preview.format }) }}</span>
				<span v-if="preview.errors.length">{{ t('shortlinks', '{count} rows need attention', { count: preview.errors.length }) }}</span>
			</div>
			<NcButton v-if="preview"
				variant="primary"
				:disabled="busy || preview.created === 0"
				@click="runImport(false)">
				{{ busy ? t('shortlinks', 'Importing…') : t('shortlinks', 'Import data') }}
			</NcButton>
			<NcButton v-if="allowImportSuggestions" variant="tertiary" @click="emit('requestCompatibility')">
				{{ t('shortlinks', 'Request support for another import format') }}
			</NcButton>
		</template>
	</div>
</template>

<style scoped>
.transfer-settings { display: grid; inline-size: min(100%, 720px); gap: calc(var(--default-grid-baseline) * 3); }

.transfer-settings > :is(button, .button-vue) { justify-self: start; }

.select-field { display: grid; gap: var(--default-grid-baseline); font-weight: 600; }

.select-field select { min-block-size: 44px; margin: 0; font-weight: normal; }

.import-preview { display: grid; gap: var(--default-grid-baseline); padding: calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-background-hover); }

.import-preview span { color: var(--color-text-maxcontrast); }
</style>
