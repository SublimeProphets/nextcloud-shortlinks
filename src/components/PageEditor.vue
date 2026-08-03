<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { mdiAccountOutline, mdiAlignHorizontalCenter, mdiArrowLeft, mdiBackupRestore, mdiBookOpenPageVariantOutline, mdiCheck, mdiCircleOutline, mdiClose, mdiCloudOutline, mdiContentSaveOutline, mdiCreationOutline, mdiEyeOutline, mdiFileMultipleOutline, mdiFilePlusOutline, mdiFolderOutline, mdiFormatAlignLeft, mdiFormatFont, mdiFormatListBulleted, mdiHistory, mdiIdentifier, mdiLinkVariant, mdiLockOutline, mdiMagnify, mdiOpenInNew, mdiPageLayoutFooter, mdiPageLayoutHeader, mdiPaletteOutline, mdiResize, mdiShapeOutline, mdiTagOutline, mdiViewDashboardOutline } from '@mdi/js'
import { FilePickerClosed, FilePickerType, getFilePickerBuilder, showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcAppSidebar from '@nextcloud/vue/components/NcAppSidebar'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcColorPicker from '@nextcloud/vue/components/NcColorPicker'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcSelectUsers, { type NcSelectUsersModel } from '@nextcloud/vue/components/NcSelectUsers'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import { folderIconPath } from '../folderIcons'
import { defaultPageTheme, pageFonts, pageThemes, themeValues } from '../pageThemes'
import { defaultPageSectionOrder, movePageSection, normalizePageSectionOrder, pageSectionIds } from '../pageSections'
import type { Folder, LinkPage, LinkPageDraft, LinkPageVersion, LinkPageVersionDetail, PageAccessMode, PageContact, PageEditorTab, PageFooterOptions, PageGrouping, PageHeaderAlignment, PageHeaderOptions, PageLayout, PageSectionOrder, PageThemePreset, ShortLink, Tag } from '../types'
import PageEditorSection from './PageEditorSection.vue'
import PagePreview from './PagePreview.vue'

const props = withDefaults(defineProps<{ page?: LinkPage; folders: Folder[]; tags: Tag[]; prefillFolderId?: number | null; prefillTagIds?: number[]; singleSection?: boolean; autosaveEnabled?: boolean; autosaveDelay?: number }>(), { page: undefined, prefillFolderId: null, prefillTagIds: () => [], singleSection: true, autosaveEnabled: true, autosaveDelay: 10 })
const emit = defineEmits<{ close: []; saved: [page: LinkPage, closeAfter: boolean] }>()
const defaultFields = ['title', 'thumbnail', 'media', 'domain']
const defaultHeader: PageHeaderOptions = { brand: true, mark: true, title: true, lead: true, owner: true, compact: false, alignment: 'center' }
const defaultFooter: PageFooterOptions = { enabled: true, brand: true, updated: true, attribution: t('shortlinks', 'Shared securely with Nextcloud Shortlinks'), linkIds: [] }
const draft = reactive<LinkPageDraft>({
	slug: props.page?.slug ?? '',
	title: props.page?.title ?? '',
	lead: props.page?.lead ?? '',
	accessMode: props.page?.accessMode ?? 'private',
	password: '',
	allowEmbedding: props.page?.allowEmbedding ?? false,
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
	sectionOrder: normalizePageSectionOrder(props.page?.sectionOrder),
	active: props.page?.active ?? true,
	version: props.page?.version,
})
const persistedPage = ref<LinkPage | undefined>(props.page)
const saving = ref(false)
const saveStatus = ref<'saved' | 'dirty' | 'saving' | 'error'>(props.page ? 'saved' : 'dirty')
const historyOpen = ref(false)
const historyLoading = ref(false)
const history = ref<LinkPageVersion[]>([])
const historyPreview = ref<LinkPageVersionDetail | null>(null)
const restoringVersion = ref<LinkPageVersion | null>(null)
const tab = ref<PageEditorTab>('general')
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
const failedFilePreviews = ref(new Set<string>())
const previewChangedAt = ref((props.page?.updatedAt ?? Math.floor(Date.now() / 1000)) * 1000)
const clock = ref(Date.now())
const draggedSection = ref<{ tab: PageEditorTab; id: string } | null>(null)
const sectionDropTarget = ref<{ tab: PageEditorTab; id: string; position: 'before' | 'after' } | null>(null)
const openSections = reactive<Record<PageEditorTab, string[]>>({
	general: [draft.sectionOrder.general[0] ?? defaultPageSectionOrder().general[0]!],
	content: [draft.sectionOrder.content[0] ?? defaultPageSectionOrder().content[0]!],
	design: [draft.sectionOrder.design[0] ?? defaultPageSectionOrder().design[0]!],
})
const sectionMeta: Record<PageEditorTab, Record<string, { title: string; description: string; icon: string }>> = {
	general: {
		identity: { title: t('shortlinks', 'Identity'), description: t('shortlinks', 'Define the page name, introduction, and share address.'), icon: mdiIdentifier },
		access: { title: t('shortlinks', 'Visibility and access'), description: t('shortlinks', 'Choose who can open the page and when it is available.'), icon: mdiLockOutline },
	},
	content: {
		sources: { title: t('shortlinks', 'Automatic sources'), description: t('shortlinks', 'New matching short links appear on the page automatically.'), icon: mdiShapeOutline },
		links: { title: t('shortlinks', 'Individual links'), description: t('shortlinks', 'Pin individual links in addition to automatic sources.'), icon: mdiLinkVariant },
		files: { title: t('shortlinks', 'Files'), description: t('shortlinks', 'Add files from your Nextcloud Files for visitors to open or download.'), icon: mdiFileMultipleOutline },
		contacts: { title: t('shortlinks', 'Contacts'), description: t('shortlinks', 'Add selected details from your Nextcloud address books.'), icon: mdiAccountOutline },
	},
	design: {
		layout: { title: t('shortlinks', 'Layout'), description: t('shortlinks', 'Choose how links and content are arranged.'), icon: mdiViewDashboardOutline },
		theme: { title: t('shortlinks', 'Theme'), description: t('shortlinks', 'Start with a visual direction, then fine-tune it below.'), icon: mdiPaletteOutline },
		grouping: { title: t('shortlinks', 'Grouping'), description: t('shortlinks', 'Group links by folder or tag.'), icon: mdiShapeOutline },
		visible: { title: t('shortlinks', 'Visible information'), description: t('shortlinks', 'Choose which link details visitors can see.'), icon: mdiEyeOutline },
		customizing: { title: t('shortlinks', 'Customizing'), description: t('shortlinks', 'Fine-tune colors, typography, and scale.'), icon: mdiPaletteOutline },
		header: { title: t('shortlinks', 'Header'), description: t('shortlinks', 'Choose the identity and information shown above your content.'), icon: mdiPageLayoutHeader },
		footer: { title: t('shortlinks', 'Footer'), description: t('shortlinks', 'Add attribution, freshness information, and useful links.'), icon: mdiPageLayoutFooter },
	},
}
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
const principalLabels = reactive<Record<string, string>>({})
const principalMatches = ref<NcSelectUsersModel[]>([])
const principalSearchLoading = ref(false)
const principalSearchError = ref('')
const selectedPrincipals = computed<NcSelectUsersModel[]>(() => [
	...draft.userIds.map(id => principalOption('user', id)),
	...draft.groupIds.map(id => principalOption('group', id)),
])
const principalOptions = computed<NcSelectUsersModel[]>(() => {
	const options = new Map<string, NcSelectUsersModel>()
	for (const option of [...selectedPrincipals.value, ...principalMatches.value]) options.set(option.id, option)
	return [...options.values()]
})
const canSave = computed(() => draft.title.trim().length > 0 && (draft.accessMode !== 'password' || draft.password.length >= 8 || Boolean(persistedPage.value?.passwordProtected)) && (draft.accessMode !== 'restricted' || draft.userIds.length + draft.groupIds.length > 0))
const filteredLinks = computed(() => filterLinks(linkSearch.value))
const filteredFooterLinks = computed(() => filterLinks(footerLinkSearch.value))
const orderedFolders = computed(() => {
	const result: Array<{ folder: Folder; depth: number }> = []
	const visited = new Set<number>()
	const sorted = [...props.folders].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
	function append(parentId: number | null, depth: number) {
		for (const folder of sorted.filter(item => item.parentId === parentId)) {
			if (visited.has(folder.id)) continue
			visited.add(folder.id)
			result.push({ folder, depth })
			append(folder.id, depth + 1)
		}
	}
	append(null, 0)
	for (const folder of sorted) {
		if (visited.has(folder.id)) continue
		visited.add(folder.id)
		result.push({ folder, depth: 0 })
		append(folder.id, 1)
	}
	return result
})
const previewDraft = computed<LinkPageDraft>(() => historyPreview.value ? pageToDraft(historyPreview.value.page) : draft)
const previewTitle = computed(() => previewDraft.value.title.trim() || t('shortlinks', 'Untitled page'))
const previewTimestamp = computed(() => historyPreview.value ? historyPreview.value.version.createdAt * 1000 : previewChangedAt.value)
const previewExactTime = computed(() => formatExact(previewTimestamp.value))
const previewRelativeTime = computed(() => relativeTime(previewTimestamp.value, clock.value))
const saveStatusLabel = computed(() => {
	if (!persistedPage.value) return t('shortlinks', 'Save once to enable autosave and version history')
	if (!props.autosaveEnabled) return saveStatus.value === 'dirty' ? t('shortlinks', 'Unsaved changes') : t('shortlinks', 'Autosave is off')
	if (saveStatus.value === 'saving') return t('shortlinks', 'Saving…')
	if (saveStatus.value === 'error') return t('shortlinks', 'Autosave failed')
	if (saveStatus.value === 'dirty') return t('shortlinks', 'Waiting to autosave')
	return t('shortlinks', 'All changes saved')
})
let lastSavedFingerprint = fingerprint(draft)
let clockTimer: ReturnType<typeof setInterval> | undefined
let autosaveTimer: ReturnType<typeof setTimeout> | undefined
let principalSearchTimer: ReturnType<typeof setTimeout> | undefined
let principalSearchSequence = 0

watch(() => draft.title, value => { if (!aliasEdited.value) draft.slug = slugify(value) })
watch(() => props.singleSection, enabled => {
	if (!enabled) return
	for (const editorTab of Object.keys(openSections) as PageEditorTab[]) openSections[editorTab] = openSections[editorTab].slice(-1)
})
watch(draft, () => {
	previewChangedAt.value = Date.now()
	clock.value = Date.now()
	if (historyPreview.value) historyPreview.value = null
	if (fingerprint(draft) === lastSavedFingerprint) {
		saveStatus.value = 'saved'
		return
	}
	saveStatus.value = 'dirty'
	scheduleAutosave()
}, { deep: true })
watch(() => [props.autosaveEnabled, props.autosaveDelay], scheduleAutosave)
onMounted(() => { loadLinks(); clockTimer = setInterval(() => { clock.value = Date.now() }, 10_000) })
onBeforeUnmount(() => { if (clockTimer) clearInterval(clockTimer); if (autosaveTimer) clearTimeout(autosaveTimer); if (principalSearchTimer) clearTimeout(principalSearchTimer) })

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
function principalOption(type: 'user' | 'group', id: string, label?: string): NcSelectUsersModel {
	const key = `${type}:${id}`
	return { id: key, displayName: label ?? principalLabels[key] ?? id, user: type === 'user' ? id : undefined, isNoUser: type === 'group', subname: t('shortlinks', type === 'user' ? 'User' : 'Group') }
}
function updatePrincipals(value: NcSelectUsersModel | NcSelectUsersModel[]) {
	const options = Array.isArray(value) ? value : value ? [value] : []
	for (const option of options) principalLabels[option.id] = option.displayName
	draft.userIds = [...new Set(options.filter(option => option.id.startsWith('user:')).map(option => option.id.slice(5)))]
	draft.groupIds = [...new Set(options.filter(option => option.id.startsWith('group:')).map(option => option.id.slice(6)))]
}
function searchPrincipals(search: string) {
	if (principalSearchTimer) clearTimeout(principalSearchTimer)
	const query = search.trim()
	const sequence = ++principalSearchSequence
	principalSearchError.value = ''
	if (query.length < 2) {
		principalMatches.value = []
		principalSearchLoading.value = false
		return
	}
	principalSearchLoading.value = true
	principalSearchTimer = setTimeout(async () => {
		try {
			const matches = await api.searchPrincipals(query)
			if (sequence !== principalSearchSequence) return
			principalMatches.value = matches.map(match => {
				const option = principalOption(match.type, match.id, match.label)
				principalLabels[option.id] = option.displayName
				return option
			})
		} catch (error) {
			if (sequence !== principalSearchSequence) return
			principalMatches.value = []
			principalSearchError.value = error instanceof Error ? error.message : String(error)
		} finally {
			if (sequence === principalSearchSequence) principalSearchLoading.value = false
		}
	}, 250)
}
function slugify(value: string): string { return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) }
function setSlug(value: string | number) { aliasEdited.value = true; draft.slug = String(value).toLowerCase().replace(/[^a-z0-9_-]/g, '-') }
function setHeaderAlignment(value: PageHeaderAlignment) { draft.header = { ...draft.header, alignment: value } }
function toLocal(timestamp: number | null): string { if (timestamp === null) return ''; const date = new Date(timestamp * 1000); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) }
function toTimestamp(value: string): number | null { if (!value) return null; const time = new Date(value).getTime(); return Number.isFinite(time) ? Math.floor(time / 1000) : null }
function fileName(path: string): string { return path.split('/').filter(Boolean).at(-1) || path }
function filePreviewUrl(path: string): string { return `${generateUrl('/core/preview')}?${new URLSearchParams({ file: path, x: '256', y: '192', a: '1' })}` }
function markFilePreviewFailed(path: string) { failedFilePreviews.value = new Set([...failedFilePreviews.value, path]) }
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
function sectionOpen(editorTab: PageEditorTab, id: string): boolean { return openSections[editorTab].includes(id) }
function toggleSection(editorTab: PageEditorTab, id: string) {
	if (sectionOpen(editorTab, id)) {
		openSections[editorTab] = openSections[editorTab].filter(value => value !== id)
	} else {
		openSections[editorTab] = props.singleSection ? [id] : [...openSections[editorTab], id]
	}
}
function sectionPosition(editorTab: PageEditorTab, id: string): number { return draft.sectionOrder[editorTab].indexOf(id) }
function editorSectionProps(editorTab: PageEditorTab, id: string) {
	const index = sectionPosition(editorTab, id)
	const meta = sectionMeta[editorTab][id]!
	return {
		id,
		title: meta.title,
		description: meta.description,
		icon: meta.icon,
		open: sectionOpen(editorTab, id),
		first: index === 0,
		last: index === pageSectionIds[editorTab].length - 1,
		dragging: draggedSection.value?.tab === editorTab && draggedSection.value.id === id,
		dropPosition: dropPosition(editorTab, id),
		style: { order: index },
	}
}
function setSectionOrder(value: PageSectionOrder) { draft.sectionOrder = normalizePageSectionOrder(value) }
function moveSection(editorTab: PageEditorTab, id: string, offset: -1 | 1) {
	const index = sectionPosition(editorTab, id)
	if (index < 0) return
	setSectionOrder(movePageSection(draft.sectionOrder, editorTab, id, index + offset))
}
function sectionDragStart(editorTab: PageEditorTab, id: string, event: DragEvent) {
	draggedSection.value = { tab: editorTab, id }
	event.dataTransfer?.setData('text/plain', `${editorTab}:${id}`)
	if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}
function sectionDragOver(editorTab: PageEditorTab, id: string, position: 'before' | 'after', event: DragEvent) {
	if (!draggedSection.value || draggedSection.value.tab !== editorTab || draggedSection.value.id === id) return
	event.preventDefault()
	if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
	sectionDropTarget.value = { tab: editorTab, id, position }
}
function sectionDrop(editorTab: PageEditorTab, id: string, position: 'before' | 'after', event: DragEvent) {
	event.preventDefault()
	const source = draggedSection.value
	if (!source || source.tab !== editorTab || source.id === id) return sectionDragEnd()
	const remaining = draft.sectionOrder[editorTab].filter(value => value !== source.id)
	const targetIndex = remaining.indexOf(id)
	if (targetIndex >= 0) setSectionOrder(movePageSection(draft.sectionOrder, editorTab, source.id, targetIndex + (position === 'after' ? 1 : 0)))
	sectionDragEnd()
}
function sectionDragEnd() { draggedSection.value = null; sectionDropTarget.value = null }
function dropPosition(editorTab: PageEditorTab, id: string): 'before' | 'after' | null {
	return sectionDropTarget.value?.tab === editorTab && sectionDropTarget.value.id === id ? sectionDropTarget.value.position : null
}
function relativeTime(timestamp: number, current: number): string {
	const seconds = Math.max(0, Math.floor((current - timestamp) / 1000))
	if (seconds < 60) return t('shortlinks', '{seconds} seconds ago', { seconds })
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return t('shortlinks', '{minutes} minutes ago', { minutes })
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return t('shortlinks', '{hours} hours ago', { hours })
	return t('shortlinks', '{days} days ago', { days: Math.floor(hours / 24) })
}
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
function buildDraft(): LinkPageDraft { return { ...draft, folderIds: [...draft.folderIds], tagIds: [...draft.tagIds], linkIds: [...draft.linkIds], filePaths: [...draft.filePaths], contacts: draft.contacts.map(contact => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })), userIds: [...draft.userIds], groupIds: [...draft.groupIds], visibleFields: [...draft.visibleFields], theme: { ...draft.theme }, header: { ...draft.header }, footer: { ...draft.footer, linkIds: [...draft.footer.linkIds] }, sectionOrder: normalizePageSectionOrder(draft.sectionOrder) } }
function pageToDraft(page: LinkPage): LinkPageDraft { return { slug: page.slug, title: page.title, lead: page.lead ?? '', accessMode: page.accessMode, password: '', allowEmbedding: page.allowEmbedding, startsAt: page.startsAt, expiresAt: page.expiresAt, folderIds: [...page.folderIds], tagIds: [...page.tagIds], linkIds: [...page.linkIds], filePaths: [...page.filePaths], contacts: page.contacts.map(contact => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })), userIds: [...page.userIds], groupIds: [...page.groupIds], layout: page.layout, grouping: page.grouping, visibleFields: [...page.visibleFields], theme: { ...page.theme }, header: { ...page.header }, footer: { ...page.footer, linkIds: [...page.footer.linkIds] }, sectionOrder: normalizePageSectionOrder(page.sectionOrder), active: page.active, version: page.version } }
function fingerprint(value: LinkPageDraft): string { const copy = buildFingerprintValue(value); return JSON.stringify(copy) }
function buildFingerprintValue(value: LinkPageDraft): Omit<LinkPageDraft, 'version'> { const { version: _version, ...copy } = JSON.parse(JSON.stringify(value)) as LinkPageDraft; return copy }
function scheduleAutosave() {
	if (autosaveTimer) clearTimeout(autosaveTimer)
	if (!props.autosaveEnabled || !persistedPage.value || !canSave.value || saving.value || fingerprint(draft) === lastSavedFingerprint) return
	autosaveTimer = setTimeout(() => { persist(false) }, Math.max(2, props.autosaveDelay) * 1000)
}
async function persist(closeAfter: boolean) {
	if (!canSave.value || saving.value) return
	if (autosaveTimer) clearTimeout(autosaveTimer)
	const payload = buildDraft()
	const savedFingerprint = fingerprint(payload)
	saving.value = true
	saveStatus.value = 'saving'
	try {
		const page = persistedPage.value ? await api.updatePage(persistedPage.value.id, payload) : await api.createPage(payload)
		persistedPage.value = page
		draft.version = page.version
		lastSavedFingerprint = savedFingerprint
		saveStatus.value = fingerprint(draft) === savedFingerprint ? 'saved' : 'dirty'
		emit('saved', page, closeAfter)
		if (!closeAfter && historyOpen.value) history.value = await api.listPageVersions(page.id)
	} catch (error) {
		saveStatus.value = 'error'
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		saving.value = false
		if (!closeAfter && saveStatus.value === 'dirty') scheduleAutosave()
	}
}
function submit() { persist(true) }
async function openHistory() {
	if (!persistedPage.value) return
	historyOpen.value = true
	historyLoading.value = true
	try { history.value = await api.listPageVersions(persistedPage.value.id) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { historyLoading.value = false }
}
async function previewVersion(version: LinkPageVersion) {
	if (!persistedPage.value) return
	try { historyPreview.value = await api.getPageVersion(persistedPage.value.id, version.version) } catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}
function stopHistoryPreview() { historyPreview.value = null }
async function confirmRestore() {
	if (!persistedPage.value || !restoringVersion.value) return
	const restoredVersionNumber = restoringVersion.value.version
	try {
		const page = await api.restorePageVersion(persistedPage.value.id, restoredVersionNumber, persistedPage.value.version)
		persistedPage.value = page
		Object.assign(draft, pageToDraft(page))
		lastSavedFingerprint = fingerprint(draft)
		saveStatus.value = 'saved'
		historyPreview.value = null
		restoringVersion.value = null
		history.value = await api.listPageVersions(page.id)
		emit('saved', page, false)
		showSuccess(t('shortlinks', 'Version {version} restored', { version: restoredVersionNumber }))
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}
function formatExact(timestamp: number): string { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(timestamp) }
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
			</div><div class="page-editor__toolbar-actions">
				<span class="save-status" :class="`save-status--${saveStatus}`" aria-live="polite">{{ saveStatusLabel }}</span>
				<NcButton variant="secondary"
					:href="persistedPage?.publicUrl"
					:disabled="!persistedPage?.publicUrl"
					target="_blank"
					rel="noopener noreferrer"
					:title="persistedPage?.publicUrl ? t('shortlinks', 'Open the saved page in a new window') : t('shortlinks', 'Save the page before opening its public preview')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiOpenInNew" />
					</template>{{ t('shortlinks', 'Preview') }}
				</NcButton><NcButton variant="secondary" :disabled="!persistedPage" @click="openHistory">
					<template #icon>
						<NcIconSvgWrapper :path="mdiHistory" />
					</template>{{ t('shortlinks', 'Version history') }}
				</NcButton><NcButton variant="primary" :disabled="!canSave || saving" @click="submit">
					<template #icon>
						<NcIconSvgWrapper :path="mdiContentSaveOutline" />
					</template>{{ t('shortlinks', 'Save page') }}
				</NcButton>
			</div>
		</header>
		<div class="page-editor__workspace">
			<div class="page-editor__controls">
				<nav class="editor-tabs" role="tablist">
					<button v-for="item in ([{ id: 'general', label: 'General', icon: mdiLockOutline }, { id: 'content', label: 'Content', icon: mdiFormatListBulleted }, { id: 'design', label: 'Design', icon: mdiPaletteOutline }] as const)"
						:key="item.id"
						role="tab"
						:aria-selected="tab === item.id"
						:class="{ active: tab === item.id }"
						type="button"
						@click="tab = item.id">
						<NcIconSvgWrapper :path="item.icon" :size="18" />{{ t('shortlinks', item.label) }}
					</button>
				</nav>
				<div v-if="tab === 'general'" class="editor-panel">
					<PageEditorSection v-bind="editorSectionProps('general', 'identity')"
						@toggle="toggleSection('general', 'identity')"
						@move="moveSection('general', 'identity', $event)"
						@drag-start="sectionDragStart('general', 'identity', $event)"
						@drag-over="sectionDragOver('general', 'identity', $event.position, $event.event)"
						@drop="sectionDrop('general', 'identity', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<NcTextField v-model="draft.title" :label="t('shortlinks', 'Page title')" required /><NcTextArea v-model="draft.lead" :label="t('shortlinks', 'Lead text (optional)')" /><NcTextField :model-value="draft.slug"
							:label="t('shortlinks', 'Page address')"
							:helper-text="`…/p/${draft.slug || 'page'}`"
							@update:model-value="setSlug" />
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('general', 'access')"
						@toggle="toggleSection('general', 'access')"
						@move="moveSection('general', 'access', $event)"
						@drag-start="sectionDragStart('general', 'access', $event)"
						@drag-over="sectionDragOver('general', 'access', $event.position, $event.event)"
						@drop="sectionDrop('general', 'access', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="choice-grid">
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
								<div class="principal-picker">
									<NcSelectUsers :model-value="selectedPrincipals"
										:options="principalOptions"
										:input-label="t('shortlinks', 'People and groups')"
										:placeholder="t('shortlinks', 'Search users and groups')"
										:loading="principalSearchLoading"
										multiple
										keep-open
										required
										@search="searchPrincipals"
										@update:model-value="updatePrincipals" />
									<p class="field-help">
										{{ t('shortlinks', 'Type at least 2 characters to search.') }}
									</p>
									<p v-if="principalSearchError" class="field-error" role="alert">
										{{ principalSearchError }}
									</p>
								</div>
							</template><div class="date-grid">
							<label>{{ t('shortlinks', 'Available from') }}<input v-model="startsAtLocal" type="datetime-local"></label><label>{{ t('shortlinks', 'Expires at') }}<input v-model="expiresAtLocal" type="datetime-local"></label>
						</div><NcCheckboxRadioSwitch v-model="draft.active" type="switch">
							{{ t('shortlinks', 'Page is active') }}
						</NcCheckboxRadioSwitch>
						<div class="setting-toggle">
							<NcCheckboxRadioSwitch v-model="draft.allowEmbedding" type="switch">
								{{ t('shortlinks', 'Allow embedding in iFrames') }}
							</NcCheckboxRadioSwitch>
							<p>{{ t('shortlinks', 'Let other websites display this Page in an iFrame. Page access rules still apply.') }}</p>
						</div>
					</PageEditorSection>
				</div>

				<div v-else-if="tab === 'content'" class="editor-panel">
					<PageEditorSection v-bind="editorSectionProps('content', 'sources')"
						@toggle="toggleSection('content', 'sources')"
						@move="moveSection('content', 'sources', $event)"
						@drag-start="sectionDragStart('content', 'sources', $event)"
						@drag-over="sectionDragOver('content', 'sources', $event.position, $event.event)"
						@drop="sectionDrop('content', 'sources', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<h3><NcIconSvgWrapper :path="mdiShapeOutline" :size="20" />{{ t('shortlinks', 'Folders') }}</h3><div class="source-list">
							<label v-for="entry in orderedFolders"
								:key="entry.folder.id"
								class="source-list__folder"><input type="checkbox" :checked="draft.folderIds.includes(entry.folder.id)" @change="toggleId('folderIds', entry.folder.id)"><span class="source-list__indent" :style="{ inlineSize: `${entry.depth * 22}px` }" aria-hidden="true" /><NcIconSvgWrapper class="source-list__folder-icon" :path="folderIconPath(entry.folder.icon)" :size="17" /><span class="source-list__name">{{ entry.folder.name }}</span><small>{{ entry.folder.count }}</small></label><p v-if="!folders.length">
									{{ t('shortlinks', 'No folders yet') }}
								</p>
						</div><h3>{{ t('shortlinks', 'Tags') }}</h3><div class="source-list">
							<label v-for="tag in tags" :key="tag.id"><input type="checkbox" :checked="draft.tagIds.includes(tag.id)" @change="toggleId('tagIds', tag.id)"><i :style="{ backgroundColor: tag.color || 'var(--color-primary-element)' }" /><span class="source-list__name">{{ tag.name }}</span><small>{{ tag.count }}</small></label><p v-if="!tags.length">
								{{ t('shortlinks', 'No tags yet') }}
							</p>
						</div>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('content', 'links')"
						@toggle="toggleSection('content', 'links')"
						@move="moveSection('content', 'links', $event)"
						@drag-start="sectionDragStart('content', 'links', $event)"
						@drag-over="sectionDragOver('content', 'links', $event.position, $event.event)"
						@drop="sectionDrop('content', 'links', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="source-list source-list--links">
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
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('content', 'files')"
						@toggle="toggleSection('content', 'files')"
						@move="moveSection('content', 'files', $event)"
						@drag-start="sectionDragStart('content', 'files', $event)"
						@drag-over="sectionDragOver('content', 'files', $event.position, $event.event)"
						@drop="sectionDrop('content', 'files', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<template #header-action>
							<NcButton @click="pickFiles">
								<template #icon>
									<NcIconSvgWrapper :path="mdiFilePlusOutline" />
								</template>{{ t('shortlinks', 'Select files') }}
							</NcButton>
						</template>
						<div v-if="draft.filePaths.length" class="selected-content-list">
							<div v-for="path in draft.filePaths" :key="path" class="selected-content-item">
								<span class="selected-content-item__visual"><img v-if="!failedFilePreviews.has(path)"
									:src="filePreviewUrl(path)"
									alt=""
									@error="markFilePreviewFailed(path)"><NcIconSvgWrapper v-else :path="mdiFileMultipleOutline" :size="21" /></span><span><strong>{{ fileName(path) }}</strong><small>{{ path }}</small></span><NcButton variant="tertiary" :aria-label="t('shortlinks', 'Remove file')" @click="removeFile(path)">
										<template #icon>
											<NcIconSvgWrapper :path="mdiClose" />
										</template>
									</NcButton>
							</div>
						</div><p v-else class="content-empty">
							{{ t('shortlinks', 'No files selected') }}
						</p>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('content', 'contacts')"
						@toggle="toggleSection('content', 'contacts')"
						@move="moveSection('content', 'contacts', $event)"
						@drag-start="sectionDragStart('content', 'contacts', $event)"
						@drag-over="sectionDragOver('content', 'contacts', $event.position, $event.event)"
						@drop="sectionDrop('content', 'contacts', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<p class="privacy-note">
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
					</PageEditorSection>
				</div>

				<div v-else class="editor-panel">
					<PageEditorSection v-bind="editorSectionProps('design', 'layout')"
						@toggle="toggleSection('design', 'layout')"
						@move="moveSection('design', 'layout', $event)"
						@drag-start="sectionDragStart('design', 'layout', $event)"
						@drag-over="sectionDragOver('design', 'layout', $event.position, $event.event)"
						@drop="sectionDrop('design', 'layout', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="choice-grid layout-choices">
							<button v-for="layout in layouts"
								:key="layout.id"
								type="button"
								:class="{ selected: draft.layout === layout.id }"
								@click="draft.layout = layout.id">
								<span class="layout-glyph" :class="`layout-glyph--${layout.id}`"><i v-for="n in 4" :key="n" /></span><span><strong>{{ t('shortlinks', layout.label) }}</strong><small>{{ t('shortlinks', layout.description) }}</small></span>
							</button>
						</div>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('design', 'theme')"
						@toggle="toggleSection('design', 'theme')"
						@move="moveSection('design', 'theme', $event)"
						@drag-start="sectionDragStart('design', 'theme', $event)"
						@drag-over="sectionDragOver('design', 'theme', $event.position, $event.event)"
						@drop="sectionDrop('design', 'theme', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="theme-slider" role="group" :aria-label="t('shortlinks', 'Theme')">
							<button v-for="theme in pageThemes"
								:key="theme.preset"
								type="button"
								:class="{ selected: draft.theme.preset === theme.preset }"
								:aria-pressed="draft.theme.preset === theme.preset"
								@click="applyTheme(theme.preset)">
								<span class="theme-card__preview" :style="{ '--theme-bg': theme.background, '--theme-surface': theme.surface, '--theme-primary': theme.primary, '--theme-text': theme.text }"><i /><i /><i /></span><span class="theme-card__copy"><strong><NcIconSvgWrapper :path="themeIcons[theme.preset]" :size="18" />{{ t('shortlinks', theme.label) }}</strong><small>{{ t('shortlinks', theme.description) }}</small></span>
							</button>
						</div>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('design', 'grouping')"
						@toggle="toggleSection('design', 'grouping')"
						@move="moveSection('design', 'grouping', $event)"
						@drag-start="sectionDragStart('design', 'grouping', $event)"
						@drag-over="sectionDragOver('design', 'grouping', $event.position, $event.event)"
						@drop="sectionDrop('design', 'grouping', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="horizontal-radio" role="radiogroup" :aria-label="t('shortlinks', 'Group links by')">
							<label v-for="grouping in groupings" :key="grouping.id" :class="{ selected: draft.grouping === grouping.id }"><input v-model="draft.grouping" type="radio" :value="grouping.id"><NcIconSvgWrapper :path="grouping.icon" :size="20" /><span>{{ t('shortlinks', grouping.label) }}</span></label>
						</div>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('design', 'visible')"
						@toggle="toggleSection('design', 'visible')"
						@move="moveSection('design', 'visible', $event)"
						@drag-start="sectionDragStart('design', 'visible', $event)"
						@drag-over="sectionDragOver('design', 'visible', $event.position, $event.event)"
						@drop="sectionDrop('design', 'visible', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="field-toggles">
							<NcCheckboxRadioSwitch v-for="field in fieldOptions"
								:key="field.id"
								:model-value="draft.visibleFields.includes(field.id)"
								type="switch"
								@update:model-value="toggleField(field.id)">
								{{ t('shortlinks', field.label) }}
							</NcCheckboxRadioSwitch>
						</div>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('design', 'customizing')"
						@toggle="toggleSection('design', 'customizing')"
						@move="moveSection('design', 'customizing', $event)"
						@drag-start="sectionDragStart('design', 'customizing', $event)"
						@drag-over="sectionDragOver('design', 'customizing', $event.position, $event.event)"
						@drop="sectionDrop('design', 'customizing', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="customizing-subsection">
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
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('design', 'header')"
						@toggle="toggleSection('design', 'header')"
						@move="moveSection('design', 'header', $event)"
						@drag-start="sectionDragStart('design', 'header', $event)"
						@drag-over="sectionDragOver('design', 'header', $event.position, $event.event)"
						@drop="sectionDrop('design', 'header', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="field-toggles">
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
							<label v-for="alignment in headerAlignments" :key="alignment.id" :class="{ selected: draft.header.alignment === alignment.id }"><input type="radio"
								:value="alignment.id"
								:checked="draft.header.alignment === alignment.id"
								@change="setHeaderAlignment(alignment.id)"><NcIconSvgWrapper :path="alignment.icon" :size="18" /><span>{{ t('shortlinks', alignment.label) }}</span></label>
						</div>
					</PageEditorSection><PageEditorSection v-bind="editorSectionProps('design', 'footer')"
						@toggle="toggleSection('design', 'footer')"
						@move="moveSection('design', 'footer', $event)"
						@drag-start="sectionDragStart('design', 'footer', $event)"
						@drag-over="sectionDragOver('design', 'footer', $event.position, $event.event)"
						@drop="sectionDrop('design', 'footer', $event.position, $event.event)"
						@drag-end="sectionDragEnd">
						<div class="field-toggles">
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
					</PageEditorSection>
				</div>
			</div>
			<aside class="page-editor__preview">
				<div v-if="historyPreview" class="history-preview-banner" role="status">
					<span><NcIconSvgWrapper :path="mdiHistory" :size="20" /><strong>{{ t('shortlinks', 'Previewing version {version}', { version: historyPreview.version.version }) }}</strong> · {{ formatExact(historyPreview.version.createdAt * 1000) }}</span>
					<NcButton variant="tertiary-on-primary" @click="stopHistoryPreview">
						<template #icon>
							<NcIconSvgWrapper :path="mdiClose" />
						</template>{{ t('shortlinks', 'Back to current draft') }}
					</NcButton>
				</div>
				<header class="preview-state">
					<span class="preview-state__eyebrow"><NcIconSvgWrapper :path="mdiEyeOutline" :size="18" />{{ historyPreview ? t('shortlinks', 'Historical page preview') : persistedPage ? t('shortlinks', 'Live preview of current changes') : t('shortlinks', 'Preview of this new page') }}</span>
					<strong>{{ previewTitle }}</strong>
					<small>{{ historyPreview ? t('shortlinks', 'Saved {relative} at {time}', { relative: previewRelativeTime, time: previewExactTime }) : t('shortlinks', 'Last change {relative} at {time}', { relative: previewRelativeTime, time: previewExactTime }) }}</small>
				</header><PagePreview :draft="previewDraft" :links="links" :folders="folders" />
			</aside>
		</div>
	</section>
	<NcAppSidebar v-if="persistedPage"
		:name="t('shortlinks', 'Version history')"
		:subname="persistedPage.title"
		:open="historyOpen"
		:no-toggle="true"
		@close="historyOpen = false"
		@update:open="historyOpen = $event">
		<div class="version-history">
			<p class="version-history__intro">
				{{ t('shortlinks', 'Every saved state can be previewed or restored. Newest versions appear first.') }}
			</p>
			<NcLoadingIcon v-if="historyLoading" :name="t('shortlinks', 'Loading version history')" />
			<p v-else-if="!history.length" class="version-history__empty">
				{{ t('shortlinks', 'No saved versions yet.') }}
			</p>
			<article v-for="item in history"
				v-else
				:key="item.version"
				class="version-entry"
				:class="{ 'version-entry--previewed': historyPreview?.version.version === item.version }">
				<div class="version-entry__main"
					role="button"
					tabindex="0"
					@click="previewVersion(item)"
					@keydown.enter="previewVersion(item)"
					@keydown.space.prevent="previewVersion(item)">
					<strong>{{ t('shortlinks', 'Version {version}', { version: item.version }) }}</strong>
					<span>{{ t('shortlinks', 'Modified by {user}', { user: item.modifiedByDisplayName }) }}</span>
					<small :title="formatExact(item.createdAt * 1000)">{{ relativeTime(item.createdAt * 1000, clock) }} · {{ formatExact(item.createdAt * 1000) }}</small>
				</div><div class="version-entry__actions">
					<NcButton variant="tertiary" :aria-label="t('shortlinks', 'Preview version {version}', { version: item.version })" @click="previewVersion(item)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiEyeOutline" />
						</template>
						{{ t('shortlinks', 'Preview') }}
					</NcButton><NcButton variant="tertiary" :aria-label="t('shortlinks', 'Restore version {version}', { version: item.version })" @click="restoringVersion = item">
						<template #icon>
							<NcIconSvgWrapper :path="mdiBackupRestore" />
						</template>
						{{ t('shortlinks', 'Restore') }}
					</NcButton>
				</div>
			</article>
		</div>
	</NcAppSidebar>
	<NcDialog v-if="restoringVersion"
		:name="t('shortlinks', 'Restore version {version}?', { version: restoringVersion.version })"
		size="normal"
		@closing="restoringVersion = null">
		<div class="restore-warning">
			<NcIconSvgWrapper :path="mdiBackupRestore" :size="36" />
			<div><strong>{{ t('shortlinks', 'This replaces the current page state.') }}</strong><p>{{ t('shortlinks', 'Unsaved changes and all {count} newer versions will be permanently removed. This cannot be undone.', { count: history.filter(item => item.version > restoringVersion!.version).length }) }}</p></div>
		</div>
		<template #actions>
			<NcButton @click="restoringVersion = null">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton>
			<NcButton variant="error" @click="confirmRestore">
				<template #icon>
					<NcIconSvgWrapper :path="mdiBackupRestore" />
				</template>{{ t('shortlinks', 'Restore version') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<style scoped>
.page-editor{display:grid;grid-template-rows:auto minmax(0,1fr);block-size:100%;min-block-size:0;overflow:hidden;background:var(--color-main-background)}

.page-editor__toolbar{position:sticky;z-index:5;inset-block-start:0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:10px 16px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.page-editor__toolbar h1,.page-editor__toolbar p{margin:0}

.page-editor__toolbar h1{font-size:1.25rem}

.page-editor__toolbar p{color:var(--color-text-maxcontrast)}

.page-editor__toolbar-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px}

.save-status{max-inline-size:180px;color:var(--color-text-maxcontrast);font-size:.78rem;text-align:end}

.save-status--saving{color:var(--color-primary-element)}

.save-status--error{color:var(--color-error)}

.page-editor__workspace{display:grid;grid-template-columns:minmax(340px,560px) minmax(420px,1fr);block-size:100%;min-block-size:0;overflow:hidden}

.page-editor__controls{min-block-size:0;overflow:auto;border-inline-end:1px solid var(--color-border)}

.editor-tabs{position:sticky;z-index:4;inset-block-start:66px;display:flex;gap:4px;padding:10px 16px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.editor-tabs button{display:flex;align-items:center;justify-content:center;flex:1;gap:6px;min-block-size:40px;margin:0;padding:6px 10px;border:0;border-radius:var(--border-radius);background:transparent;color:var(--color-text-maxcontrast);font-weight:600;cursor:pointer}

.editor-tabs button:not(.active):hover{background:var(--color-primary-element-light)}

.editor-tabs button.active{background:var(--color-primary-element);color:var(--color-primary-element-text)}

.editor-tabs :deep(.icon-vue){display:grid;place-items:center;align-self:center;line-height:0}

.editor-tabs :deep(.icon-vue svg){display:block}

.editor-panel{display:grid;gap:16px;padding:20px}

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

.principal-picker{display:grid;gap:4px;min-inline-size:0}

.field-help,.field-error,.setting-toggle p{margin:0;padding-inline-start:34px;font-size:.9em;color:var(--color-text-maxcontrast)}

.editor-panel .field-error{color:var(--color-error)}

.setting-toggle{display:grid;gap:2px;padding-block-start:4px}

.source-list{display:grid;max-block-size:260px;overflow:auto;border:1px solid var(--color-border);border-radius:var(--border-radius-large)}

.source-list__search{position:sticky;z-index:2;inset-block-start:0;padding:8px;border-block-end:1px solid var(--color-border);background:var(--color-main-background)}

.source-list__empty,.source-list>p{padding:14px;text-align:center}

.source-list>label{display:flex;align-items:center;gap:9px;min-block-size:44px;padding:8px 10px;border-block-end:1px solid var(--color-border);cursor:pointer}

.source-list>label:last-child{border:0}

.source-list>label:hover{background:var(--color-background-hover)}

.source-list input{inline-size:20px;block-size:20px;margin:0}

.source-list__indent{flex:0 0 auto;block-size:1px}

.source-list__folder-icon{display:grid;place-items:center;flex:0 0 24px;inline-size:24px;min-inline-size:24px;max-inline-size:24px;block-size:24px;min-block-size:24px;max-block-size:24px;line-height:0}

.source-list__folder-icon :deep(svg){display:block}

.source-list__name{min-inline-size:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.source-list label>small{color:var(--color-text-maxcontrast)}

.source-list i{inline-size:10px;block-size:10px;border-radius:50%}

.source-list--links label>span,.source-list--contacts label>span{display:grid}

.source-list--links strong,.source-list--links small,.source-list--contacts strong,.source-list--contacts small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.selected-content-list{display:grid;gap:6px}

.selected-content-item{display:flex;align-items:center;gap:9px;min-block-size:48px;padding:6px 8px;border:1px solid var(--color-border);border-radius:var(--border-radius-large)}

.selected-content-item__visual{display:grid;place-items:center;flex:0 1 72px;inline-size:min(72px,33%);max-inline-size:33%;aspect-ratio:4/3;overflow:hidden;border-radius:10px;background:var(--color-background-hover);color:var(--color-primary-element)}

.selected-content-item__visual img{inline-size:100%;block-size:100%;object-fit:cover}

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

.page-editor__preview{align-self:stretch;display:flex;flex-direction:column;min-block-size:0;gap:12px;padding:20px;overflow:auto;background:var(--color-background-hover)}

.page-editor__preview :deep(.page-preview){flex:1}

.page-editor__preview h2{display:flex;align-items:center;gap:8px;margin:0}

.preview-state{display:grid;gap:3px;padding:12px 14px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background)}

.preview-state__eyebrow{display:flex;align-items:center;gap:6px;color:var(--color-primary-element);font-size:.82rem;font-weight:700}

.preview-state>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:1.05rem}

.preview-state>small{color:var(--color-text-maxcontrast)}

.history-preview-banner{position:sticky;z-index:3;inset-block-start:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:var(--border-radius-large);background:var(--color-primary-element);color:var(--color-primary-element-text);box-shadow:0 4px 16px rgb(0 0 0 / 20%)}

.history-preview-banner>span{display:flex;align-items:center;flex-wrap:wrap;gap:5px}

.version-history{display:grid;gap:8px;padding:16px}

.version-history__intro,.version-history__empty{margin:0 0 8px;color:var(--color-text-maxcontrast)}

.version-entry{display:flex;align-items:stretch;gap:6px;min-block-size:92px;padding:8px;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--color-main-background);transition:border-color .15s ease,background-color .15s ease}

.version-entry:hover,.version-entry:focus-within,.version-entry--previewed{border-color:var(--color-primary-element);background:var(--color-primary-element-light)}

.version-entry__main{display:grid;align-content:center;min-inline-size:0;flex:1;gap:3px;padding:4px;border-radius:var(--border-radius);cursor:pointer}

.version-entry__main:focus-visible{outline:2px solid var(--color-primary-element);outline-offset:2px}

.version-entry__main span,.version-entry__main small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.version-entry__main small{color:var(--color-text-maxcontrast)}

.version-entry__actions{display:flex;flex-direction:column;justify-content:center;gap:2px;opacity:0;transition:opacity .15s ease}

.version-entry:hover .version-entry__actions,.version-entry:focus-within .version-entry__actions{opacity:1}

.restore-warning{display:flex;align-items:flex-start;gap:14px;padding-block:12px}

.restore-warning>div{display:grid;gap:6px}

.restore-warning p{margin:0;color:var(--color-text-maxcontrast)}

@media(max-width:1050px){.page-editor{block-size:auto;min-block-size:100%}.page-editor__workspace{grid-template-columns:1fr;block-size:auto;overflow:visible}.page-editor__controls{overflow:visible;border:0}.page-editor__preview{min-block-size:640px;border-block-start:1px solid var(--color-border)}}@media(max-width:720px){.save-status{inline-size:100%;max-inline-size:none;text-align:start}.page-editor__toolbar-actions{flex-wrap:wrap}.history-preview-banner{align-items:flex-start;flex-direction:column}.version-entry__actions{opacity:1}}@media(max-width:600px){.page-editor__toolbar{grid-template-columns:auto minmax(0,1fr)}.page-editor__toolbar-actions{grid-column:1/-1;inline-size:100%}.page-editor__toolbar-actions>*:not(.save-status){flex:1}.choice-grid,.date-grid,.color-fields,.field-toggles{grid-template-columns:1fr}.editor-tabs{inset-block-start:104px;overflow-x:auto}.editor-tabs button{min-inline-size:max-content}.theme-slider>button{flex-basis:188px}.horizontal-radio label{flex-basis:100%}}
</style>
