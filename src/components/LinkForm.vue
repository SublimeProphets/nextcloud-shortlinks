<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { mdiInformationOutline, mdiLinkVariant, mdiRefresh } from '@mdi/js'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcPopover from '@nextcloud/vue/components/NcPopover'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import { useAliasValidation } from '../composables/useAliasValidation'
import type { AccessMode, Folder, LinkDraft, ShortLink, Tag } from '../types'

const props = withDefaults(defineProps<{
	folders: Folder[]
	tags: Tag[]
	redirectStatuses?: number[]
	allowedSchemes?: string[]
	baseUrl?: string | null
	prefillUrl?: string
	prefillTitle?: string
	prefillAlias?: string
	link?: ShortLink
	allowTitleFetch?: boolean
}>(), {
	redirectStatuses: () => [301, 302, 307, 308],
	allowedSchemes: () => ['http', 'https'],
	baseUrl: null,
	prefillUrl: '',
	prefillTitle: '',
	prefillAlias: '',
	link: undefined,
	allowTitleFetch: false,
})
const emit = defineEmits<{ close: []; save: [draft: Partial<LinkDraft>] }>()
const draft = reactive<LinkDraft>({
	targetUrl: props.link?.targetUrl ?? props.prefillUrl,
	title: props.link?.title ?? props.prefillTitle,
	slug: props.link?.slug ?? props.prefillAlias,
	description: props.link?.description ?? '',
	folderId: props.link?.folderId ?? null,
	tagIds: props.link?.tags.map(tag => tag.id) ?? [],
	active: props.link?.active ?? true,
	favorite: props.link?.favorite ?? false,
	accessMode: props.link?.accessMode ?? 'public',
	password: '',
	redirectStatus: props.link?.redirectStatus ?? 302,
	startsAt: props.link?.startsAt ?? null,
	expiresAt: props.link?.expiresAt ?? null,
	clickLimit: props.link?.clickLimit ?? null,
})
const slug = computed({ get: () => draft.slug, set: value => { draft.slug = value } })
const alias = useAliasValidation(slug, props.link?.slug)
const fetchingTitle = ref(false)
const newTagName = ref('')
const availableTags = ref<Tag[]>([...props.tags])
const limitClicks = ref(props.link?.clickLimit !== null && props.link?.clickLimit !== undefined)
const accessModes: Array<{ value: AccessMode; label: string }> = [
	{ value: 'public', label: 'Public/unlisted' },
	{ value: 'authenticated', label: 'Signed-in users' },
	{ value: 'users', label: 'Selected users' },
	{ value: 'groups', label: 'Selected groups' },
	{ value: 'password', label: 'Password protected' },
	{ value: 'disabled', label: 'Disabled' },
]
const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: value => { draft.startsAt = toTimestamp(value) } })
const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: value => { draft.expiresAt = toTimestamp(value) } })
const targetError = computed(() => {
	if (!draft.targetUrl.trim()) return t('shortlinks', 'Enter a destination URL.')
	try {
		const parsed = new URL(draft.targetUrl)
		const scheme = parsed.protocol.replace(/:$/, '').toLowerCase()
		return props.allowedSchemes.map(value => value.toLowerCase()).includes(scheme)
			? ''
			: t('shortlinks', 'This URL scheme is not allowed. Allowed: {schemes}', { schemes: props.allowedSchemes.join(', ') })
	} catch {
		return t('shortlinks', 'Enter a complete URL including its scheme.')
	}
})
const shortUrlPrefix = computed(() => {
	const configured = props.baseUrl?.trim().replace(/\/$/, '')
	return configured ? `${configured}/` : `${location.origin}/apps/shortlinks/r/`
})
const canSave = computed(() => !targetError.value
	&& alias.valid.value
	&& (draft.accessMode !== 'password' || Boolean(draft.password) || Boolean(props.link?.passwordProtected))
	&& (!limitClicks.value || Number(draft.clickLimit) > 0))

onMounted(() => {
	if (!draft.slug) alias.suggest()
})

function toggleTag(id: number) {
	const values = draft.tagIds ?? []
	draft.tagIds = values.includes(id) ? values.filter(value => value !== id) : [...values, id]
}

async function fetchTitle() {
	if (!draft.targetUrl) return
	fetchingTitle.value = true
	try {
		const result = await api.fetchTitle(draft.targetUrl)
		if (result.title) draft.title = result.title
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		fetchingTitle.value = false
	}
}

async function createTag() {
	const name = newTagName.value.trim()
	if (!name) return
	try {
		const tag = await api.createTag(name)
		availableTags.value.push(tag)
		draft.tagIds = [...draft.tagIds, tag.id]
		newTagName.value = ''
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
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

function submit() {
	if (!canSave.value) return
	const payload: Partial<LinkDraft> = {
		...draft,
		targetUrl: draft.targetUrl.trim(),
		slug: draft.slug.trim(),
		tagIds: [...draft.tagIds],
		clickLimit: limitClicks.value ? Number(draft.clickLimit) : null,
	}
	if (props.link && !payload.password) delete payload.password
	emit('save', payload)
}
</script>

<template>
	<NcDialog :name="link ? t('shortlinks', 'Edit short link') : t('shortlinks', 'New short link')" size="large" @closing="emit('close')">
		<form id="shortlink-form" class="link-form" @submit.prevent="submit">
			<section class="form-section form-section--primary" aria-labelledby="destination-heading">
				<div class="section-heading">
					<NcIconSvgWrapper :path="mdiLinkVariant" :size="28" aria-hidden="true" />
					<div>
						<h2 id="destination-heading">
							{{ t('shortlinks', 'Destination and short URL') }}
						</h2>
						<p>{{ t('shortlinks', 'Where should the short link lead, and how should it be named?') }}</p>
					</div>
				</div>
				<div class="component-field">
					<label for="shortlinks-target-url">{{ t('shortlinks', 'Destination URL') }}</label>
					<NcTextField id="shortlinks-target-url"
						v-model="draft.targetUrl"
						type="url"
						required
						:helper-text="draft.targetUrl ? targetError : t('shortlinks', 'Paste the full address you want to shorten.')"
						:error="Boolean(draft.targetUrl && targetError)" />
				</div>
				<div class="alias-field-row">
					<div class="component-field">
						<label for="shortlinks-alias">{{ t('shortlinks', 'Alias') }}</label>
						<NcTextField id="shortlinks-alias"
							v-model="draft.slug"
							required
							:helper-text="alias.message.value"
							:error="alias.state.value === 'invalid' || alias.state.value === 'unavailable'"
							:success="alias.state.value === 'available'" />
					</div>
					<div class="alias-actions">
						<NcPopover>
							<template #trigger="{ attrs }">
								<NcButton v-bind="attrs" variant="tertiary-no-background" :aria-label="t('shortlinks', 'Alias rules')">
									<template #icon>
										<NcIconSvgWrapper :path="mdiInformationOutline" />
									</template>
								</NcButton>
							</template>
							<div class="alias-popover">
								<strong>{{ t('shortlinks', 'Alias rules') }}</strong>
								<ul>
									<li>{{ t('shortlinks', 'Start with a letter or number.') }}</li>
									<li>{{ t('shortlinks', 'Use letters, numbers, hyphens, and underscores only.') }}</li>
									<li>{{ t('shortlinks', 'Maximum length: 128 characters.') }}</li>
									<li>{{ t('shortlinks', 'Every alias must be unique.') }}</li>
								</ul>
							</div>
						</NcPopover>
						<NcButton variant="tertiary-no-background" :aria-label="t('shortlinks', 'Generate another alias')" @click="alias.suggest">
							<template #icon>
								<NcIconSvgWrapper :path="mdiRefresh" />
							</template>
						</NcButton>
					</div>
				</div>
				<p class="short-url-preview" aria-live="polite">
					<span>{{ shortUrlPrefix }}</span><strong>{{ draft.slug || '…' }}</strong>
				</p>
			</section>

			<hr>

			<section class="form-section" aria-labelledby="organization-heading">
				<div class="section-heading section-heading--plain">
					<div>
						<h2 id="organization-heading">
							{{ t('shortlinks', 'Details and organization') }}
						</h2>
						<p>{{ t('shortlinks', 'Add context and keep your short links easy to find.') }}</p>
					</div>
				</div>
				<div class="title-row">
					<div class="component-field">
						<label for="shortlinks-title">{{ t('shortlinks', 'Title') }}</label>
						<NcTextField id="shortlinks-title" v-model="draft.title" />
					</div>
					<NcButton v-if="allowTitleFetch"
						type="button"
						:disabled="fetchingTitle || Boolean(targetError)"
						@click="fetchTitle">
						{{ t('shortlinks', 'Fetch title') }}
					</NcButton>
				</div>
				<NcTextArea v-model="draft.description" :label="t('shortlinks', 'Description (optional)')" />
				<div class="form-grid">
					<label class="select-field">
						<span>{{ t('shortlinks', 'Folder') }}</span>
						<select v-model="draft.folderId"><option :value="null">{{ t('shortlinks', 'No folder') }}</option><option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option></select>
					</label>
					<NcCheckboxRadioSwitch v-model="draft.favorite" type="switch">
						{{ t('shortlinks', 'Favorite') }}
					</NcCheckboxRadioSwitch>
				</div>
				<fieldset class="tag-picker">
					<legend>{{ t('shortlinks', 'Tags') }}</legend>
					<div v-if="availableTags.length" class="tag-options">
						<NcCheckboxRadioSwitch v-for="tag in availableTags"
							:key="tag.id"
							type="checkbox"
							:model-value="draft.tagIds?.includes(tag.id)"
							@update:model-value="toggleTag(tag.id)">
							{{ tag.name }}
						</NcCheckboxRadioSwitch>
					</div>
					<div class="inline-create">
						<NcTextField v-model="newTagName" :label="t('shortlinks', 'Create tag')" />
						<NcButton type="button" :disabled="!newTagName.trim()" @click="createTag">
							{{ t('shortlinks', 'Add') }}
						</NcButton>
					</div>
				</fieldset>
			</section>

			<hr>

			<section class="form-section" aria-labelledby="access-heading">
				<div class="section-heading section-heading--plain">
					<div>
						<h2 id="access-heading">
							{{ t('shortlinks', 'Access settings') }}
						</h2>
						<p>{{ t('shortlinks', 'Control who can use the link and for how long.') }}</p>
					</div>
				</div>
				<div class="form-grid">
					<label class="select-field"><span>{{ t('shortlinks', 'Redirect type') }}</span><select v-model="draft.redirectStatus"><option v-for="status in redirectStatuses" :key="status" :value="status">{{ status }}</option></select></label>
					<label class="select-field"><span>{{ t('shortlinks', 'Access') }}</span><select v-model="draft.accessMode"><option v-for="mode in accessModes" :key="mode.value" :value="mode.value">{{ t('shortlinks', mode.label) }}</option></select></label>
				</div>
				<p v-if="draft.redirectStatus === 301 || draft.redirectStatus === 308" class="warning">
					{{ t('shortlinks', 'Permanent redirects can be cached, making statistics incomplete.') }}
				</p>
				<NcTextField v-if="draft.accessMode === 'password'"
					v-model="draft.password"
					type="password"
					autocomplete="new-password"
					:required="!link?.passwordProtected"
					:label="t('shortlinks', 'Password')" />
				<div class="form-grid">
					<label class="native-field"><span>{{ t('shortlinks', 'Valid from') }}</span><input v-model="startsAtLocal" type="datetime-local"></label>
					<label class="native-field"><span>{{ t('shortlinks', 'Expires at') }}</span><input v-model="expiresAtLocal" type="datetime-local"></label>
				</div>
				<div class="click-limit">
					<NcCheckboxRadioSwitch v-model="limitClicks" type="checkbox">
						{{ t('shortlinks', 'Limit number of visits') }}
					</NcCheckboxRadioSwitch>
					<label v-if="limitClicks" class="native-field"><span>{{ t('shortlinks', 'Maximum visits') }}</span><input v-model.number="draft.clickLimit"
						type="number"
						min="1"
						required></label>
				</div>
			</section>
		</form>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
			<NcButton type="submit"
				form="shortlink-form"
				variant="primary"
				:disabled="!canSave">
				{{ link ? t('shortlinks', 'Save changes') : t('shortlinks', 'Create') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.link-form,
.form-section {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 3);
}

.link-form {
	padding-block: calc(var(--default-grid-baseline) * 2);
}

.form-section--primary {
	padding: calc(var(--default-grid-baseline) * 4);
	border: 1px solid var(--color-primary-element-light);
	border-radius: var(--border-radius-large);
	background: var(--color-primary-element-light-hover);
}

.section-heading {
	display: flex;
	align-items: flex-start;
	gap: calc(var(--default-grid-baseline) * 2);
}

.section-heading--plain {
	padding-block-start: var(--default-grid-baseline);
}

.section-heading h2,
.section-heading p {
	margin: 0;
}

.section-heading p {
	margin-block-start: var(--default-grid-baseline);
	color: var(--color-text-maxcontrast);
}

.link-form hr {
	inline-size: 100%;
	margin: calc(var(--default-grid-baseline) * 2) 0;
	border: 0;
	border-block-start: 1px solid var(--color-border);
}

.alias-field-row,
.title-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: var(--default-grid-baseline);
}

.component-field {
	display: grid;
	gap: var(--default-grid-baseline);
}

.component-field > label {
	font-weight: 600;
}

.alias-actions,
.tag-options,
.inline-create {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: calc(var(--default-grid-baseline) * 2);
}

.short-url-preview {
	margin: 0;
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 3);
	border-radius: var(--border-radius);
	background: var(--color-background-dark);
	overflow-wrap: anywhere;
}

.short-url-preview span {
	color: var(--color-text-maxcontrast);
}

.short-url-preview strong {
	color: var(--color-primary-element);
}

.alias-popover {
	max-inline-size: 320px;
	padding: calc(var(--default-grid-baseline) * 3);
}

.alias-popover ul {
	margin-block-end: 0;
	padding-inline-start: calc(var(--default-grid-baseline) * 5);
}

.form-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items: end;
	gap: calc(var(--default-grid-baseline) * 3);
}

.select-field,
.native-field {
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
	display: grid;
	gap: calc(var(--default-grid-baseline) * 2);
	margin: 0;
	padding: 0;
	border: 0;
}

.tag-picker legend {
	font-weight: 600;
}

.click-limit {
	display: grid;
	max-inline-size: 320px;
	gap: calc(var(--default-grid-baseline) * 2);
}

.warning {
	margin: 0;
}

@media (max-width: 620px) {
	.form-grid,
	.alias-field-row,
	.title-row {
		grid-template-columns: 1fr;
	}

	.form-section--primary {
		padding: calc(var(--default-grid-baseline) * 3);
	}
}
</style>
