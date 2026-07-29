<script setup lang="ts">
import { ref } from 'vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { Folder, ShortLink, Tag } from '../types'

const props = defineProps<{ links: ShortLink[]; folders: Folder[]; tags: Tag[]; loading: boolean; error: string; selected: Set<number>; hasMore: boolean; system: string; folderId: number | null; tagIds: number[]; sort: string; direction: 'ASC' | 'DESC'; tagMode: 'and' | 'or' }>()
const emit = defineEmits<{ open: [link: ShortLink]; toggle: [id: number]; refresh: []; search: [query: string]; bulk: [changes: Record<string, unknown>]; more: []; overview: []; options: [value: { sort?: string; direction?: 'ASC' | 'DESC'; tagMode?: 'and' | 'or' }] }>()
const query = ref('')
const bulkFolderId = ref<number | null>(null); const bulkTagId = ref<number | null>(null)
const bookmarklet = ref('')
/**
 *
 * @param text Value to copy
 */
async function copy(text: string) { try { await navigator.clipboard.writeText(text); showSuccess(t('shortlinks', 'Copied')) } catch { showError(t('shortlinks', 'Could not copy')) } }
/**
 *
 * @param link Link to move to trash
 */
async function remove(link: ShortLink) { try { await api.deleteLink(link.id); emit('refresh') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function restore(link: ShortLink) { try { await api.restoreLink(link.id); emit('refresh') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function removePermanently(link: ShortLink) { if (!window.confirm(t('shortlinks', 'Permanently delete this link?'))) return; try { await api.deleteLink(link.id, true); emit('refresh') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function clone(link: ShortLink) { try { await api.cloneLink(link.id); showSuccess(t('shortlinks', 'Link duplicated')); emit('refresh') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function exportLinks(format: 'csv' | 'json') { try { const result = await api.exportLinks(format, { system: props.system, folderId: props.folderId ?? undefined, tagIds: props.tagIds, tagMode: props.tagMode, search: query.value }); const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename; anchor.click(); URL.revokeObjectURL(url) } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
async function importFile(event: Event) { const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return; try { if (file.size > 5 * 1024 * 1024) throw new Error(t('shortlinks', 'Import files are limited to 5 MiB')); const format = file.name.toLowerCase().endsWith('.json') ? 'json' : 'csv'; const content = await file.text(); const preview = await api.importLinks(format, content, true, 'skip') as { created?: number; errors?: unknown[] }; if (!window.confirm(t('shortlinks', 'The dry run found {count} valid rows. Continue with import?', { count: preview.created ?? 0 }))) return; const result = await api.importLinks(format, content, false, 'skip') as { created?: number }; showSuccess(t('shortlinks', 'Imported {count} links', { count: result.created ?? 0 })); emit('refresh') } catch (e) { showError(e instanceof Error ? e.message : String(e)) } finally { input.value = '' } }
async function loadBookmarklet() { try { bookmarklet.value = (await api.bookmarklet()).code } catch (e) { showError(e instanceof Error ? e.message : String(e)) } }
</script>

<template>
	<section class="links-view" aria-labelledby="links-heading">
		<header class="links-toolbar">
			<h2 id="links-heading">
				{{ t('shortlinks', 'Shortlinks') }}
			</h2><NcTextField v-model="query"
				type="search"
				:label="t('shortlinks', 'Search')"
				@keyup.enter="emit('search', query)" />
			<NcButton @click="exportLinks('csv')">
				{{ t('shortlinks', 'Export CSV') }}
			</NcButton><NcButton @click="exportLinks('json')">
				{{ t('shortlinks', 'Export JSON') }}
			</NcButton><NcButton @click="emit('overview')">
				{{ t('shortlinks', 'Statistics overview') }}
			</NcButton><label class="file-button">{{ t('shortlinks', 'Import CSV or JSON') }}<input type="file" accept=".csv,.json,text/csv,application/json" @change="importFile"></label><NcButton @click="loadBookmarklet">
				{{ t('shortlinks', 'Bookmarklet') }}
			</NcButton><a v-if="bookmarklet"
				:href="bookmarklet"
				class="bookmarklet"
				draggable="true">{{ t('shortlinks', 'Drag Shortlinks to your bookmarks') }}</a>
		</header>
		<div class="list-options">
			<label>{{ t('shortlinks', 'Sort by') }}<select :value="sort" @change="emit('options', { sort: ($event.target as HTMLSelectElement).value })"><option value="updated_at">{{ t('shortlinks', 'Updated') }}</option><option value="created_at">{{ t('shortlinks', 'Created') }}</option><option value="last_clicked_at">{{ t('shortlinks', 'Last used') }}</option><option value="click_count">{{ t('shortlinks', 'Clicks') }}</option><option value="title">{{ t('shortlinks', 'Title') }}</option><option value="slug">{{ t('shortlinks', 'Alias') }}</option></select></label>
			<label>{{ t('shortlinks', 'Direction') }}<select :value="direction" @change="emit('options', { direction: ($event.target as HTMLSelectElement).value as 'ASC' | 'DESC' })"><option value="DESC">{{ t('shortlinks', 'Descending') }}</option><option value="ASC">{{ t('shortlinks', 'Ascending') }}</option></select></label>
			<label>{{ t('shortlinks', 'Tag matching') }}<select :value="tagMode" @change="emit('options', { tagMode: ($event.target as HTMLSelectElement).value as 'and' | 'or' })"><option value="and">{{ t('shortlinks', 'All selected tags') }}</option><option value="or">{{ t('shortlinks', 'Any selected tag') }}</option></select></label>
		</div>
		<div v-if="selected.size"
			class="bulk-toolbar"
			role="toolbar"
			:aria-label="t('shortlinks', 'Bulk actions')">
			<span>{{ selected.size }} {{ t('shortlinks', 'selected') }}</span><NcButton @click="emit('bulk', { active: true })">
				{{ t('shortlinks', 'Activate') }}
			</NcButton><NcButton @click="emit('bulk', { active: false })">
				{{ t('shortlinks', 'Deactivate') }}
			</NcButton><NcButton v-if="system === 'trash'" @click="emit('bulk', { action: 'restore' })">
				{{ t('shortlinks', 'Restore') }}
			</NcButton><NcButton v-else @click="emit('bulk', { action: 'trash' })">
				{{ t('shortlinks', 'Move to trash') }}
			</NcButton>
			<label>{{ t('shortlinks', 'Move to folder') }}<select v-model="bulkFolderId"><option :value="null">{{ t('shortlinks', 'No folder') }}</option><option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option></select></label><NcButton @click="emit('bulk', { folderId: bulkFolderId })">
				{{ t('shortlinks', 'Move') }}
			</NcButton>
			<label>{{ t('shortlinks', 'Add tag') }}<select v-model="bulkTagId"><option :value="null">—</option><option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option></select></label><NcButton :disabled="bulkTagId === null" @click="emit('bulk', { addTagIds: [bulkTagId] })">
				{{ t('shortlinks', 'Add tag') }}
			</NcButton>
		</div>
		<NcLoadingIcon v-if="loading" :size="48" :name="t('shortlinks', 'Loading links')" />
		<p v-else-if="error" class="error" role="alert">
			{{ error }} <NcButton @click="emit('refresh')">
				{{ t('shortlinks', 'Retry') }}
			</NcButton>
		</p>
		<NcEmptyContent v-else-if="links.length === 0" :name="t('shortlinks', 'No short links yet')" :description="t('shortlinks', 'Create your first short link to get started.')" />
		<div v-else class="table-scroll">
			<table>
				<thead><tr><th><span class="visually-hidden">{{ t('shortlinks', 'Select') }}</span></th><th>{{ t('shortlinks', 'Title') }}</th><th>{{ t('shortlinks', 'Short link') }}</th><th>{{ t('shortlinks', 'Target') }}</th><th>{{ t('shortlinks', 'Tags') }}</th><th>{{ t('shortlinks', 'Clicks') }}</th><th>{{ t('shortlinks', 'Status') }}</th><th>{{ t('shortlinks', 'Actions') }}</th></tr></thead><tbody>
					<tr v-for="link in links" :key="link.id">
						<td>
							<input type="checkbox"
								:checked="selected.has(link.id)"
								:disabled="!link.canEdit"
								:aria-label="t('shortlinks', 'Select {title}', { title: link.title || link.slug })"
								@change="emit('toggle', link.id)">
						</td><td>
							<button class="link-title" @click="emit('open', link)">
								{{ link.title || link.slug }}
							</button>
						</td><td>
							<button class="copy-value" @click="copy(link.shortUrl)">
								{{ link.slug }}
							</button>
						</td><td><a :href="link.targetUrl" target="_blank" rel="noopener noreferrer">{{ link.targetUrl }}</a></td><td>
							<span v-for="tag in link.tags" :key="tag.id" class="tag-chip"><span v-if="tag.color"
								class="tag-dot"
								:style="{ backgroundColor: tag.color }"
								aria-hidden="true" />{{ tag.name }}</span>
						</td><td>{{ link.clickCount }}</td><td>{{ link.active ? t('shortlinks', 'Active') : t('shortlinks', 'Inactive') }}</td><td class="row-actions">
							<NcButton :href="api.qrUrl(link.id)" target="_blank">
								QR
							</NcButton><NcButton @click="copy(link.targetUrl)">
								{{ t('shortlinks', 'Copy target') }}
							</NcButton><NcButton v-if="!link.deletedAt" @click="clone(link)">
								{{ t('shortlinks', 'Duplicate') }}
							</NcButton><NcButton v-if="link.deletedAt && link.canEdit" @click="restore(link)">
								{{ t('shortlinks', 'Restore') }}
							</NcButton><NcButton v-if="link.deletedAt && link.canEdit" @click="removePermanently(link)">
								{{ t('shortlinks', 'Delete permanently') }}
							</NcButton><NcButton v-else-if="link.canEdit" @click="remove(link)">
								{{ t('shortlinks', 'Delete') }}
							</NcButton>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<NcButton v-if="hasMore" :disabled="loading" @click="emit('more')">
			{{ t('shortlinks', 'Load more') }}
		</NcButton>
	</section>
</template>
