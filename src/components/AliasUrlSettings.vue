<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { UserSettings } from '../types'

const props = withDefaults(defineProps<{ section?: 'alias' | 'url' }>(), { section: 'alias' })
const emit = defineEmits<{ saved: [settings: UserSettings] }>()
const loading = ref(true)
const saving = ref(false)
const aliasSaved = ref(false)
let saveTimer: ReturnType<typeof setTimeout> | undefined
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
	useThumbnails: true,
	metadataAutocomplete: true,
	showQuickStart: true,
	pageEditorSingleSection: true,
	pageAutosaveEnabled: true,
	pageAutosaveDelay: 10,
	metadataCollectionEnabled: true,
	allowImportSuggestions: true,
	email: '',
})

const aliasExample = computed(() => {
	if (settings.aliasStrategy === 'shortest') return '1a'
	if (settings.aliasStrategy === 'readable') return settings.collisionStrategy === 'numbered' ? 'summer-campaign-2' : `summer-campaign-${'x'.repeat(settings.suffixLength)}`
	if (settings.aliasStrategy === 'random') return 'aB3x9Qz'
	return settings.previewAlias
})
const forwardingPath = `${window.location.origin}/apps/shortlinks/r/`
const htaccessSnippet = computed(() => `RewriteEngine On\nRewriteRule ^(.+?)/?$ ${forwardingPath}$1 [R=302,L,NE]`)
const phpSnippet = computed(() => `<?php\n$alias = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');\nheader('Location: ${forwardingPath}' . rawurlencode($alias), true, 302);\nexit;`)

async function copySnippet(value: string) {
	await navigator.clipboard.writeText(value)
	showSuccess(t('shortlinks', 'Forwarding example copied'))
}
const canonicalExample = computed(() => `${window.location.origin}/apps/shortlinks/r/${aliasExample.value}`)
const urlPreview = computed(() => {
	const canonical = canonicalExample.value
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
	if (mode === 'template' && !settings.urlTemplate) settings.urlTemplate = `${settings.baseUrl.trim().replace(/\/$/, '') || `${window.location.origin}/apps/shortlinks/r`}/{alias}`
	if (mode === 'regex' && !settings.urlPattern) {
		const prefix = `${window.location.origin}/apps/shortlinks/r/`
		settings.urlPattern = `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.+)$`
		settings.urlReplacement = `${settings.baseUrl.trim().replace(/\/$/, '') || 'https://go.example'}/$1`
	}
})

watch(() => [settings.aliasStrategy, settings.collisionStrategy, settings.suffixLength], () => {
	if (loading.value || props.section !== 'alias') return
	aliasSaved.value = false
	if (saveTimer) clearTimeout(saveTimer)
	saveTimer = setTimeout(() => save(true), 500)
})

onMounted(load)
onBeforeUnmount(() => { if (saveTimer) clearTimeout(saveTimer) })

async function load() {
	loading.value = true
	try { Object.assign(settings, await api.getUserSettings()) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { loading.value = false }
}

async function save(silent = false) {
	if (saving.value) return
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
		if (silent) aliasSaved.value = true
		else showSuccess(t('shortlinks', 'Personal link settings saved'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally { saving.value = false }
}
</script>

<template>
	<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading personal link settings')" />
	<form v-else class="alias-url-settings" @submit.prevent="save(false)">
		<section v-if="section === 'alias'" class="preference-group">
			<p>{{ t('shortlinks', 'Choose how the editable alias field is prefilled when you create a link.') }}</p>
			<label class="select-field"><span>{{ t('shortlinks', 'Alias strategy') }}</span><select v-model="settings.aliasStrategy" :disabled="!settings.allowAliasSettings">
				<option value="inherit">{{ t('shortlinks', 'Use administrator default') }}</option>
				<option value="shortest">{{ t('shortlinks', 'As short as possible') }}</option>
				<option value="readable">{{ t('shortlinks', 'Guess from title or destination') }}</option>
				<option value="random">{{ t('shortlinks', 'Generate a random alias') }}</option>
			</select></label>
			<div v-if="settings.aliasStrategy === 'readable'" class="preference-grid">
				<label class="select-field"><span>{{ t('shortlinks', 'If the guessed alias is already used') }}</span><select v-model="settings.collisionStrategy" :disabled="!settings.allowAliasSettings">
					<option value="random">{{ t('shortlinks', 'Add the shortest random suffix') }}</option>
					<option value="numbered">{{ t('shortlinks', 'Try -2, -3, and so on') }}</option>
				</select></label>
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
			<p class="autosave-status" aria-live="polite">
				{{ saving ? t('shortlinks', 'Saving…') : aliasSaved ? t('shortlinks', 'Saved automatically') : t('shortlinks', 'Changes are saved automatically') }}
			</p>
		</section>

		<section v-else class="preference-group">
			<p>{{ t('shortlinks', 'Keep the global URL, append the alias to your own domain, or define an expert transformation.') }}</p>
			<label class="select-field"><span>{{ t('shortlinks', 'URL format') }}</span><select v-model="settings.urlMode" :disabled="!settings.allowUrlSettings">
				<option value="inherit">{{ t('shortlinks', 'Use administrator default') }}</option>
				<option value="simple">{{ t('shortlinks', 'Domain and append alias') }}</option>
				<option value="template">{{ t('shortlinks', 'Template with placeholders') }}</option>
				<option value="regex">{{ t('shortlinks', 'Regular expression replacement') }}</option>
			</select></label>
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
				<NcTextField v-model="settings.urlPattern" :label="t('shortlinks', 'Regular expression')" :helper-text="t('shortlinks', 'Without delimiters; it is applied to the canonical URL.')" />
				<NcTextField v-model="settings.urlReplacement" :label="t('shortlinks', 'Replacement')" :helper-text="t('shortlinks', 'Captured groups can be inserted with $1, $2, and so on.')" />
			</div>
			<NcNoteCard v-if="!settings.allowUrlSettings" type="info" :text="t('shortlinks', 'Your administrator manages the shared short-link URL globally.')" />
			<div class="example-card">
				<span>{{ t('shortlinks', 'Preview') }}</span><strong>{{ urlPreview || canonicalExample }}</strong>
			</div>
			<NcNoteCard v-if="settings.urlMode !== 'inherit'" type="info" :text="t('shortlinks', 'Your custom domain must forward the alias to this Nextcloud Shortlinks endpoint. These drop-in examples perform a simple redirect and keep your links working without another application.')" />
			<details v-if="settings.urlMode !== 'inherit'" class="forwarding-example">
				<summary>{{ t('shortlinks', 'Apache .htaccess example') }}</summary>
				<pre><code>{{ htaccessSnippet }}</code></pre>
				<NcButton variant="tertiary" @click="copySnippet(htaccessSnippet)">
					{{ t('shortlinks', 'Copy .htaccess') }}
				</NcButton>
			</details>
			<details v-if="settings.urlMode !== 'inherit'" class="forwarding-example">
				<summary>{{ t('shortlinks', 'PHP index.php example') }}</summary>
				<pre><code>{{ phpSnippet }}</code></pre>
				<NcButton variant="tertiary" @click="copySnippet(phpSnippet)">
					{{ t('shortlinks', 'Copy index.php') }}
				</NcButton>
			</details>
			<NcButton type="submit" variant="primary" :disabled="saving">
				{{ saving ? t('shortlinks', 'Saving…') : t('shortlinks', 'Save') }}
			</NcButton>
		</section>
	</form>
</template>

<style scoped>
.alias-url-settings, .preference-group { display: grid; gap: calc(var(--default-grid-baseline) * 3); }

.preference-group h3, .preference-group p { margin: 0; }

.preference-group p { color: var(--color-text-maxcontrast); }

.preference-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: calc(var(--default-grid-baseline) * 3); }

.select-field { display: grid; gap: var(--default-grid-baseline); font-weight: 600; }

.select-field select { min-block-size: 44px; margin: 0; font-weight: normal; }

.example-card { display: grid; gap: var(--default-grid-baseline); padding: calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-background-hover); overflow-wrap: anywhere; }

.example-card span { color: var(--color-text-maxcontrast); font-size: .9em; }

.preference-group > :last-child:is(button, .button-vue) { justify-self: start; }

.autosave-status { min-block-size: 20px; color: var(--color-text-maxcontrast); font-size: .85rem; }

.forwarding-example { padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 3); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); }

.forwarding-example summary { cursor: pointer; font-weight: 600; }

.forwarding-example pre { max-inline-size: 100%; overflow: auto; padding: calc(var(--default-grid-baseline) * 2); border-radius: var(--border-radius); background: var(--color-background-dark); }
</style>
