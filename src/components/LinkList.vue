<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	mdiArrowDown, mdiArrowUp, mdiContentCopy, mdiContentDuplicate, mdiDeleteOutline, mdiQrcode,
	mdiRestore, mdiStar, mdiSwapVertical, mdiViewGridOutline, mdiViewListOutline,
} from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActionLink from '@nextcloud/vue/components/NcActionLink'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'
import type { Folder, ShortLink, Tag } from '../types'
import BulkActionsBar from './BulkActionsBar.vue'
import BulkDestinationDialog from './BulkDestinationDialog.vue'
import BulkTagDialog from './BulkTagDialog.vue'
import CompactLinkCard from './CompactLinkCard.vue'
import LinkThumbnail from './LinkThumbnail.vue'

const props = withDefaults(defineProps<{ links: ShortLink[]; folders: Folder[]; tags: Tag[]; loading: boolean; error: string; selected: Set<number>; hasMore: boolean; system: string; sort: string; direction: 'ASC' | 'DESC'; useThumbnails?: boolean }>(), { useThumbnails: true })
const emit = defineEmits<{
	create: []
	open: [link: ShortLink]
	toggle: [id: number]
	selectAll: [ids: number[]]
	refresh: []
	bulk: [changes: Record<string, unknown>]
	more: []
	options: [value: { sort?: string; direction?: 'ASC' | 'DESC' }]
}>()
const storedMode = window.localStorage?.getItem('shortlinks-view-mode')
const viewMode = ref<'table' | 'grid'>(storedMode === 'grid' ? 'grid' : 'table')
const showDestination = ref(false)
const showTags = ref(false)
const editableIds = computed(() => props.links.filter(link => link.canEdit).map(link => link.id))
const allSelected = computed(() => editableIds.value.length > 0 && editableIds.value.every(id => props.selected.has(id)))
const someSelected = computed(() => props.selected.size > 0 && !allSelected.value)
const selectedIds = computed(() => [...props.selected])

async function copy(text: string) {
	try { await navigator.clipboard.writeText(text); showSuccess(t('shortlinks', 'Copied')) } catch { showError(t('shortlinks', 'Could not copy')) }
}
async function remove(link: ShortLink) { try { await api.deleteLink(link.id); emit('refresh') } catch (error) { showError(error instanceof Error ? error.message : String(error)) } }
async function restore(link: ShortLink) { try { await api.restoreLink(link.id); emit('refresh') } catch (error) { showError(error instanceof Error ? error.message : String(error)) } }
async function removePermanently(link: ShortLink) { if (!window.confirm(t('shortlinks', 'Permanently delete this link?'))) return; try { await api.deleteLink(link.id, true); emit('refresh') } catch (error) { showError(error instanceof Error ? error.message : String(error)) } }
async function clone(link: ShortLink) { try { await api.cloneLink(link.id); showSuccess(t('shortlinks', 'Link duplicated')); emit('refresh') } catch (error) { showError(error instanceof Error ? error.message : String(error)) } }

function setViewMode(mode: 'table' | 'grid') { viewMode.value = mode; window.localStorage?.setItem('shortlinks-view-mode', mode) }
function toggleAll() { emit('selectAll', allSelected.value || someSelected.value ? [] : editableIds.value) }
function clearSelection() { emit('selectAll', []) }

function setSort(field: string) {
	if (props.sort === field) { emit('options', { direction: props.direction === 'ASC' ? 'DESC' : 'ASC' }); return }
	const descendingByDefault = ['click_count', 'created_at', 'updated_at', 'last_clicked_at'].includes(field)
	emit('options', { sort: field, direction: descendingByDefault ? 'DESC' : 'ASC' })
}
function sortIcon(field: string): string { if (props.sort !== field) return mdiSwapVertical; return props.direction === 'ASC' ? mdiArrowUp : mdiArrowDown }
function ariaSort(field: string): 'ascending' | 'descending' | 'none' { if (props.sort !== field) return 'none'; return props.direction === 'ASC' ? 'ascending' : 'descending' }
function formatTimestamp(timestamp: number | null): string { if (timestamp === null) return '—'; return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(timestamp * 1000)) }
function visibleDateField(): 'created_at' | 'last_clicked_at' | 'updated_at' { if (props.sort === 'created_at' || props.sort === 'last_clicked_at') return props.sort; return 'updated_at' }
function visibleDateLabel(): string { if (visibleDateField() === 'created_at') return t('shortlinks', 'Created'); if (visibleDateField() === 'last_clicked_at') return t('shortlinks', 'Last used'); return t('shortlinks', 'Updated') }
function visibleTimestamp(link: ShortLink): number | null { if (visibleDateField() === 'created_at') return link.createdAt; if (visibleDateField() === 'last_clicked_at') return link.lastClickedAt; return link.updatedAt }
function folderFor(link: ShortLink): Folder | undefined { return props.folders.find(folder => folder.id === link.folderId) }

function applyBulk(changes: Record<string, unknown>) { emit('bulk', changes); showDestination.value = false; showTags.value = false }
function applyDestination(value: { mode: 'move' | 'copy'; folderId: number | null }) { applyBulk(value.mode === 'copy' ? { action: 'copy', folderId: value.folderId } : { folderId: value.folderId }) }
function downloadQrCodes() { const anchor = document.createElement('a'); anchor.href = api.bulkQrUrl(selectedIds.value); anchor.download = 'shortlinks-qr-codes.zip'; anchor.click() }
async function exportSelection(format: 'csv' | 'json') {
	try {
		const result = await api.exportLinks(format, { linkIds: selectedIds.value })
		const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }))
		const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename; anchor.click(); URL.revokeObjectURL(url)
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) }
}
</script>

<template>
	<section class="links-view" :aria-label="t('shortlinks', 'Short links')">
		<div class="list-view-controls" :class="{ 'has-selection': selected.size }">
			<BulkActionsBar v-if="selected.size"
				:count="selected.size"
				:system="system"
				@clear="clearSelection"
				@favorite="applyBulk({ favorite: true })"
				@tags="showTags = true"
				@destination="showDestination = true"
				@qr="downloadQrCodes"
				@export="exportSelection"
				@delete="applyBulk({ action: 'trash' })"
				@restore="applyBulk({ action: 'restore' })" />
			<template v-else>
				<div v-if="viewMode === 'grid'" class="grid-sort-controls">
					<input type="checkbox"
						:checked="allSelected"
						:indeterminate="someSelected"
						:aria-label="t('shortlinks', 'Select all')"
						@change="toggleAll">
					<span>{{ t('shortlinks', 'Sort by') }}</span>
					<NcButton v-for="option in [{ id: 'title', label: 'Title' }, { id: 'slug', label: 'Alias' }, { id: 'click_count', label: 'Clicks' }, { id: 'updated_at', label: 'Updated' }]"
						:key="option.id"
						variant="tertiary"
						:pressed="sort === option.id"
						@click="setSort(option.id)">
						{{ t('shortlinks', option.label) }}<template #icon>
							<NcIconSvgWrapper :path="sortIcon(option.id)" />
						</template>
					</NcButton>
				</div>
				<span v-else class="list-view-controls__spacer" />
				<div class="view-mode-switch" role="group" :aria-label="t('shortlinks', 'View')">
					<NcButton variant="tertiary"
						:pressed="viewMode === 'table'"
						:aria-label="t('shortlinks', 'Table view')"
						:title="t('shortlinks', 'Table view')"
						@click="setViewMode('table')">
						<template #icon>
							<NcIconSvgWrapper :path="mdiViewListOutline" />
						</template>
					</NcButton>
					<NcButton variant="tertiary"
						:pressed="viewMode === 'grid'"
						:aria-label="t('shortlinks', 'Card view')"
						:title="t('shortlinks', 'Card view')"
						@click="setViewMode('grid')">
						<template #icon>
							<NcIconSvgWrapper :path="mdiViewGridOutline" />
						</template>
					</NcButton>
				</div>
			</template>
		</div>

		<NcLoadingIcon v-if="loading" :size="48" :name="t('shortlinks', 'Loading links')" />
		<p v-else-if="error" class="error" role="alert">
			{{ error }} <NcButton @click="emit('refresh')">
				{{ t('shortlinks', 'Retry') }}
			</NcButton>
		</p>
		<NcEmptyContent v-else-if="links.length === 0" :name="t('shortlinks', 'No short links yet')" :description="t('shortlinks', 'Create your first short link to get started.')">
			<template #action>
				<NcButton variant="primary" @click="emit('create')">
					{{ t('shortlinks', 'Create short link') }}
				</NcButton>
			</template>
		</NcEmptyContent>

		<div v-else-if="viewMode === 'table'" class="table-scroll">
			<table>
				<colgroup><col class="select-column"><col class="title-column"><col><col class="target-column"><col><col><col><col><col></colgroup>
				<thead v-if="selected.size === 0">
					<tr>
						<th>
							<input type="checkbox"
								:checked="allSelected"
								:indeterminate="someSelected"
								:aria-label="t('shortlinks', 'Select all')"
								@change="toggleAll">
						</th>
						<th :aria-sort="ariaSort('title')">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${t('shortlinks', 'Title')}`" @click="setSort('title')">
								<span>{{ t('shortlinks', 'Title') }}</span><NcIconSvgWrapper :path="sortIcon('title')" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th :aria-sort="ariaSort('slug')">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${t('shortlinks', 'Alias')}`" @click="setSort('slug')">
								<span>{{ t('shortlinks', 'Short link') }}</span><NcIconSvgWrapper :path="sortIcon('slug')" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th>{{ t('shortlinks', 'Target') }}</th><th>{{ t('shortlinks', 'Tags') }}</th>
						<th :aria-sort="ariaSort('click_count')">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${t('shortlinks', 'Clicks')}`" @click="setSort('click_count')">
								<span>{{ t('shortlinks', 'Clicks') }}</span><NcIconSvgWrapper :path="sortIcon('click_count')" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th :aria-sort="ariaSort(visibleDateField())">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${visibleDateLabel()}`" @click="setSort(visibleDateField())">
								<span>{{ visibleDateLabel() }}</span><NcIconSvgWrapper :path="sortIcon(visibleDateField())" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th>{{ t('shortlinks', 'Status') }}</th><th>{{ t('shortlinks', 'Actions') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="link in links" :key="link.id" :class="{ 'is-selected': selected.has(link.id) }">
						<td>
							<input type="checkbox"
								:checked="selected.has(link.id)"
								:disabled="!link.canEdit"
								:aria-label="t('shortlinks', 'Select {title}', { title: link.title || link.slug })"
								@change="emit('toggle', link.id)">
						</td>
						<td>
							<button class="table-link-identity" @click="emit('open', link)">
								<LinkThumbnail v-if="useThumbnails"
									size="small"
									:src="link.thumbnailMediaUrl || (link.thumbnailUrl ? api.thumbnailUrl(link.id) : '')"
									alt="" /><span><strong>{{ link.title || link.slug }}</strong><small>{{ `.../${link.slug}` }}</small></span><NcIconSvgWrapper v-if="link.favorite"
										:path="mdiStar"
										:size="17"
										aria-hidden="true" />
							</button>
						</td>
						<td>
							<button class="copy-value" @click="copy(link.shortUrl)">
								{{ link.slug }}
							</button>
						</td>
						<td><a :href="link.targetUrl" target="_blank" rel="noopener noreferrer">{{ link.targetUrl }}</a></td>
						<td>
							<span v-for="tag in link.tags" :key="tag.id" class="tag-chip"><span v-if="tag.color"
								class="tag-dot"
								:style="{ backgroundColor: tag.color }"
								aria-hidden="true" />{{ tag.name }}</span>
						</td>
						<td>{{ link.clickCount }}</td><td>{{ formatTimestamp(visibleTimestamp(link)) }}</td><td>{{ link.active ? t('shortlinks', 'Active') : t('shortlinks', 'Inactive') }}</td>
						<td class="row-actions">
							<NcActions force-menu :aria-label="t('shortlinks', 'Actions for {title}', { title: link.title || link.slug })">
								<NcActionLink name="QR" :href="api.qrUrl(link.id)" target="_blank">
									<template #icon>
										<NcIconSvgWrapper :path="mdiQrcode" />
									</template>
								</NcActionLink>
								<NcActionButton :name="t('shortlinks', 'Copy link')" @click="copy(link.shortUrl)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiContentCopy" />
									</template>
								</NcActionButton>
								<NcActionButton v-if="!link.deletedAt" :name="t('shortlinks', 'Duplicate')" @click="clone(link)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiContentDuplicate" />
									</template>
								</NcActionButton>
								<NcActionButton v-if="link.deletedAt && link.canEdit" :name="t('shortlinks', 'Restore')" @click="restore(link)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiRestore" />
									</template>
								</NcActionButton>
								<NcActionButton v-if="link.deletedAt && link.canEdit" :name="t('shortlinks', 'Delete permanently')" @click="removePermanently(link)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiDeleteOutline" />
									</template>
								</NcActionButton>
								<NcActionButton v-else-if="link.canEdit" :name="t('shortlinks', 'Delete')" @click="remove(link)">
									<template #icon>
										<NcIconSvgWrapper :path="mdiDeleteOutline" />
									</template>
								</NcActionButton>
							</NcActions>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-else class="link-card-grid">
			<CompactLinkCard v-for="link in links"
				:key="link.id"
				:link="link"
				:folder="folderFor(link)"
				selectable
				:selected="selected.has(link.id)"
				:show-thumbnail="useThumbnails"
				@open="emit('open', $event)"
				@toggle="emit('toggle', $event)" />
		</div>
		<NcButton v-if="hasMore"
			class="load-more"
			:disabled="loading"
			@click="emit('more')">
			{{ t('shortlinks', 'Load more') }}
		</NcButton>

		<BulkDestinationDialog v-if="showDestination"
			:folders="folders"
			:count="selected.size"
			@close="showDestination = false"
			@apply="applyDestination" />
		<BulkTagDialog v-if="showTags"
			:tags="tags"
			:count="selected.size"
			@close="showTags = false"
			@apply="applyBulk" />
	</section>
</template>

<style scoped>
.links-view { display: grid; min-inline-size: 0; }

.list-view-controls { position: sticky; inset-block-start: 60px; z-index: 5; display: flex; align-items: center; justify-content: flex-end; min-block-size: 52px; padding: 2px calc(var(--default-grid-baseline) * 4); border-block-end: 1px solid var(--color-border); background: var(--color-main-background); }

.list-view-controls.has-selection { padding: 0; }

.list-view-controls__spacer, .grid-sort-controls { flex: 1; }

.grid-sort-controls, .view-mode-switch { display: flex; align-items: center; gap: var(--default-grid-baseline); }

.grid-sort-controls { min-inline-size: 0; overflow-x: auto; }

.grid-sort-controls > input { flex: 0 0 auto; inline-size: 20px; block-size: 20px; margin: 0 calc(var(--default-grid-baseline) * 2) 0 0; }

.view-mode-switch { flex: 0 0 auto; margin-inline-start: calc(var(--default-grid-baseline) * 2); }

.table-scroll { inline-size: 100%; overflow: auto; }

table { inline-size: 100%; border-collapse: collapse; table-layout: fixed; }

thead { position: sticky; inset-block-start: 112px; z-index: 3; background: var(--color-main-background); }

th, td { padding: calc(var(--default-grid-baseline) * 2); border-block-end: 1px solid var(--color-border); text-align: start; vertical-align: middle; }

tbody tr.is-selected { background: var(--color-primary-element-light); }

.select-column { inline-size: 48px; }

.title-column { inline-size: min(280px, 24vw); }

.target-column { inline-size: min(300px, 24vw); }

.table-sort-button { display: inline-flex; align-items: center; gap: var(--default-grid-baseline); margin: 0; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; font-weight: 600; cursor: pointer; }

.table-link-identity { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; inline-size: 100%; min-inline-size: 0; gap: calc(var(--default-grid-baseline) * 2); margin: 0; padding: 0; border: 0; background: transparent; color: inherit; text-align: start; cursor: pointer; }

.table-link-identity > span { display: grid; min-inline-size: 0; }

.table-link-identity strong, .table-link-identity small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.table-link-identity small { color: var(--color-primary-element); }

td > a { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.copy-value { margin: 0; padding: 0; border: 0; background: transparent; color: var(--color-primary-element); cursor: pointer; }

.tag-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; margin: 2px; border: 1px solid var(--color-border); border-radius: 999px; font-size: .85rem; }

.tag-dot { inline-size: 8px; block-size: 8px; border-radius: 50%; }

.link-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); gap: calc(var(--default-grid-baseline) * 3); padding: calc(var(--default-grid-baseline) * 4); }

.load-more { justify-self: center; margin: calc(var(--default-grid-baseline) * 4); }

.error { justify-self: center; }
@media (max-width: 900px) { .grid-sort-controls > span { display: none; } .target-column, th:nth-child(4), td:nth-child(4), th:nth-child(5), td:nth-child(5) { display: none; } }
</style>
