<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { UserSettings } from '../types'

const emit = defineEmits<{ saved: [settings: UserSettings] }>()
const loading = ref(true)
const saving = ref(false)
const settings = reactive<UserSettings>({
	aliasStrategy: 'inherit',
	collisionStrategy: 'random',
	suffixLength: 2,
	urlMode: 'inherit',
	baseUrl: '',
	urlTemplate: '',
	urlPattern: '',
	urlReplacement: '',
	allowAliasSettings: true,
	allowUrlSettings: true,
	globalAliasMode: 'random',
	globalUrlMode: 'simple',
	previewAlias: 'summer-campaign',
	previewUrl: '',
	shortUrlTemplate: '',
})

const aliasExample = computed(() => {
	if (settings.aliasStrategy === 'readable') return settings.collisionStrategy === 'numbered' ? 'summer-campaign-2' : `summer-campaign-${'x'.repeat(settings.suffixLength)}`
	if (settings.aliasStrategy === 'random') return 'aB3x9Qz'
	return settings.previewAlias
})
const canonicalExample = `${window.location.origin}/apps/shortlinks/r/${aliasExample.value}`
const urlPreview = computed(() => {
	const canonical = `${window.location.origin}/apps/shortlinks/r/${aliasExample.value}`
	try {
		if (settings.urlMode === 'inherit') return settings.shortUrlTemplate.replace('{alias}', aliasExample.value) || settings.previewUrl
		if (settings.urlMode === 'simple') return settings.baseUrl.trim() ? `${settings.baseUrl.trim().replace(/\/$/, '')}/${aliasExample.value}` : canonical
		if (settings.urlMode === 'template') return settings.urlTemplate.replaceAll('{alias}', aliasExample.value).replaceAll('{user}', 'alice')
		const result = canonical.replace(new RegExp(settings.urlPattern, 'u'), settings.urlReplacement)
		return result === canonical ? t('shortlinks', 'The regular expression does not match the current Shortlinks URL.') : result
	} catch {
		return t('shortlinks', 'The regular expression is invalid.')
	}
})

watch(() => settings.urlMode, mode => {
	if (mode === 'template' && !settings.urlTemplate) {
		settings.urlTemplate = `${settings.baseUrl.trim().replace(/\/$/, '') || `${window.location.origin}/apps/shortlinks/r`}/{alias}`
	}
	if (mode === 'regex' && !settings.urlPattern) {
		const prefix = `${window.location.origin}/apps/shortlinks/r/`
		settings.urlPattern = `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.+)$`
		settings.urlReplacement = `${settings.baseUrl.trim().replace(/\/$/, '') || 'https://go.example'}/$1`
	}
})

onMounted(load)

async function load() {
	loading.value = true
	try {
		Object.assign(settings, await api.getUserSettings())
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		loading.value = false
	}
}

async function save() {
	saving.value = true
	try {
		const updated = await api.updateUserSettings({
			aliasStrategy: settings.aliasStrategy,
			collisionStrategy: settings.collisionStrategy,
			suffixLength: Number(settings.suffixLength),
			urlMode: settings.urlMode,
			baseUrl: settings.baseUrl,
			urlTemplate: settings.urlTemplate,
			urlPattern: settings.urlPattern,
			urlReplacement: settings.urlReplacement,
		})
		Object.assign(settings, updated)
		emit('saved', updated)
		showSuccess(t('shortlinks', 'Personal link settings saved'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		saving.value = false
	}
}
</script>

<template>
	<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading personal link settings')" />
	<form v-else class="alias-url-settings" @submit.prevent="save">
		<section class="preference-group">
			<h3>{{ t('shortlinks', 'Automatic aliases') }}</h3>
			<p>{{ t('shortlinks', 'Choose how the editable alias field is prefilled when you create a link.') }}</p>
			<label class="select-field">
				<span>{{ t('shortlinks', 'Alias strategy') }}</span>
				<select v-model="settings.aliasStrategy" :disabled="!settings.allowAliasSettings">
					<option value="inherit">{{ t('shortlinks', 'Use administrator default') }}</option>
					<option value="readable">{{ t('shortlinks', 'Guess from title or destination') }}</option>
					<option value="random">{{ t('shortlinks', 'Generate a random alias') }}</option>
				</select>
			</label>
			<div v-if="settings.aliasStrategy === 'readable'" class="preference-grid">
				<label class="select-field">
					<span>{{ t('shortlinks', 'If the guessed alias is already used') }}</span>
					<select v-model="settings.collisionStrategy" :disabled="!settings.allowAliasSettings">
						<option value="random">{{ t('shortlinks', 'Add the shortest random suffix') }}</option>
						<option value="numbered">{{ t('shortlinks', 'Try -2, -3, and so on') }}</option>
					</select>
				</label>
				<NcTextField v-if="settings.collisionStrategy === 'random'"
					v-model="settings.suffixLength"
					type="number"
					min="1"
					max="12"
					:disabled="!settings.allowAliasSettings"
					:label="t('shortlinks', 'Starting suffix length')" />
			</div>
			<NcNoteCard v-if="!settings.allowAliasSettings" type="info" :text="t('shortlinks', 'Your administrator manages alias generation globally.')" />
			<div class="example-card">
				<span>{{ t('shortlinks', 'Example alias') }}</span><strong>{{ aliasExample }}</strong>
			</div>
		</section>

		<hr>

		<section class="preference-group">
			<h3>{{ t('shortlinks', 'URL used for sharing') }}</h3>
			<p>{{ t('shortlinks', 'Keep the global URL, append the alias to your own domain, or define an expert transformation.') }}</p>
			<label class="select-field">
				<span>{{ t('shortlinks', 'URL format') }}</span>
				<select v-model="settings.urlMode" :disabled="!settings.allowUrlSettings">
					<option value="inherit">{{ t('shortlinks', 'Use administrator default') }}</option>
					<option value="simple">{{ t('shortlinks', 'Domain and append alias') }}</option>
					<option value="template">{{ t('shortlinks', 'Template with placeholders') }}</option>
					<option value="regex">{{ t('shortlinks', 'Regular expression replacement') }}</option>
				</select>
			</label>
			<NcTextField v-if="settings.urlMode === 'simple'"
				v-model="settings.baseUrl"
				type="url"
				:label="t('shortlinks', 'Short-link domain or base URL')"
				:helper-text="t('shortlinks', 'Example: https://go.example — the alias is appended automatically.')" />
			<NcTextField v-else-if="settings.urlMode === 'template'"
				v-model="settings.urlTemplate"
				:label="t('shortlinks', 'URL template')"
				:helper-text="t('shortlinks', 'Use {alias}; {user} is optional.')" />
			<div v-else-if="settings.urlMode === 'regex'" class="preference-grid">
				<NcTextField v-model="settings.urlPattern"
					:label="t('shortlinks', 'Regular expression')"
					:helper-text="t('shortlinks', 'Without delimiters; it is applied to the canonical URL.')" />
				<NcTextField v-model="settings.urlReplacement"
					:label="t('shortlinks', 'Replacement')"
					:helper-text="t('shortlinks', 'Captured groups can be inserted with $1, $2, and so on.')" />
			</div>
			<NcNoteCard v-if="!settings.allowUrlSettings" type="info" :text="t('shortlinks', 'Your administrator manages the shared short-link URL globally.')" />
			<div class="example-card">
				<span>{{ t('shortlinks', 'Preview') }}</span><strong>{{ urlPreview || canonicalExample }}</strong>
			</div>
			<NcNoteCard v-if="settings.urlMode !== 'inherit'" type="warning" :text="t('shortlinks', 'Your custom domain must already forward requests to this Nextcloud Shortlinks endpoint.')" />
		</section>

		<NcButton type="submit" variant="primary" :disabled="saving">
			{{ saving ? t('shortlinks', 'Saving…') : t('shortlinks', 'Save') }}
		</NcButton>
	</form>
</template>

<style scoped>
.alias-url-settings,
.preference-group { display: grid; gap: calc(var(--default-grid-baseline) * 3); }

.preference-group h3,
.preference-group p { margin: 0; }

.preference-group p { color: var(--color-text-maxcontrast); }

.preference-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: calc(var(--default-grid-baseline) * 3); }

.select-field { display: grid; gap: var(--default-grid-baseline); font-weight: 600; }

.select-field select { min-block-size: 44px; margin: 0; font-weight: normal; }

.example-card { display: grid; gap: var(--default-grid-baseline); padding: calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-background-hover); overflow-wrap: anywhere; }

.example-card span { color: var(--color-text-maxcontrast); font-size: .9em; }

.alias-url-settings > hr { inline-size: 100%; margin: 0; border: 0; border-block-start: 1px solid var(--color-border); }

.alias-url-settings > :last-child { justify-self: start; }
</style>
