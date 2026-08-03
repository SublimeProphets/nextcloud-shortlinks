<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRef, watch } from 'vue'
import {
	mdiContentCopy,
	mdiDownload,
	mdiDotsHorizontalCircleOutline,
	mdiPencilOutline,
	mdiPlus,
	mdiShieldLockOutline,
	mdiShapeOutline,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import { useAliasValidation } from '../composables/useAliasValidation'
import { useLinkMetadataPreview } from '../composables/useLinkMetadataPreview'
import type { AccessMode, Folder, LinkDraft, ShortLink, Tag } from '../types'
import LinkAppearanceFields from './LinkAppearanceFields.vue'
import LinkPreviewEditor from './LinkPreviewEditor.vue'

const props = withDefaults(defineProps<{
	folders: Folder[]
	tags: Tag[]
	redirectStatuses?: number[]
	allowedSchemes?: string[]
	shortUrlTemplate?: string | null
	allowTitleFetch?: boolean
	create: (draft: Partial<LinkDraft>) => Promise<ShortLink>
}>(), {
	redirectStatuses: () => [301, 302, 307, 308],
	allowedSchemes: () => ['http', 'https'],
	shortUrlTemplate: null,
	allowTitleFetch: false,
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
	thumbnailPath: null,
	mediaPath: null,
	color: null,
})
const slug = computed({ get: () => draft.slug, set: value => { draft.slug = value } })
const alias = useAliasValidation(slug)
const aliasEdited = ref(false)
let aliasTimer: ReturnType<typeof setTimeout> | undefined
const editingAlias = ref(false)
const activeSettings = ref<SettingsGroup | null>(null)
const saving = ref(false)
const limitClicks = ref(false)
const createdLink = ref<ShortLink | null>(null)
const accessModes: Array<{ value: AccessMode; label: string }> = [
	{ value: 'public', label: 'Public/unlisted' },
	{ value: 'authenticated', label: 'Signed-in users' },
	{ value: 'password', label: 'Password protected' },
	{ value: 'disabled', label: 'Disabled' },
]
const redirectStatusHints: Record<number, string> = {
	301: 'Permanent redirect. Browsers and search engines may cache it.',
	302: 'Temporary redirect. The destination may change.',
	307: 'Temporary redirect that preserves the request method.',
	308: 'Permanent redirect that preserves the request method.',
}
const activeRedirectHint = computed(() => redirectStatusHints[draft.redirectStatus] ?? '')
const accessModeLabels: Record<AccessMode, string> = Object.fromEntries(accessModes.map(mode => [mode.value, mode.label])) as Record<AccessMode, string>
const shortUrlParts = computed(() => {
	const template = props.shortUrlTemplate || `${location.origin}/apps/shortlinks/r/{alias}`
	const [before, ...after] = template.split('{alias}')
	return { before, after: after.join('{alias}') }
})
const urlValid = computed(() => {
	try {
		const parsed = new URL(draft.targetUrl)
		return props.allowedSchemes.map(value => value.toLowerCase()).includes(parsed.protocol.replace(/:$/, '').toLowerCase())
	} catch {
		return false
	}
})
const targetError = computed(() => {
	if (!draft.targetUrl.trim()) return ''
	try {
		const parsed = new URL(draft.targetUrl)
		return props.allowedSchemes.map(value => value.toLowerCase()).includes(parsed.protocol.replace(/:$/, '').toLowerCase())
			? ''
			: t('shortlinks', 'This URL scheme is not allowed. Allowed: {schemes}', { schemes: props.allowedSchemes.join(', ') })
	} catch {
		return t('shortlinks', 'Enter a complete URL including its scheme.')
	}
})
const metadata = useLinkMetadataPreview(toRef(draft, 'targetUrl'), toRef(draft, 'title'), urlValid, computed(() => props.allowTitleFetch))
const canCreate = computed(() => urlValid.value
	&& alias.valid.value
	&& !saving.value
	&& (draft.accessMode !== 'password' || Boolean(draft.password))
	&& (!limitClicks.value || Number(draft.clickLimit) > 0))
const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: value => { draft.startsAt = toTimestamp(value) } })
const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: value => { draft.expiresAt = toTimestamp(value) } })
const organizationDetails = computed(() => {
	const link = createdLink.value
	if (!link) return []
	const folder = props.folders.find(item => item.id === link.folderId)
	return [
		folder ? { label: t('shortlinks', 'Folder'), value: folder.name } : null,
		link.tags.length ? { label: t('shortlinks', 'Tags'), value: link.tags.map(tag => tag.name).join(', ') } : null,
		link.favorite ? { label: t('shortlinks', 'Favorite'), value: t('shortlinks', 'Yes') } : null,
		link.description ? { label: t('shortlinks', 'Description'), value: link.description } : null,
	].filter((detail): detail is { label: string; value: string } => detail !== null)
})
const accessDetails = computed(() => {
	const link = createdLink.value
	if (!link) return []
	return [
		link.accessMode !== 'public' ? { label: t('shortlinks', 'Access'), value: t('shortlinks', accessModeLabels[link.accessMode]) } : null,
		link.redirectStatus !== 302 ? { label: t('shortlinks', 'Redirect type'), value: String(link.redirectStatus) } : null,
		link.startsAt !== null ? { label: t('shortlinks', 'Valid from'), value: formatTimestamp(link.startsAt) } : null,
		link.expiresAt !== null ? { label: t('shortlinks', 'Expires at'), value: formatTimestamp(link.expiresAt) } : null,
		link.clickLimit !== null ? { label: t('shortlinks', 'Maximum visits'), value: String(link.clickLimit) } : null,
		!link.active ? { label: t('shortlinks', 'Status'), value: t('shortlinks', 'Disabled') } : null,
	].filter((detail): detail is { label: string; value: string } => detail !== null)
})

onMounted(() => alias.suggest({ title: draft.title, targetUrl: draft.targetUrl }))

watch(() => [draft.title, draft.targetUrl], () => {
	if (aliasEdited.value || !urlValid.value) return
	if (aliasTimer) clearTimeout(aliasTimer)
	aliasTimer = setTimeout(() => alias.suggest({ title: draft.title, targetUrl: draft.targetUrl }), 450)
})

onBeforeUnmount(() => {
	if (aliasTimer) clearTimeout(aliasTimer)
})

function setAlias(value: string | number) {
	aliasEdited.value = true
	draft.slug = String(value)
}

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
		createdLink.value = await props.create({
			...draft,
			targetUrl: draft.targetUrl.trim(),
			slug: draft.slug.trim(),
			tagIds: [...draft.tagIds],
			clickLimit: limitClicks.value ? Number(draft.clickLimit) : null,
			thumbnailUrl: metadata.loaded.value ? metadata.imageUrl.value : undefined,
		})
		showSuccess(t('shortlinks', 'Short link created'))
		resetDraft()
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		saving.value = false
	}
}

function resetDraft() {
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
		thumbnailPath: null,
		mediaPath: null,
		color: null,
	})
	editingAlias.value = false
	aliasEdited.value = false
	activeSettings.value = null
	limitClicks.value = false
	metadata.resetTitleEditing()
}

async function createAnother() {
	createdLink.value = null
	await alias.suggest({ title: draft.title, targetUrl: draft.targetUrl })
}

async function copyShortUrl() {
	if (!createdLink.value) return
	try {
		await navigator.clipboard.writeText(createdLink.value.shortUrl)
		showSuccess(t('shortlinks', 'Copied'))
	} catch {
		showError(t('shortlinks', 'Could not copy'))
	}
}

async function loadQrSvg(): Promise<string> {
	if (!createdLink.value) throw new Error(t('shortlinks', 'Could not load QR code'))
	const response = await fetch(api.qrUrl(createdLink.value.id, 'svg'), {
		credentials: 'same-origin',
		headers: { Accept: 'image/svg+xml' },
	})
	if (!response.ok) throw new Error(t('shortlinks', 'Could not load QR code'))
	return response.text()
}

async function copyQrAsSvg() {
	try {
		const svg = await loadQrSvg()
		const blob = new Blob([svg], { type: 'image/svg+xml' })
		if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
			try {
				await navigator.clipboard.write([new ClipboardItem({ 'image/svg+xml': blob })])
			} catch {
				await navigator.clipboard.writeText(svg)
			}
		} else {
			await navigator.clipboard.writeText(svg)
		}
		showSuccess(t('shortlinks', 'QR code copied as SVG'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

function formatTimestamp(timestamp: number): string {
	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp * 1000)
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
		<div v-if="createdLink" class="quick-create__success">
			<div class="quick-create__result">
				<p class="quick-create__eyebrow">
					{{ t('shortlinks', 'Short link created') }}
				</p>
				<h2 id="quick-create-heading">
					{{ createdLink.title || createdLink.slug }}
				</h2>
				<div class="created-link-row">
					<a :href="createdLink.shortUrl" target="_blank" rel="noopener noreferrer">{{ createdLink.shortUrl }}</a>
					<NcButton :aria-label="t('shortlinks', 'Copy link')" :title="t('shortlinks', 'Copy link')" @click="copyShortUrl">
						<template #icon>
							<NcIconSvgWrapper :path="mdiContentCopy" />
						</template>
					</NcButton>
				</div>

				<div v-if="organizationDetails.length || accessDetails.length" class="created-link-settings">
					<section v-if="organizationDetails.length">
						<h3>{{ t('shortlinks', 'Organization') }}</h3>
						<dl>
							<div v-for="detail in organizationDetails" :key="detail.label">
								<dt>{{ detail.label }}</dt><dd>{{ detail.value }}</dd>
							</div>
						</dl>
					</section>
					<section v-if="accessDetails.length">
						<h3>{{ t('shortlinks', 'Access settings') }}</h3>
						<dl>
							<div v-for="detail in accessDetails" :key="detail.label">
								<dt>{{ detail.label }}</dt><dd>{{ detail.value }}</dd>
							</div>
						</dl>
					</section>
				</div>

				<NcButton variant="secondary" @click="createAnother">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>
					{{ t('shortlinks', 'Create another short link') }}
				</NcButton>
			</div>

			<aside class="quick-create__qr" :aria-label="t('shortlinks', 'QR code')">
				<img :src="api.qrUrl(createdLink.id, 'svg')"
					:alt="t('shortlinks', 'QR code for {title}', { title: createdLink.title || createdLink.slug })">
				<NcButton @click="copyQrAsSvg">
					<template #icon>
						<NcIconSvgWrapper :path="mdiContentCopy" />
					</template>
					{{ t('shortlinks', 'Copy QR code as SVG') }}
				</NcButton>
				<NcButton :href="api.qrUrl(createdLink.id, 'svg')"
					:download="`${createdLink.slug}-qr.svg`">
					<template #icon>
						<NcIconSvgWrapper :path="mdiDownload" />
					</template>
					{{ t('shortlinks', 'Download QR code') }}
				</NcButton>
			</aside>
		</div>

		<template v-else>
			<div class="quick-create__intro">
				<h2 id="quick-create-heading">
					{{ t('shortlinks', 'Create a short link') }}
				</h2>
				<p>{{ t('shortlinks', 'Paste a long URL and share a clean, memorable link in seconds.') }}</p>
			</div>
			<form @submit.prevent="submit">
				<div class="quick-create__url-row">
					<LinkPreviewEditor :url="draft.targetUrl"
						:title="draft.title"
						:valid="urlValid"
						:loading="metadata.loading.value"
						:thumbnail-src="metadata.thumbnailSrc.value"
						:url-error="targetError"
						:url-hint="t('shortlinks', 'Paste the full address you want to shorten.')"
						@update:url="draft.targetUrl = $event"
						@update:title="draft.title = $event"
						@title-edited="metadata.markTitleEdited" />
					<NcButton type="submit" variant="primary" :disabled="!canCreate">
						{{ saving ? t('shortlinks', 'Creating…') : t('shortlinks', 'Create') }}
					</NcButton>
				</div>

				<div class="quick-create__lower">
					<div class="quick-create__preview" :class="{ 'quick-create__preview--editing': editingAlias }">
						<span class="preview-label">{{ t('shortlinks', 'Your short link') }}</span>
						<div v-if="editingAlias" class="preview-editor">
							<span>{{ shortUrlParts.before }}</span>
							<NcTextField :model-value="draft.slug"
								:label="t('shortlinks', 'Alias')"
								:error="alias.state.value === 'invalid' || alias.state.value === 'unavailable'"
								:success="alias.state.value === 'available'"
								@update:model-value="setAlias" />
							<span>{{ shortUrlParts.after }}</span>
						</div>
						<button v-else
							type="button"
							class="preview-value"
							:aria-label="t('shortlinks', 'Edit alias')"
							@click="editingAlias = true">
							<span>{{ shortUrlParts.before }}</span><mark>{{ draft.slug || '…' }}</mark><span>{{ shortUrlParts.after }}</span><NcIconSvgWrapper class="preview-pencil" :path="mdiPencilOutline" :size="18" />
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
						<label class="select-field"><span>{{ t('shortlinks', 'Redirect type') }}</span><select v-model="draft.redirectStatus"><option v-for="status in redirectStatuses" :key="status" :value="status">{{ status }}{{ redirectStatusHints[status] ? ` — ${t('shortlinks', redirectStatusHints[status])}` : '' }}</option></select><small v-if="activeRedirectHint">{{ t('shortlinks', activeRedirectHint) }}</small></label>
						<NcTextField v-if="draft.accessMode === 'password'"
							v-model="draft.password"
							type="password"
							:label="t('shortlinks', 'Password')" />
					</div>
					<div v-else class="settings-grid settings-grid--more">
						<LinkAppearanceFields v-model:thumbnail-path="draft.thumbnailPath"
							v-model:media-path="draft.mediaPath"
							v-model:color="draft.color"
							class="quick-create__appearance"
							:thumbnail-src="metadata.thumbnailSrc.value" />
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
		</template>
	</section>
</template>

<style scoped>
.quick-create {
	inline-size: 100%;
	padding: clamp(8px, 1.5vw, 16px);
	border: 1px solid var(--color-primary-element-light);
	border-radius: var(--border-radius-large);
	background: linear-gradient(135deg, var(--color-primary-element-light-hover), var(--color-main-background) 72%);
	box-shadow: 0 4px 18px color-mix(in srgb, var(--color-box-shadow) 70%, transparent);
}

.quick-create__intro h2,
.quick-create__intro p {
	margin: 0;
}

.quick-create__success {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
	align-items: start;
	gap: clamp(24px, 5vw, 56px);
}

.quick-create__result {
	display: grid;
	justify-items: start;
	min-inline-size: 0;
	gap: calc(var(--default-grid-baseline) * 3);
}

.quick-create__result h2,
.quick-create__eyebrow,
.created-link-settings h3,
.created-link-settings dl,
.created-link-settings dd {
	margin: 0;
}

.quick-create__result h2 {
	font-size: clamp(1.5rem, 3vw, 2rem);
}

.quick-create__eyebrow {
	color: var(--color-success-text);
	font-weight: 600;
}

.created-link-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	inline-size: 100%;
	gap: calc(var(--default-grid-baseline) * 2);
}

.created-link-row a {
	min-inline-size: 0;
	color: var(--color-primary-element);
	font-size: 1.05rem;
	font-weight: 600;
	overflow-wrap: anywhere;
}

.created-link-settings {
	display: grid;
	inline-size: 100%;
	gap: calc(var(--default-grid-baseline) * 3);
	padding-block: calc(var(--default-grid-baseline) * 3);
	border-block: 1px solid var(--color-border);
}

.created-link-settings section,
.created-link-settings dl {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 2);
}

.created-link-settings h3 {
	font-size: 1rem;
}

.created-link-settings dl > div {
	display: grid;
	grid-template-columns: minmax(100px, .35fr) minmax(0, 1fr);
	gap: calc(var(--default-grid-baseline) * 2);
}

.created-link-settings dt {
	color: var(--color-text-maxcontrast);
}

.created-link-settings dd {
	overflow-wrap: anywhere;
}

.quick-create__qr {
	display: grid;
	gap: calc(var(--default-grid-baseline) * 2);
}

.quick-create__qr img {
	inline-size: 100%;
	aspect-ratio: 1;
	padding: calc(var(--default-grid-baseline) * 2);
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius-large);
	background: white;
}

.quick-create__intro h2 {
	font-size: 1.35rem;
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
	gap: calc(var(--default-grid-baseline) * 3);
	margin-block-start: calc(var(--default-grid-baseline) * 3);
}

.quick-create__url-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 3);
}

.quick-create__url-row > :first-child { min-inline-size: 0; }

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

.settings-grid--more > :first-child,
.quick-create__appearance {
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

.select-field small {
	color: var(--color-text-maxcontrast);
	font-size: .8rem;
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
	.settings-grid,
	.quick-create__success {
		grid-template-columns: 1fr;
	}

	.quick-create__qr {
		inline-size: min(100%, 320px);
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
