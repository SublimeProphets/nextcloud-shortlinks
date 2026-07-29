<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { mdiDotsHorizontalCircleOutline, mdiPencilOutline, mdiShieldLockOutline, mdiShapeOutline } from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { useAliasValidation } from '../composables/useAliasValidation'
import type { AccessMode, Folder, LinkDraft, Tag } from '../types'

const props = withDefaults(defineProps<{
	folders: Folder[]
	tags: Tag[]
	redirectStatuses?: number[]
	allowedSchemes?: string[]
	baseUrl?: string | null
	create: (draft: Partial<LinkDraft>) => Promise<void>
}>(), {
	redirectStatuses: () => [301, 302, 307, 308],
	allowedSchemes: () => ['http', 'https'],
	baseUrl: null,
})

type SettingsGroup = 'organization' | 'access' | 'more'
const draft = reactive<LinkDraft>({
	targetUrl: '',
	slug: '',
	title: '',
	description: '',
	folderId: null,
	tagIds: [],
	favorite: false,
	active: true,
	accessMode: 'public',
	password: '',
	redirectStatus: 302,
	startsAt: null,
	expiresAt: null,
	clickLimit: null,
})
const slug = computed({ get: () => draft.slug, set: value => { draft.slug = value } })
const alias = useAliasValidation(slug)
const editingAlias = ref(false)
const activeSettings = ref<SettingsGroup | null>(null)
const saving = ref(false)
const limitClicks = ref(false)
const accessModes: Array<{ value: AccessMode; label: string }> = [
	{ value: 'public', label: 'Public/unlisted' },
	{ value: 'authenticated', label: 'Signed-in users' },
	{ value: 'password', label: 'Password protected' },
	{ value: 'disabled', label: 'Disabled' },
]
const shortUrlPrefix = computed(() => {
	const configured = props.baseUrl?.trim().replace(/\/$/, '')
	return configured ? `${configured}/` : `${location.origin}/apps/shortlinks/r/`
})
const urlValid = computed(() => {
	try {
		const parsed = new URL(draft.targetUrl)
		return props.allowedSchemes.map(value => value.toLowerCase()).includes(parsed.protocol.replace(/:$/, '').toLowerCase())
	} catch {
		return false
	}
})
const canCreate = computed(() => urlValid.value
	&& alias.valid.value
	&& !saving.value
	&& (draft.accessMode !== 'password' || Boolean(draft.password))
	&& (!limitClicks.value || Number(draft.clickLimit) > 0))
const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: value => { draft.startsAt = toTimestamp(value) } })
const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: value => { draft.expiresAt = toTimestamp(value) } })

onMounted(() => alias.suggest())

function toggleSettings(group: SettingsGroup) {
	activeSettings.value = activeSettings.value === group ? null : group
}

function toggleTag(id: number) {
	draft.tagIds = draft.tagIds.includes(id) ? draft.tagIds.filter(value => value !== id) : [...draft.tagIds, id]
}

async function submit() {
	if (!canCreate.value) return
	saving.value = true
	try {
		await props.create({
			...draft,
			targetUrl: draft.targetUrl.trim(),
			slug: draft.slug.trim(),
			tagIds: [...draft.tagIds],
			clickLimit: limitClicks.value ? Number(draft.clickLimit) : null,
		})
		showSuccess(t('shortlinks', 'Short link created'))
		reset()
		await alias.suggest()
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		saving.value = false
	}
}

function reset() {
	Object.assign(draft, {
		targetUrl: '',
		slug: '',
		title: '',
		description: '',
		folderId: null,
		tagIds: [],
		favorite: false,
		active: true,
		accessMode: 'public',
		password: '',
		redirectStatus: 302,
		startsAt: null,
		expiresAt: null,
		clickLimit: null,
	})
	editingAlias.value = false
	activeSettings.value = null
	limitClicks.value = false
}

function toLocal(timestamp: number | null): string {
	if (timestamp === null) return ''
	const date = new Date(timestamp * 1000)
	return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

function toTimestamp(value: string): number | null {
	if (!value) return null
	const milliseconds = new Date(value).getTime()
	return Number.isFinite(milliseconds) ? Math.floor(milliseconds / 1000) : null
}
</script>

<template>
	<section class="quick-create" aria-labelledby="quick-create-heading">
		<div class="quick-create__intro">
			<h2 id="quick-create-heading">
				{{ t('shortlinks', 'Create a short link') }}
			</h2>
			<p>{{ t('shortlinks', 'Paste a long URL and share a clean, memorable link in seconds.') }}</p>
		</div>
		<form @submit.prevent="submit">
			<div class="quick-create__url-row">
				<NcTextField v-model="draft.targetUrl"
					type="url"
					required
					:label="t('shortlinks', 'Destination URL')"
					placeholder="https://example.com/a/very/long/address" />
				<NcButton type="submit" variant="primary" :disabled="!canCreate">
					{{ saving ? t('shortlinks', 'Creating…') : t('shortlinks', 'Create') }}
				</NcButton>
			</div>

			<div class="quick-create__lower">
				<div class="quick-create__preview" :class="{ 'quick-create__preview--editing': editingAlias }">
					<span class="preview-label">{{ t('shortlinks', 'Your short link') }}</span>
					<div v-if="editingAlias" class="preview-editor">
						<span>{{ shortUrlPrefix }}</span>
						<NcTextField v-model="draft.slug"
							:label="t('shortlinks', 'Alias')"
							:error="alias.state.value === 'invalid' || alias.state.value === 'unavailable'"
							:success="alias.state.value === 'available'" />
					</div>
					<button v-else
						type="button"
						class="preview-value"
						:aria-label="t('shortlinks', 'Edit alias')"
						@click="editingAlias = true">
						<span>{{ shortUrlPrefix }}</span><mark>{{ draft.slug || '…' }}</mark><NcIconSvgWrapper class="preview-pencil" :path="mdiPencilOutline" :size="18" />
					</button>
					<p v-if="editingAlias"
						class="alias-feedback"
						:class="`alias-feedback--${alias.state.value}`"
						aria-live="polite">
						{{ alias.message.value }}
					</p>
				</div>

				<div class="quick-create__settings" role="toolbar" :aria-label="t('shortlinks', 'Creation settings')">
					<NcButton :pressed="activeSettings === 'organization'" variant="tertiary" @click="toggleSettings('organization')">
						<template #icon>
							<NcIconSvgWrapper :path="mdiShapeOutline" />
						</template>{{ t('shortlinks', 'Organization') }}
					</NcButton>
					<NcButton :pressed="activeSettings === 'access'" variant="tertiary" @click="toggleSettings('access')">
						<template #icon>
							<NcIconSvgWrapper :path="mdiShieldLockOutline" />
						</template>{{ t('shortlinks', 'Access') }}
					</NcButton>
					<NcButton :pressed="activeSettings === 'more'" variant="tertiary" @click="toggleSettings('more')">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDotsHorizontalCircleOutline" />
						</template>{{ t('shortlinks', 'More') }}
					</NcButton>
				</div>
			</div>

			<div v-if="activeSettings" class="quick-create__panel">
				<div v-if="activeSettings === 'organization'" class="settings-grid">
					<NcTextField v-model="draft.title" :label="t('shortlinks', 'Title')" />
					<label class="select-field"><span>{{ t('shortlinks', 'Folder') }}</span><select v-model="draft.folderId"><option :value="null">{{ t('shortlinks', 'No folder') }}</option><option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option></select></label>
					<fieldset v-if="tags.length" class="tag-picker">
						<legend>{{ t('shortlinks', 'Tags') }}</legend><NcCheckboxRadioSwitch v-for="tag in tags"
							:key="tag.id"
							type="checkbox"
							:model-value="draft.tagIds.includes(tag.id)"
							@update:model-value="toggleTag(tag.id)">
							{{ tag.name }}
						</NcCheckboxRadioSwitch>
					</fieldset>
				</div>
				<div v-else-if="activeSettings === 'access'" class="settings-grid">
					<label class="select-field"><span>{{ t('shortlinks', 'Access') }}</span><select v-model="draft.accessMode"><option v-for="mode in accessModes" :key="mode.value" :value="mode.value">{{ t('shortlinks', mode.label) }}</option></select></label>
					<label class="select-field"><span>{{ t('shortlinks', 'Redirect type') }}</span><select v-model="draft.redirectStatus"><option v-for="status in redirectStatuses" :key="status" :value="status">{{ status }}</option></select></label>
					<NcTextField v-if="draft.accessMode === 'password'"
						v-model="draft.password"
						type="password"
						:label="t('shortlinks', 'Password')" />
				</div>
				<div v-else class="settings-grid settings-grid--more">
					<NcTextArea v-model="draft.description" :label="t('shortlinks', 'Description (optional)')" />
					<NcCheckboxRadioSwitch v-model="draft.favorite" type="switch">
						{{ t('shortlinks', 'Favorite') }}
					</NcCheckboxRadioSwitch>
					<label class="native-field"><span>{{ t('shortlinks', 'Valid from') }}</span><input v-model="startsAtLocal" type="datetime-local"></label>
					<label class="native-field"><span>{{ t('shortlinks', 'Expires at') }}</span><input v-model="expiresAtLocal" type="datetime-local"></label>
					<div class="limit-field">
						<NcCheckboxRadioSwitch v-model="limitClicks" type="checkbox">
							{{ t('shortlinks', 'Limit number of visits') }}
						</NcCheckboxRadioSwitch><label v-if="limitClicks" class="native-field"><span>{{ t('shortlinks', 'Maximum visits') }}</span><input v-model.number="draft.clickLimit" type="number" min="1"></label>
					</div>
				</div>
			</div>
		</form>
	</section>
</template>

<style scoped>
.quick-create {
	inline-size: 100%;
	padding: clamp(20px, 4vw, 40px);
	border: 1px solid var(--color-primary-element-light);
	border-radius: var(--border-radius-large);
	background: linear-gradient(135deg, var(--color-primary-element-light-hover), var(--color-main-background) 72%);
	box-shadow: 0 4px 18px color-mix(in srgb, var(--color-box-shadow) 70%, transparent);
}

.quick-create__intro h2,
.quick-create__intro p {
	margin: 0;
}

.quick-create__intro h2 {
	font-size: 1.6rem;
}

.quick-create__intro p,
.preview-label {
	color: var(--color-text-maxcontrast);
}

.quick-create__intro p {
	margin-block-start: var(--default-grid-baseline);
}

.quick-create form {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 4);
	margin-block-start: calc(var(--default-grid-baseline) * 5);
}

.quick-create__url-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 3);
}

.quick-create__url-row > :last-child {
	min-inline-size: 112px;
}

.quick-create__lower {
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: calc(var(--default-grid-baseline) * 4);
}

.quick-create__preview {
	min-inline-size: 0;
}

.preview-label {
	display: block;
	font-size: .85rem;
}

.preview-value {
	display: flex;
	align-items: center;
	max-inline-size: 100%;
	margin: 0;
	padding: var(--default-grid-baseline) 0;
	border: 0;
	background: transparent;
	color: var(--color-main-text);
	font: inherit;
	font-size: 1.05rem;
	cursor: pointer;
	overflow-wrap: anywhere;
}

.preview-value mark {
	padding: 1px 4px;
	border-radius: var(--border-radius);
	background: var(--color-primary-element-light);
	color: var(--color-primary-element);
	font-weight: 600;
}

.preview-pencil {
	margin-inline-start: calc(var(--default-grid-baseline) * 2);
	opacity: 0;
	transition: opacity .15s ease;
}

.preview-value:hover .preview-pencil,
.preview-value:focus-visible .preview-pencil {
	opacity: 1;
}

.preview-editor {
	display: flex;
	align-items: center;
	gap: var(--default-grid-baseline);
}

.alias-feedback {
	margin: var(--default-grid-baseline) 0 0;
	font-size: .85rem;
}

.alias-feedback--available { color: var(--color-success-text); }

.alias-feedback--invalid,
.alias-feedback--unavailable { color: var(--color-error-text); }

.quick-create__settings {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: var(--default-grid-baseline);
}

.quick-create__panel {
	padding-block-start: calc(var(--default-grid-baseline) * 4);
	border-block-start: 1px solid var(--color-border);
}

.settings-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items: start;
	gap: calc(var(--default-grid-baseline) * 3);
}

.settings-grid--more > :first-child {
	grid-column: 1 / -1;
}

.select-field,
.native-field,
.limit-field {
	display: grid;
	gap: var(--default-grid-baseline);
	font-weight: 600;
}

.select-field select,
.native-field input {
	inline-size: 100%;
	min-block-size: 44px;
	margin: 0;
	padding-inline: calc(var(--default-grid-baseline) * 2);
	border: 1px solid var(--color-border-maxcontrast);
	border-radius: var(--border-radius);
	background: var(--color-main-background);
	color: var(--color-main-text);
	font-weight: normal;
}

.tag-picker {
	display: flex;
	flex-wrap: wrap;
	gap: calc(var(--default-grid-baseline) * 2);
	margin: 0;
	padding: 0;
	border: 0;
}

.tag-picker legend {
	inline-size: 100%;
	font-weight: 600;
}

@media (max-width: 700px) {
	.quick-create__url-row,
	.settings-grid {
		grid-template-columns: 1fr;
	}

	.quick-create__lower,
	.preview-editor {
		align-items: stretch;
		flex-direction: column;
	}

	.quick-create__settings {
		justify-content: flex-start;
	}
}
</style>
