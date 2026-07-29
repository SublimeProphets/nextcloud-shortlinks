<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
	mdiCalendarRemoveOutline,
	mdiChartBoxOutline,
	mdiCodeJson,
	mdiCursorDefaultClickOutline,
	mdiExportVariant,
	mdiFileDelimitedOutline,
	mdiFileImportOutline,
	mdiHistory,
	mdiLinkOff,
	mdiLinkVariant,
	mdiMagnify,
	mdiStarOutline,
	mdiTagMultipleOutline,
	mdiTrashCanOutline,
	mdiViewDashboardOutline,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcBreadcrumb from '@nextcloud/vue/components/NcBreadcrumb'
import NcBreadcrumbs from '@nextcloud/vue/components/NcBreadcrumbs'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcPopover from '@nextcloud/vue/components/NcPopover'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { Folder, Tag } from '../types'
import CreateMenu from './CreateMenu.vue'

type TagMode = 'and' | 'or'
type AgePeriod = 'any' | 'day' | 'week' | 'month' | 'year'
type ActiveFilter = 'all' | 'active' | 'inactive'

const props = defineProps<{
	folders: Folder[]
	tags: Tag[]
	system: string
	folderId: number | null
	tagIds: number[]
	tagMode: TagMode
	search: string
	createdFrom: number | null
	active: boolean | null
	listMode: boolean
}>()

const emit = defineEmits<{
	createFolder: []
	createLink: []
	createTag: []
	filter: [value: { system: string; folderId: number | null }]
	openTag: [id: number]
	setTags: [value: { ids: number[]; mode: TagMode }]
	search: [value: { search: string; createdFrom: number | null; active: boolean | null }]
	overview: []
	refresh: []
}>()

const systemItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: mdiViewDashboardOutline },
	{ id: 'all', label: 'All links', icon: mdiLinkVariant },
	{ id: 'favorites', label: 'Favorites', icon: mdiStarOutline },
	{ id: 'recent', label: 'Recently created', icon: mdiHistory },
	{ id: 'used', label: 'Recently used', icon: mdiCursorDefaultClickOutline },
	{ id: 'expired', label: 'Expired', icon: mdiCalendarRemoveOutline },
	{ id: 'inactive', label: 'Inactive', icon: mdiLinkOff },
	{ id: 'trash', label: 'Trash', icon: mdiTrashCanOutline },
]

const searchOpen = ref(false)
const tagOpen = ref(false)
const searchQuery = ref(props.search)
const agePeriod = ref<AgePeriod>(periodForTimestamp(props.createdFrom))
const activeFilter = ref<ActiveFilter>(props.active === true ? 'active' : props.active === false ? 'inactive' : 'all')
const localTagIds = ref([...props.tagIds])
const localTagMode = ref<TagMode>(props.tagMode)
const importInput = ref<HTMLInputElement | null>(null)

watch(() => props.search, value => { searchQuery.value = value })
watch(() => props.createdFrom, value => { agePeriod.value = periodForTimestamp(value) })
watch(() => props.active, value => { activeFilter.value = value === true ? 'active' : value === false ? 'inactive' : 'all' })
watch(() => props.tagIds, value => { localTagIds.value = [...value] })
watch(() => props.tagMode, value => { localTagMode.value = value })

const activeSystem = computed(() => systemItems.find(item => item.id === props.system) ?? { id: 'all', label: 'All links', icon: mdiLinkVariant })
const selectedTags = computed(() => props.tags.filter(tag => props.tagIds.includes(tag.id)))
const folderPath = computed(() => {
	const path: Folder[] = []
	let current = props.folders.find(folder => folder.id === props.folderId)
	const seen = new Set<number>()
	while (current && !seen.has(current.id)) {
		path.unshift(current)
		seen.add(current.id)
		current = current.parentId === null ? undefined : props.folders.find(folder => folder.id === current?.parentId)
	}
	return path
})
const hasSearchFilters = computed(() => Boolean(props.search || props.createdFrom !== null || props.active !== null))
const hasTagFilters = computed(() => props.tagIds.length > 0)

function siblings(folder: Folder): Folder[] {
	return props.folders
		.filter(item => item.parentId === folder.parentId)
		.sort((left, right) => left.position - right.position || left.name.localeCompare(right.name))
}

function periodForTimestamp(timestamp: number | null): AgePeriod {
	if (timestamp === null) return 'any'
	const ageDays = (Date.now() / 1000 - timestamp) / 86_400
	if (ageDays <= 1.5) return 'day'
	if (ageDays <= 8) return 'week'
	if (ageDays <= 32) return 'month'
	return 'year'
}

function applySearch() {
	const days: Record<AgePeriod, number | null> = { any: null, day: 1, week: 7, month: 30, year: 365 }
	const selectedDays = days[agePeriod.value]
	emit('search', {
		search: searchQuery.value.trim(),
		createdFrom: selectedDays === null ? null : Math.floor(Date.now() / 1000) - selectedDays * 86_400,
		active: activeFilter.value === 'all' ? null : activeFilter.value === 'active',
	})
	searchOpen.value = false
}

function clearSearch() {
	searchQuery.value = ''
	agePeriod.value = 'any'
	activeFilter.value = 'all'
	emit('search', { search: '', createdFrom: null, active: null })
	searchOpen.value = false
}

function toggleLocalTag(id: number) {
	localTagIds.value = localTagIds.value.includes(id)
		? localTagIds.value.filter(value => value !== id)
		: [...localTagIds.value, id]
}

function applyTags() {
	emit('setTags', { ids: localTagIds.value, mode: localTagMode.value })
	tagOpen.value = false
}

function clearTags() {
	localTagIds.value = []
	emit('setTags', { ids: [], mode: localTagMode.value })
	tagOpen.value = false
}

async function exportLinks(format: 'csv' | 'json') {
	try {
		const result = await api.exportLinks(format, {
			system: props.system,
			folderId: props.folderId ?? undefined,
			tagIds: props.tagIds,
			tagMode: props.tagMode,
			search: props.search,
			createdFrom: props.createdFrom ?? undefined,
			active: props.active ?? undefined,
		})
		const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }))
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = result.filename
		anchor.click()
		URL.revokeObjectURL(url)
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

async function importFile(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file) return
	try {
		if (file.size > 5 * 1024 * 1024) throw new Error(t('shortlinks', 'Import files are limited to 5 MiB'))
		const format = file.name.toLowerCase().endsWith('.json') ? 'json' : 'csv'
		const content = await file.text()
		const preview = await api.importLinks(format, content, true, 'skip') as { created?: number }
		if (!window.confirm(t('shortlinks', 'The dry run found {count} valid rows. Continue with import?', { count: preview.created ?? 0 }))) return
		const result = await api.importLinks(format, content, false, 'skip') as { created?: number }
		showSuccess(t('shortlinks', 'Imported {count} links', { count: result.created ?? 0 }))
		emit('refresh')
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		input.value = ''
	}
}
</script>

<template>
	<header class="content-toolbar" :aria-label="t('shortlinks', 'List actions')">
		<div class="content-toolbar__left">
			<CreateMenu @link="emit('createLink')" @folder="emit('createFolder')" @tag="emit('createTag')" />
			<NcBreadcrumbs root-icon="icon-link" :aria-label="t('shortlinks', 'Current view')">
				<NcBreadcrumb :name="t('shortlinks', folderId !== null || tagIds.length ? 'All links' : activeSystem.label)" force-menu>
					<NcActionButton v-for="item in systemItems"
						:key="item.id"
						:name="t('shortlinks', item.label)"
						:aria-current="folderId === null && tagIds.length === 0 && system === item.id ? 'page' : undefined"
						@click="emit('filter', { system: item.id, folderId: null })">
						<template #icon>
							<NcIconSvgWrapper :path="item.icon" />
						</template>
					</NcActionButton>
				</NcBreadcrumb>
				<NcBreadcrumb v-for="folder in folderPath"
					:key="folder.id"
					:name="folder.name"
					force-menu>
					<NcActionButton v-for="sibling in siblings(folder)"
						:key="sibling.id"
						:name="sibling.name"
						:aria-current="sibling.id === folder.id ? 'page' : undefined"
						@click="emit('filter', { system: 'all', folderId: sibling.id })" />
				</NcBreadcrumb>
				<NcBreadcrumb v-if="tagIds.length" :name="t('shortlinks', 'Tags')" force-menu>
					<NcActionButton v-for="tag in tags"
						:key="tag.id"
						:name="tag.name"
						@click="emit('openTag', tag.id)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiTagMultipleOutline" />
						</template>
					</NcActionButton>
				</NcBreadcrumb>
				<NcBreadcrumb v-if="tagIds.length"
					:name="selectedTags.map(tag => tag.name).join(', ') || t('shortlinks', 'Tags')"
					force-menu>
					<NcActionButton v-for="tag in tags"
						:key="tag.id"
						:name="tag.name"
						:aria-current="tagIds.includes(tag.id) ? 'page' : undefined"
						@click="emit('openTag', tag.id)" />
				</NcBreadcrumb>
			</NcBreadcrumbs>
		</div>

		<div v-if="listMode" class="content-toolbar__actions">
			<NcPopover v-model:shown="searchOpen" placement="bottom-end" popup-role="dialog">
				<template #trigger="{ attrs }">
					<NcButton v-bind="attrs" variant="tertiary" :pressed="hasSearchFilters">
						<template #icon>
							<NcIconSvgWrapper :path="mdiMagnify" />
						</template>
						{{ t('shortlinks', 'Search') }}
					</NcButton>
				</template>
				<form class="toolbar-popover search-popover" @submit.prevent="applySearch">
					<div>
						<h2>{{ t('shortlinks', 'Search short links') }}</h2>
						<p>{{ t('shortlinks', 'Search titles, aliases, and destination URLs, then narrow the result.') }}</p>
					</div>
					<NcTextField v-model="searchQuery" type="search" :label="t('shortlinks', 'Search')" />
					<div class="popover-grid">
						<label>
							<span>{{ t('shortlinks', 'Created') }}</span>
							<select v-model="agePeriod">
								<option value="any">{{ t('shortlinks', 'Any time') }}</option>
								<option value="day">{{ t('shortlinks', 'Last 24 hours') }}</option>
								<option value="week">{{ t('shortlinks', 'Last 7 days') }}</option>
								<option value="month">{{ t('shortlinks', 'Last 30 days') }}</option>
								<option value="year">{{ t('shortlinks', 'Last year') }}</option>
							</select>
						</label>
						<label>
							<span>{{ t('shortlinks', 'Status') }}</span>
							<select v-model="activeFilter">
								<option value="all">{{ t('shortlinks', 'Any status') }}</option>
								<option value="active">{{ t('shortlinks', 'Active') }}</option>
								<option value="inactive">{{ t('shortlinks', 'Inactive') }}</option>
							</select>
						</label>
					</div>
					<div class="popover-actions">
						<NcButton type="button" @click="clearSearch">
							{{ t('shortlinks', 'Reset') }}
						</NcButton>
						<NcButton type="submit" variant="primary">
							{{ t('shortlinks', 'Apply search') }}
						</NcButton>
					</div>
				</form>
			</NcPopover>

			<NcActions force-menu
				force-name
				:menu-name="t('shortlinks', 'Export')"
				:aria-label="t('shortlinks', 'Export and import')"
				variant="tertiary">
				<template #icon>
					<NcIconSvgWrapper :path="mdiExportVariant" />
				</template>
				<NcActionButton :name="t('shortlinks', 'Export CSV')" @click="exportLinks('csv')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiFileDelimitedOutline" />
					</template>
				</NcActionButton>
				<NcActionButton :name="t('shortlinks', 'Export JSON')" @click="exportLinks('json')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiCodeJson" />
					</template>
				</NcActionButton>
				<NcActionButton :name="t('shortlinks', 'Import CSV or JSON')" @click="importInput?.click()">
					<template #icon>
						<NcIconSvgWrapper :path="mdiFileImportOutline" />
					</template>
				</NcActionButton>
			</NcActions>
			<input ref="importInput"
				class="import-input"
				type="file"
				accept=".csv,.json,text/csv,application/json"
				@change="importFile">

			<NcButton variant="tertiary" @click="emit('overview')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiChartBoxOutline" />
				</template>
				{{ t('shortlinks', 'Statistics') }}
			</NcButton>

			<NcPopover v-model:shown="tagOpen" placement="bottom-end" popup-role="dialog">
				<template #trigger="{ attrs }">
					<NcButton v-bind="attrs" variant="tertiary" :pressed="hasTagFilters">
						<template #icon>
							<NcIconSvgWrapper :path="mdiTagMultipleOutline" />
						</template>
						{{ t('shortlinks', 'Tags') }}<span v-if="tagIds.length"> ({{ tagIds.length }})</span>
					</NcButton>
				</template>
				<form class="toolbar-popover tag-popover" @submit.prevent="applyTags">
					<div>
						<h2>{{ t('shortlinks', 'Filter by tags') }}</h2>
						<p>{{ t('shortlinks', 'Combine one or more tags to narrow this view.') }}</p>
					</div>
					<div v-if="tags.length" class="tag-filter-list">
						<NcCheckboxRadioSwitch v-for="tag in tags"
							:key="tag.id"
							type="checkbox"
							:model-value="localTagIds.includes(tag.id)"
							@update:model-value="toggleLocalTag(tag.id)">
							<span class="tag-filter-label">
								<span v-if="tag.color"
									class="tag-filter-dot"
									:style="{ backgroundColor: tag.color }"
									aria-hidden="true" />
								{{ tag.name }} <span class="tag-filter-count">{{ tag.count }}</span>
							</span>
						</NcCheckboxRadioSwitch>
					</div>
					<p v-else class="empty-popover">
						{{ t('shortlinks', 'No tags yet') }}
					</p>
					<fieldset v-if="tags.length" class="tag-mode">
						<legend>{{ t('shortlinks', 'Tag matching') }}</legend>
						<NcCheckboxRadioSwitch v-model="localTagMode"
							type="radio"
							value="and"
							name="tag-mode">
							{{ t('shortlinks', 'All selected tags') }}
						</NcCheckboxRadioSwitch>
						<NcCheckboxRadioSwitch v-model="localTagMode"
							type="radio"
							value="or"
							name="tag-mode">
							{{ t('shortlinks', 'Any selected tag') }}
						</NcCheckboxRadioSwitch>
					</fieldset>
					<div class="popover-actions">
						<NcButton type="button" @click="clearTags">
							{{ t('shortlinks', 'Reset') }}
						</NcButton>
						<NcButton type="submit" variant="primary">
							{{ t('shortlinks', 'Apply filters') }}
						</NcButton>
					</div>
				</form>
			</NcPopover>
		</div>
	</header>
</template>

<style scoped>
.content-toolbar {
	position: sticky;
	inset-block-start: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: calc(var(--default-grid-baseline) * 3);
	min-block-size: 60px;
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 4);
	border-block-end: 1px solid var(--color-border);
	background: var(--color-main-background);
}

.content-toolbar__left,
.content-toolbar__actions {
	display: flex;
	align-items: center;
	gap: var(--default-grid-baseline);
	min-inline-size: 0;
}

.import-input {
	display: none;
}

.content-toolbar__left {
	flex: 1 1 auto;
}

.content-toolbar__left :deep(.breadcrumb) {
	min-inline-size: 0;
}

.content-toolbar__actions {
	flex: 0 0 auto;
}

.toolbar-popover {
	display: grid;
	inline-size: min(440px, calc(100vw - 32px));
	gap: calc(var(--default-grid-baseline) * 3);
	padding: calc(var(--default-grid-baseline) * 4);
}

.toolbar-popover h2,
.toolbar-popover p {
	margin: 0;
}

.toolbar-popover p {
	margin-block-start: var(--default-grid-baseline);
	color: var(--color-text-maxcontrast);
}

.popover-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: calc(var(--default-grid-baseline) * 3);
}

.popover-grid label {
	display: grid;
	gap: var(--default-grid-baseline);
	font-weight: 600;
}

.popover-grid select {
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

.popover-actions {
	display: flex;
	justify-content: flex-end;
	gap: calc(var(--default-grid-baseline) * 2);
}

.tag-filter-list {
	display: grid;
	max-block-size: 240px;
	overflow: auto;
	gap: var(--default-grid-baseline);
}

.tag-filter-label {
	display: inline-flex;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 2);
}

.tag-filter-dot {
	inline-size: 10px;
	block-size: 10px;
	border: 1px solid var(--color-border-dark);
	border-radius: 50%;
}

.tag-filter-count {
	color: var(--color-text-maxcontrast);
	font-variant-numeric: tabular-nums;
}

.tag-mode {
	display: grid;
	gap: var(--default-grid-baseline);
	margin: 0;
	padding: calc(var(--default-grid-baseline) * 3) 0 0;
	border: 0;
	border-block-start: 1px solid var(--color-border);
}

.tag-mode legend {
	margin-block-end: var(--default-grid-baseline);
	font-weight: 600;
}

.empty-popover {
	padding-block: calc(var(--default-grid-baseline) * 3);
	text-align: center;
}

@media (max-width: 950px) {
	.content-toolbar {
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.content-toolbar__actions {
		inline-size: 100%;
		overflow-x: auto;
	}
}

@media (max-width: 620px) {
	.content-toolbar {
		padding-inline: calc(var(--default-grid-baseline) * 2);
	}

	.popover-grid {
		grid-template-columns: 1fr;
	}
}
</style>
