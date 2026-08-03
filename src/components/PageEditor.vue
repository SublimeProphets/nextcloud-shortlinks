<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { mdiAccountOutline, mdiAlignHorizontalCenter, mdiArrowLeft, mdiBookOpenPageVariantOutline, mdiCheck, mdiCircleOutline, mdiClose, mdiCloudOutline, mdiContentSaveOutline, mdiCreationOutline, mdiEyeOutline, mdiFileMultipleOutline, mdiFilePlusOutline, mdiFolderOutline, mdiFormatAlignLeft, mdiFormatFont, mdiFormatListBulleted, mdiLinkVariant, mdiLockOutline, mdiMagnify, mdiPageLayoutFooter, mdiPageLayoutHeader, mdiPaletteOutline, mdiResize, mdiShapeOutline, mdiTagOutline } from '@mdi/js'
import { FilePickerClosed, FilePickerType, getFilePickerBuilder, showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcColorPicker from '@nextcloud/vue/components/NcColorPicker'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import { folderIconPath } from '../folderIcons'
import { defaultPageTheme, pageFonts, pageThemes, themeValues } from '../pageThemes'
import type { Folder, LinkPage, LinkPageDraft, PageAccessMode, PageContact, PageFooterOptions, PageGrouping, PageHeaderOptions, PageLayout, PageThemePreset, ShortLink, Tag } from '../types'
import PagePreview from './PagePreview.vue'

type EditorTab = 'general' | 'content' | 'design'
const props = withDefaults(defineProps<{ page?: LinkPage; folders: Folder[]; tags: Tag[]; prefillFolderId?: number | null; prefillTagIds?: number[] }>(), { page: undefined, prefillFolderId: null, prefillTagIds: () => [] })
const emit = defineEmits<{ close: []; save: [draft: LinkPageDraft] }>()
const defaultFields = ['title', 'thumbnail', 'media', 'domain']
const defaultHeader: PageHeaderOptions = { brand: true, mark: true, title: true, lead: true, owner: true, compact: false, alignment: 'center' }
const defaultFooter: PageFooterOptions = { enabled: true, brand: true, updated: true, attribution: t('shortlinks', 'Shared securely with Nextcloud Shortlinks'), linkIds: [] }
const draft = reactive<LinkPageDraft>({
	slug: props.page?.slug ?? '',
	title: props.page?.title ?? '',
	lead: props.page?.lead ?? '',
	accessMode: props.page?.accessMode ?? 'private',
	password: '',
	startsAt: props.page?.startsAt ?? null,
	expiresAt: props.page?.expiresAt ?? null,
	folderIds: props.page?.folderIds ?? (props.prefillFolderId ? [props.prefillFolderId] : []),
	tagIds: props.page?.tagIds ?? [...props.prefillTagIds],
	linkIds: props.page?.linkIds ?? [],
	filePaths: props.page?.filePaths ? [...props.page.filePaths] : [],
	contacts: props.page?.contacts ? props.page.contacts.map(contact => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })) : [],
	userIds: props.page?.userIds ?? [],
	groupIds: props.page?.groupIds ?? [],
	layout: props.page?.layout ?? 'cards',
	grouping: props.page?.grouping ?? 'none',
	visibleFields: props.page?.visibleFields?.length ? [...props.page.visibleFields] : [...defaultFields],
	theme: { ...defaultPageTheme, ...(props.page?.theme ?? {}) },
	header: { ...defaultHeader, ...(props.page?.header ?? {}) },
	footer: { ...defaultFooter, ...(props.page?.footer ?? {}), linkIds: [...(props.page?.footer?.linkIds ?? [])] },
	active: props.page?.active ?? true,
	version: props.page?.version,
})
const tab = ref<EditorTab>('general')
const links = ref<ShortLink[]>([])
const loadingLinks = ref(false)
const linkSearch = ref('')
const footerLinkSearch = ref('')
const contactQuery = ref('')
const contactResults = ref<PageContact[]>([])
const contactSearchLoading = ref(false)
const contactSearchComplete = ref(false)
const contactsEnabled = ref<boolean | null>(null)
const aliasEdited = ref(Boolean(props.page))
const palette = ['#0082c9', '#00679e', '#2d7d46', '#e6a100', '#d52b1e', '#5b5fc7', '#8c42ab', '#008a9a']
const accessModes: Array<{ id: PageAccessMode; label: string; description: string }> = [
	{ id: 'private', label: 'Private', description: 'Only you can open this page.' },
	{ id: 'public', label: 'Public', description: 'Anyone with the address can open it.' },
	{ id: 'password', label: 'Password protected', description: 'Visitors enter a shared password.' },
	{ id: 'restricted', label: 'Selected users and groups', description: 'Only selected Nextcloud accounts can open it.' },
]
const layouts: Array<{ id: PageLayout; label: string; description: string }> = [
	{ id: 'cards', label: 'Cards', description: 'Rich cards in a responsive grid.' }, { id: 'spaced', label: 'Spaced list', description: 'Comfortable single-column rows.' },
	{ id: 'compact', label: 'Compact list', description: 'More links in less space.' }, { id: 'tiles', label: 'Tiles', description: 'Visual square-like tiles.' },
]
const groupings: Array<{ id: PageGrouping; label: string; icon: string }> = [
	{ id: 'none', label: 'No grouping', icon: mdiCircleOutline },
	{ id: 'folder', label: 'Folder', icon: mdiFolderOutline },
	{ id: 'tag', label: 'Tag', icon: mdiTagOutline },
]
const themeIcons: Record<PageThemePreset, string> = {
	nextcloud: mdiCloudOutline,
	neutral: mdiCircleOutline,
	modern: mdiCreationOutline,
	editorial: mdiBookOpenPageVariantOutline,
}
const headerAlignments = [
	{ id: 'center' as const, label: 'Centered', icon: mdiAlignHorizontalCenter },
	{ id: 'left' as const, label: 'Left aligned', icon: mdiFormatAlignLeft },
]
const fieldOptions = [
	{ id: 'title', label: 'Title' }, { id: 'description', label: 'Description' }, { id: 'thumbnail', label: 'Thumbnail' }, { id: 'media', label: 'Decorative media' },
	{ id: 'domain', label: 'Destination domain' }, { id: 'shortUrl', label: 'Short URL' }, { id: 'clicks', label: 'Click count' }, { id: 'folder', label: 'Folder' }, { id: 'tags', label: 'Tags' },
]
const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: value => { draft.startsAt = toTimestamp(value) } })
const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: value => { draft.expiresAt = toTimestamp(value) } })
const usersText = computed({ get: () => draft.userIds.join(', '), set: value => { draft.userIds = splitList(value) } })
const groupsText = computed({ get: () => draft.groupIds.join(', '), set: value => { draft.groupIds = splitList(value) } })
const canSave = computed(() => draft.title.trim().length > 0 && (draft.accessMode !== 'password' || draft.password.length >= 8 || Boolean(props.page?.passwordProtected)) && (draft.accessMode !== 'restricted' || draft.userIds.length + draft.groupIds.length > 0))
const filteredLinks = computed(() => filterLinks(linkSearch.value))
const filteredFooterLinks = computed(() => filterLinks(footerLinkSearch.value))

watch(() => draft.title, value => { if (!aliasEdited.value) draft.slug = slugify(value) })
onMounted(loadLinks)

async function loadLinks() { loadingLinks.value = true; try { links.value = (await api.listLinks({ system: 'all', page: 1, perPage: 200 })).items } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { loadingLinks.value = false } }
function filterLinks(query: string): ShortLink[] {
	const needle = query.trim().toLocaleLowerCase()
	if (!needle) return links.value
	return links.value.filter(link => `${link.title} ${link.slug} ${link.targetUrl}`.toLocaleLowerCase().includes(needle))
}
function toggleId(key: 'folderIds' | 'tagIds' | 'linkIds', id: number) { draft[key] = draft[key].includes(id) ? draft[key].filter(value => value !== id) : [...draft[key], id] }
function toggleFooterLink(id: number) { draft.footer.linkIds = draft.footer.linkIds.includes(id) ? draft.footer.linkIds.filter(value => value !== id) : [...draft.footer.linkIds, id] }
function applyTheme(preset: PageThemePreset) {
	const selected = pageThemes.find(theme => theme.preset === preset) ?? pageThemes[0]!
	Object.assign(draft.theme, themeValues(selected))
}
function toggleField(id: string) { draft.visibleFields = draft.visibleFields.includes(id) ? draft.visibleFields.filter(value => value !== id) : [...draft.visibleFields, id] }
function splitList(value: string): string[] { return [...new Set(value.split(',').map(item => item.trim()).filter(Boolean))] }
function slugify(value: string): string { return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) }
function setSlug(value: string | number) { aliasEdited.value = true; draft.slug = String(value).toLowerCase().replace(/[^a-z0-9_-]/g, '-') }
function toLocal(timestamp: number | null): string { if (timestamp === null) return ''; const date = new Date(timestamp * 1000); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) }
function toTimestamp(value: string): number | null { if (!value) return null; const time = new Date(value).getTime(); return Number.isFinite(time) ? Math.floor(time / 1000) : null }
function fileName(path: string): string { return path.split('/').filter(Boolean).at(-1) || path }
async function pickFiles() {
	try {
		const picker = getFilePickerBuilder(t('shortlinks', 'Choose files for this page'))
			.setMultiSelect(true)
			.allowDirectories(false)
			.setType(FilePickerType.Choose)
			.build()
		const paths = await picker.pick()
		draft.filePaths = [...new Set([...draft.filePaths, ...paths])]
	} catch (error) {
		if (!(error instanceof FilePickerClosed)) throw error
	}
}
function removeFile(path: string) { draft.filePaths = draft.filePaths.filter(value => value !== path) }
function contactSelected(contact: PageContact): boolean { return draft.contacts.some(value => value.key === contact.key) }
function toggleContact(contact: PageContact) {
	draft.contacts = contactSelected(contact) ? draft.contacts.filter(value => value.key !== contact.key) : [...draft.contacts, { ...contact, emails: [...contact.emails], phones: [...contact.phones] }]
}
async function searchContacts() {
	if (contactQuery.value.trim().length < 2) return
	contactSearchLoading.value = true
	contactSearchComplete.value = false
	try {
		const result = await api.searchPageContacts(contactQuery.value.trim())
		contactsEnabled.value = result.enabled
		contactResults.value = result.items
		contactSearchComplete.value = true
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		contactSearchLoading.value = false
	}
}
function submit() { if (!canSave.value) return; emit('save', { ...draft, folderIds: [...draft.folderIds], tagIds: [...draft.tagIds], linkIds: [...draft.linkIds], filePaths: [...draft.filePaths], contacts: draft.contacts.map(contact => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })), userIds: [...draft.userIds], groupIds: [...draft.groupIds], visibleFields: [...draft.visibleFields], theme: { ...draft.theme }, header: { ...draft.header }, footer: { ...draft.footer, linkIds: [...draft.footer.linkIds] } }) }
</script>

<template>
	<section class="page-editor" aria-labelledby="page-editor-title">
		<header class="page-editor__toolbar">
			<NcButton variant="tertiary" :aria-label="t('shortlinks', 'Back')" @click="emit('close')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiArrowLeft" />
				</template>
			</NcButton><div>
				<h1 id="page-editor-title">
					{{ page ? t('shortlinks', 'Edit page') : t('shortlinks', 'New page') }}
				</h1><p>{{ t('shortlinks', 'Build a focused, shareable collection of short links.') }}</p>
			</div><NcButton variant="primary" :disabled="!canSave" @click="submit">
				<template #icon>
					<NcIconSvgWrapper :path="mdiContentSaveOutline" />
				</template>{{ t('shortlinks', 'Save page') }}
			</NcButton>
		</header>
		<div class="page-editor__workspace">
			<div class="page-editor__controls">
				<nav class="editor-tabs" role="tablist">
					<button v-for="item in ([{ id: 'general', label: 'General', icon: mdiLockOutline }, { id: 'content', label: 'Content', icon: mdiFormatListBulleted }, { id: 'design', label: 'Design', icon: mdiPaletteOutline }] as const)"
						:key="item.id"
						role="tab"
						:aria-selected="tab === item.id"
						:class="{ active: tab === item.id }"
						@click="tab = item.id">
						<NcIconSvgWrapper :path="item.icon" :size="18" />{{ t('shortlinks', item.label) }}
					</button>
				</nav>
				<div v-if="tab === 'general'" class="editor-panel">
					<section>
						<h2>{{ t('shortlinks', 'Identity') }}</h2><NcTextField v-model="draft.title" :label="t('shortlinks', 'Page title')" required /><NcTextArea v-model="draft.lead" :label="t('shortlinks', 'Lead text (optional)')" /><NcTextField :model-value="draft.slug"
							:label="t('shortlinks', 'Page address')"
							:helper-text="`…/p/${draft.slug || 'page'}`"
							@update:model-value="setSlug" />
					</section><section>
						<h2>{{ t('shortlinks', 'Visibility and access') }}</h2><div class="choice-grid">
							<button v-for="mode in accessModes"
								:key="mode.id"
								type="button"
								:class="{ selected: draft.accessMode === mode.id }"
								@click="draft.accessMode = mode.id">
								<NcIconSvgWrapper :path="draft.accessMode === mode.id ? mdiCheck : mdiLockOutline" /><span><strong>{{ t('shortlinks', mode.label) }}</strong><small>{{ t('shortlinks', mode.description) }}</small></span>
							</button>
						</div><NcTextField v-if="draft.accessMode === 'password'"
							v-model="draft.password"
							type="password"
							:label="t('shortlinks', page?.passwordProtected ? 'New password (optional)' : 'Password')"
							:helper-text="t('shortlinks', 'Use at least 8 characters.')" /><template v-if="draft.accessMode === 'restricted'">
								<NcTextField v-model="usersText" :label="t('shortlinks', 'Users')" :helper-text="t('shortlinks', 'Separate account names with commas.')" /><NcTextField v-model="groupsText" :label="t('shortlinks', 'Groups')" :helper-text="t('shortlinks', 'Separate group names with commas.')" />
							</template><div class="date-grid">
							<label>{{ t('shortlinks', 'Available from') }}<input v-model="startsAtLocal" type="datetime-local"></label><label>{{ t('shortlinks', 'Expires at') }}<input v-model="expiresAtLocal" type="datetime-local"></label>
						</div><NcCheckboxRadioSwitch v-model="draft.active" type="switch">
							{{ t('shortlinks', 'Page is active') }}
						</NcCheckboxRadioSwitch>
					</section>
				</div>

				<div v-else-if="tab === 'content'" class="editor-panel">
					<section>
						<h2>{{ t('shortlinks', 'Automatic sources') }}</h2><p>{{ t('shortlinks', 'New matching short links appear on the page automatically.') }}</p><h3><NcIconSvgWrapper :path="mdiShapeOutline" :size="20" />{{ t('shortlinks', 'Folders') }}</h3><div class="source-list">
							<label v-for="folder in folders" :key="folder.id"><input type="checkbox" :checked="draft.folderIds.includes(folder.id)" @change="toggleId('folderIds', folder.id)"><NcIconSvgWrapper :path="folderIconPath(folder.icon)" :size="20" /><span>{{ folder.name }}</span><small>{{ folder.count }}</small></label><p v-if="!folders.length">
								{{ t('shortlinks', 'No folders yet') }}
							</p>
						</div><h3>{{ t('shortlinks', 'Tags') }}</h3><div class="source-list">
							<label v-for="tag in tags" :key="tag.id"><input type="checkbox" :checked="draft.tagIds.includes(tag.id)" @change="toggleId('tagIds', tag.id)"><i :style="{ backgroundColor: tag.color || 'var(--color-primary-element)' }" /><span>{{ tag.name }}</span><small>{{ tag.count }}</small></label><p v-if="!tags.length">
								{{ t('shortlinks', 'No tags yet') }}
							</p>
						</div>
					</section><section>
						<h2>{{ t('shortlinks', 'Individual links') }}</h2><p>{{ t('shortlinks', 'Pin individual links in addition to automatic sources.') }}</p><div class="source-list source-list--links">
							<div class="source-list__search">
								<NcTextField v-model="linkSearch" :label="t('shortlinks', 'Search links')">
									<template #icon>
										<NcIconSvgWrapper :path="mdiMagnify" />
									</template>
								</NcTextField>
							</div><label v-for="link in filteredLinks" :key="link.id"><input type="checkbox" :checked="draft.linkIds.includes(link.id)" @change="toggleId('linkIds', link.id)"><span><strong>{{ link.title || link.slug }}</strong><small>…/{{ link.slug }}</small></span></label><p v-if="loadingLinks">
								{{ t('shortlinks', 'Loading links…') }}
							</p><p v-else-if="linkSearch && !filteredLinks.length" class="source-list__empty">
								{{ t('shortlinks', 'No links match your search.') }}
							</p>
						</div>
					</section><section>
						<div class="section-heading">
							<div><h2><NcIconSvgWrapper :path="mdiFileMultipleOutline" :size="22" />{{ t('shortlinks', 'Files') }}</h2><p>{{ t('shortlinks', 'Add files from your Nextcloud Files. Visitors can open or download the selected files from the Page.') }}</p></div><NcButton @click="pickFiles">
								<template #icon>
									<NcIconSvgWrapper :path="mdiFilePlusOutline" />
								</template>{{ t('shortlinks', 'Select files') }}
							</NcButton>
						</div>
						<div v-if="draft.filePaths.length" class="selected-content-list">
							<div v-for="path in draft.filePaths" :key="path" class="selected-content-item">
								<NcIconSvgWrapper :path="mdiFileMultipleOutline" :size="21" /><span><strong>{{ fileName(path) }}</strong><small>{{ path }}</small></span><NcButton variant="tertiary" :aria-label="t('shortlinks', 'Remove file')" @click="removeFile(path)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiClose" />
									</template>
								</NcButton>
							</div>
						</div><p v-else class="content-empty">
							{{ t('shortlinks', 'No files selected') }}
						</p>
					</section><section>
						<h2><NcIconSvgWrapper :path="mdiAccountOutline" :size="22" />{{ t('shortlinks', 'Contacts') }}</h2><p>{{ t('shortlinks', 'Find contacts in your Nextcloud address books and add their selected contact details to this Page.') }}</p><p class="privacy-note">
							{{ t('shortlinks', 'Only add contacts whose details may be shared with everyone who can access this Page.') }}
						</p><div class="contact-search">
							<NcTextField v-model="contactQuery"
								:label="t('shortlinks', 'Search contacts')"
								:helper-text="t('shortlinks', 'Enter at least two characters.')"
								@keydown.enter.prevent="searchContacts" /><NcButton :disabled="contactQuery.trim().length < 2 || contactSearchLoading" @click="searchContacts">
									<template #icon>
										<NcIconSvgWrapper :path="mdiMagnify" />
									</template>{{ contactSearchLoading ? t('shortlinks', 'Searching…') : t('shortlinks', 'Search') }}
								</NcButton>
						</div><p v-if="contactsEnabled === false" class="content-empty">
							{{ t('shortlinks', 'No Nextcloud address book is currently available.') }}
						</p><p v-else-if="contactSearchComplete && !contactResults.length" class="content-empty">
							{{ t('shortlinks', 'No matching contacts found.') }}
						</p><div v-if="contactResults.length" class="source-list source-list--contacts">
							<label v-for="contact in contactResults" :key="contact.key"><input type="checkbox" :checked="contactSelected(contact)" @change="toggleContact(contact)"><NcIconSvgWrapper :path="mdiAccountOutline" :size="22" /><span><strong>{{ contact.name }}</strong><small>{{ contact.organization || contact.emails[0] || contact.phones[0] || t('shortlinks', 'No additional details') }}</small></span></label>
						</div><div v-if="draft.contacts.length" class="selected-content-list">
							<div v-for="contact in draft.contacts" :key="contact.key" class="selected-content-item">
								<NcIconSvgWrapper :path="mdiAccountOutline" :size="22" /><span><strong>{{ contact.name }}</strong><small>{{ [...contact.emails, ...contact.phones].join(' · ') || contact.organization }}</small></span><NcButton variant="tertiary" :aria-label="t('shortlinks', 'Remove contact')" @click="toggleContact(contact)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiClose" />
									</template>
								</NcButton>
							</div>
						</div>
					</section>
				</div>

				<div v-else class="editor-panel">
					<section>
						<h2>{{ t('shortlinks', 'Layout') }}</h2><div class="choice-grid layout-choices">
							<button v-for="layout in layouts"
								:key="layout.id"
								type="button"
								:class="{ selected: draft.layout === layout.id }"
								@click="draft.layout = layout.id">
								<span class="layout-glyph" :class="`layout-glyph--${layout.id}`"><i v-for="n in 4" :key="n" /></span><span><strong>{{ t('shortlinks', layout.label) }}</strong><small>{{ t('shortlinks', layout.description) }}</small></span>
							</button>
						</div>
					</section><section>
						<h2>{{ t('shortlinks', 'Theme') }}</h2><p>{{ t('shortlinks', 'Start with a visual direction, then fine-tune it below.') }}</p><div class="theme-slider" role="group" :aria-label="t('shortlinks', 'Theme')">
							<button v-for="theme in pageThemes"
								:key="theme.preset"
								type="button"
								:class="{ selected: draft.theme.preset === theme.preset }"
								:aria-pressed="draft.theme.preset === theme.preset"
								@click="applyTheme(theme.preset)">
								<span class="theme-card__preview" :style="{ '--theme-bg': theme.background, '--theme-surface': theme.surface, '--theme-primary': theme.primary, '--theme-text': theme.text }"><i /><i /><i /></span><span class="theme-card__copy"><strong><NcIconSvgWrapper :path="themeIcons[theme.preset]" :size="18" />{{ t('shortlinks', theme.label) }}</strong><small>{{ t('shortlinks', theme.description) }}</small></span>
							</button>
						</div>
					</section><section>
						<h2>{{ t('shortlinks', 'Grouping') }}</h2><p>{{ t('shortlinks', 'Group links by') }}</p><div class="horizontal-radio" role="radiogroup" :aria-label="t('shortlinks', 'Group links by')">
							<label v-for="grouping in groupings" :key="grouping.id" :class="{ selected: draft.grouping === grouping.id }"><input v-model="draft.grouping" type="radio" :value="grouping.id"><NcIconSvgWrapper :path="grouping.icon" :size="20" /><span>{{ t('shortlinks', grouping.label) }}</span></label>
						</div>
					</section><section>
						<h2>{{ t('shortlinks', 'Visible information') }}</h2><div class="field-toggles">
							<NcCheckboxRadioSwitch v-for="field in fieldOptions"
								:key="field.id"
								:model-value="draft.visibleFields.includes(field.id)"
								type="switch"
								@update:model-value="toggleField(field.id)">
								{{ t('shortlinks', field.label) }}
							</NcCheckboxRadioSwitch>
						</div>
					</section><section>
						<h2>{{ t('shortlinks', 'Customizing') }}</h2><div class="customizing-subsection">
							<h3>{{ t('shortlinks', 'Colors') }}</h3><div class="color-fields">
								<label v-for="item in ([{ key: 'primary', label: 'Primary color' }, { key: 'background', label: 'Background' }, { key: 'surface', label: 'Card background' }, { key: 'text', label: 'Text color' }] as const)" :key="item.key"><span>{{ t('shortlinks', item.label) }}</span><NcColorPicker v-model="draft.theme[item.key]" :palette="palette" advanced-fields><template #default="{ attrs }"><NcButton v-bind="attrs"><template #icon><i class="color-dot" :style="{ backgroundColor: draft.theme[item.key] }" /></template>{{ draft.theme[item.key] }}</NcButton></template></NcColorPicker></label>
							</div>
						</div><div class="customizing-subsection">
							<h3><NcIconSvgWrapper :path="mdiFormatFont" :size="20" />{{ t('shortlinks', 'Fonts') }}</h3><label class="select-field">{{ t('shortlinks', 'Font family') }}<select v-model="draft.theme.font" :style="{ fontFamily: pageFonts.find(font => font.id === draft.theme.font)?.stack }"><option v-for="font in pageFonts"
								:key="font.id"
								:value="font.id"
								:style="{ fontFamily: font.stack }">{{ font.label }}</option></select></label>
						</div><div class="customizing-subsection">
							<h3><NcIconSvgWrapper :path="mdiResize" :size="20" />{{ t('shortlinks', 'Scaling') }}</h3><div class="range-fields">
								<label><span>{{ t('shortlinks', 'Base font size') }} <output>{{ draft.theme.baseSize }} px</output></span><input v-model.number="draft.theme.baseSize"
									type="range"
									min="14"
									max="20"
									step="1"></label><label><span>{{ t('shortlinks', 'Overall scale') }} <output>{{ draft.theme.scale }}%</output></span><input v-model.number="draft.theme.scale"
										type="range"
										min="85"
										max="125"
										step="5"></label>
							</div>
						</div>
					</section><section>
						<h2><NcIconSvgWrapper :path="mdiPageLayoutHeader" :size="22" />{{ t('shortlinks', 'Header') }}</h2><p>{{ t('shortlinks', 'Choose the identity and information shown above your content.') }}</p><div class="field-toggles">
							<NcCheckboxRadioSwitch v-model="draft.header.mark" type="switch">
								{{ t('shortlinks', 'Show page mark') }}
							</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-model="draft.header.brand" type="switch">
								{{ t('shortlinks', 'Show brand label') }}
							</NcCheckboxRadioSwitch>
							<NcCheckboxRadioSwitch v-model="draft.header.title" type="switch">
								{{ t('shortlinks', 'Show page title') }}
							</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-model="draft.header.lead" type="switch">
								{{ t('shortlinks', 'Show lead text') }}
							</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-model="draft.header.owner" type="switch">
								{{ t('shortlinks', 'Show owner') }}
							</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-model="draft.header.compact" type="switch">
								{{ t('shortlinks', 'Use compact header') }}
							</NcCheckboxRadioSwitch>
						</div><div class="horizontal-radio horizontal-radio--small" role="radiogroup" :aria-label="t('shortlinks', 'Header alignment')">
							<label v-for="alignment in headerAlignments" :key="alignment.id" :class="{ selected: draft.header.alignment === alignment.id }"><input v-model="draft.header.alignment" type="radio" :value="alignment.id"><NcIconSvgWrapper :path="alignment.icon" :size="18" /><span>{{ t('shortlinks', alignment.label) }}</span></label>
						</div>
					</section><section>
						<h2><NcIconSvgWrapper :path="mdiPageLayoutFooter" :size="22" />{{ t('shortlinks', 'Footer') }}</h2><p>{{ t('shortlinks', 'Add attribution, freshness information, and a centered set of useful links.') }}</p><div class="field-toggles">
							<NcCheckboxRadioSwitch v-model="draft.footer.enabled" type="switch">
								{{ t('shortlinks', 'Show footer') }}
							</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-if="draft.footer.enabled" v-model="draft.footer.brand" type="switch">
								{{ t('shortlinks', 'Show Shortlinks attribution') }}
							</NcCheckboxRadioSwitch><NcCheckboxRadioSwitch v-if="draft.footer.enabled" v-model="draft.footer.updated" type="switch">
								{{ t('shortlinks', 'Show updated date') }}
							</NcCheckboxRadioSwitch>
						</div><template v-if="draft.footer.enabled">
							<NcTextField v-if="draft.footer.brand" v-model="draft.footer.attribution" :label="t('shortlinks', 'Attribution text')" /><div class="footer-links-heading">
								<h3><NcIconSvgWrapper :path="mdiLinkVariant" :size="20" />{{ t('shortlinks', 'Footer links') }}</h3><p>{{ t('shortlinks', 'Choose links that appear centered in the footer.') }}</p>
							</div><div class="source-list source-list--links">
								<div class="source-list__search">
									<NcTextField v-model="footerLinkSearch" :label="t('shortlinks', 'Search links')">
										<template #icon>
											<NcIconSvgWrapper :path="mdiMagnify" />
										</template>
									</NcTextField>
								</div><label v-for="link in filteredFooterLinks" :key="link.id"><input type="checkbox" :checked="draft.footer.linkIds.includes(link.id)" @change="toggleFooterLink(link.id)"><span><strong>{{ link.title || link.slug }}</strong><small>…/{{ link.slug }}</small></span></label><p v-if="loadingLinks">
									{{ t('shortlinks', 'Loading links…') }}
								</p><p v-else-if="footerLinkSearch && !filteredFooterLinks.length" class="source-list__empty">
									{{ t('shortlinks', 'No links match your search.') }}
								</p>
							</div>
						</template>
					</section>
				</div>
			</div>
			<aside class="page-editor__preview">
				<h2><NcIconSvgWrapper :path="mdiEyeOutline" :size="22" />{{ t('shortlinks', 'Live preview') }}</h2><PagePreview :draft="draft" :links="links" :folders="folders" />
			</aside>
		</div>
	</section>
</template>

<style scoped>
.page-editor{display:grid;min-block-size:100%;background:var(--color-main-background)}

.page-editor__toolbar{position:sticky;z-index:5;inset-block-start:0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:10px 16px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.page-editor__toolbar h1,.page-editor__toolbar p{margin:0}

.page-editor__toolbar h1{font-size:1.25rem}

.page-editor__toolbar p{color:var(--color-text-maxcontrast)}

.page-editor__workspace{display:grid;grid-template-columns:minmax(340px,560px) minmax(420px,1fr);min-block-size:0}

.page-editor__controls{border-inline-end:1px solid var(--color-border)}

.editor-tabs{position:sticky;z-index:4;inset-block-start:66px;display:flex;gap:4px;padding:10px 16px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.editor-tabs button{display:flex;align-items:center;justify-content:center;flex:1;gap:6px;min-block-size:40px;margin:0;padding:6px 10px;border:0;border-radius:var(--border-radius);background:transparent;color:var(--color-text-maxcontrast);font-weight:600;cursor:pointer}

.editor-tabs button.active{background:var(--color-primary-element-light);color:var(--color-primary-element-text)}

.editor-panel{display:grid;gap:28px;padding:20px}

.editor-panel section{display:grid;gap:12px;padding-block-end:24px;border-block-end:1px solid var(--color-border)}

.editor-panel h2,.editor-panel h3,.editor-panel p{margin:0}

.editor-panel h2,.editor-panel h3{display:flex;align-items:center;gap:6px}

.editor-panel h3{margin-block-start:8px}

.editor-panel p{color:var(--color-text-maxcontrast)}

.choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}

.choice-grid>button{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:start;gap:10px;min-block-size:84px;margin:0;padding:12px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background);color:inherit;text-align:start;cursor:pointer}

.choice-grid>button.selected{border-color:var(--color-primary-element);background:var(--color-primary-element-light)}

.choice-grid>button>span:last-child{display:grid;gap:4px}

.choice-grid small{color:var(--color-text-maxcontrast)}

.date-grid,.color-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}

.date-grid label,.select-field,.color-fields label{display:grid;gap:5px;font-weight:600}

.date-grid input,.select-field select{inline-size:100%;min-block-size:44px;margin:0}

.source-list{display:grid;max-block-size:260px;overflow:auto;border:1px solid var(--color-border);border-radius:var(--border-radius-large)}

.source-list__search{position:sticky;z-index:2;inset-block-start:0;padding:8px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.source-list__empty,.source-list>p{padding:14px;text-align:center}

.source-list>label{display:flex;align-items:center;gap:9px;min-block-size:44px;padding:8px 10px;border-block-end:1px solid var(--color-border);cursor:pointer}

.source-list>label:last-child{border:0}

.source-list>label:hover{background:var(--color-background-hover)}

.source-list input{inline-size:20px;block-size:20px;margin:0}

.source-list label>span{min-inline-size:0;flex:1}

.source-list label>small{color:var(--color-text-maxcontrast)}

.source-list i{inline-size:10px;block-size:10px;border-radius:50%}

.source-list--links label>span,.source-list--contacts label>span{display:grid}

.source-list--links strong,.source-list--links small,.source-list--contacts strong,.source-list--contacts small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.section-heading{display:flex;align-items:start;justify-content:space-between;gap:12px}

.section-heading>div{display:grid;gap:6px}

.selected-content-list{display:grid;gap:6px}

.selected-content-item{display:flex;align-items:center;gap:9px;min-block-size:48px;padding:6px 8px;border:1px solid var(--color-border);border-radius:var(--border-radius-large)}

.selected-content-item>span{display:grid;min-inline-size:0;flex:1}

.selected-content-item strong,.selected-content-item small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.selected-content-item small,.content-empty{color:var(--color-text-maxcontrast)}

.privacy-note{padding:10px 12px;border-inline-start:4px solid var(--color-primary-element);border-radius:var(--border-radius);background:var(--color-primary-element-light)}

.contact-search{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:8px}

.field-toggles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}

.color-dot{display:block;inline-size:24px;block-size:24px;border:1px solid var(--color-border);border-radius:50%}

.layout-choices>button{grid-template-columns:64px minmax(0,1fr)}

.layout-glyph{display:grid;grid-template-columns:repeat(2,1fr);gap:3px;inline-size:58px;block-size:48px}

.layout-glyph i{border-radius:3px;background:currentColor;opacity:.35}

.layout-glyph--spaced,.layout-glyph--compact{grid-template-columns:1fr}

.layout-glyph--compact{gap:1px}

.theme-slider{display:flex;gap:10px;padding-block-end:6px;overflow-x:auto;scroll-snap-type:inline proximity}

.theme-slider>button{display:grid;flex:0 0 210px;gap:10px;margin:0;padding:10px;border:2px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background);color:inherit;text-align:start;scroll-snap-align:start;cursor:pointer}

.theme-slider>button:hover{background:var(--color-background-hover)}

.theme-slider>button.selected{border-color:var(--color-primary-element);box-shadow:0 0 0 2px var(--color-primary-element-light)}

.theme-card__preview{display:grid;grid-template-columns:1.3fr 1fr;grid-template-rows:repeat(2,1fr);gap:6px;block-size:86px;padding:10px;border-radius:10px;background:var(--theme-bg);color:var(--theme-text)}

.theme-card__preview i{border-radius:6px;background:var(--theme-surface);box-shadow:0 2px 8px rgb(0 0 0 / 10%)}

.theme-card__preview i:first-child{grid-row:1/-1;border-block-start:5px solid var(--theme-primary)}

.theme-card__preview i:nth-child(3){background:color-mix(in srgb,var(--theme-primary) 65%,var(--theme-surface))}

.theme-card__copy{display:grid;gap:5px}

.theme-card__copy strong{display:flex;align-items:center;gap:5px}

.theme-card__copy small{color:var(--color-text-maxcontrast);line-height:1.35}

.horizontal-radio{display:flex;flex-wrap:wrap;gap:8px}

.horizontal-radio label{display:flex;align-items:center;justify-content:center;flex:1 1 120px;gap:7px;min-block-size:48px;padding:8px 12px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background);font-weight:600;cursor:pointer}

.horizontal-radio label:hover{background:var(--color-background-hover)}

.horizontal-radio label.selected{border-color:var(--color-primary-element);background:var(--color-primary-element-light)}

.horizontal-radio input{position:absolute;inline-size:1px;block-size:1px;opacity:0}

.horizontal-radio--small label{flex:0 1 160px;min-block-size:42px}

.customizing-subsection{display:grid;gap:10px;padding:14px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-background-hover)}

.customizing-subsection h3{margin-block-start:0}

.range-fields{display:grid;gap:14px}

.range-fields label{display:grid;gap:5px;font-weight:600}

.range-fields label>span{display:flex;justify-content:space-between;gap:10px}

.range-fields output{color:var(--color-text-maxcontrast);font-variant-numeric:tabular-nums}

.range-fields input{inline-size:100%;accent-color:var(--color-primary-element)}

.footer-links-heading{display:grid;gap:4px;margin-block-start:4px}

.page-editor__preview{position:sticky;inset-block-start:66px;align-self:start;display:grid;gap:12px;max-block-size:calc(100vh - 66px);padding:20px;overflow:auto;background:var(--color-background-hover)}

.page-editor__preview h2{display:flex;align-items:center;gap:8px;margin:0}
@media(max-width:1050px){.page-editor__workspace{grid-template-columns:1fr}.page-editor__controls{border:0}.page-editor__preview{position:static;max-block-size:none;border-block-start:1px solid var(--color-border)}}@media(max-width:600px){.page-editor__toolbar{grid-template-columns:auto minmax(0,1fr)}.page-editor__toolbar>button:last-child{grid-column:1/-1}.choice-grid,.date-grid,.color-fields,.field-toggles{grid-template-columns:1fr}.editor-tabs{inset-block-start:104px;overflow-x:auto}.editor-tabs button{min-inline-size:max-content}.theme-slider>button{flex-basis:188px}.horizontal-radio label{flex-basis:100%}}
</style>
