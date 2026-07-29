<script setup lang="ts">
import { ref } from 'vue'
import {
	mdiArrowDown,
	mdiArrowUp,
	mdiContentCopy,
	mdiContentDuplicate,
	mdiDeleteOutline,
	mdiQrcode,
	mdiRestore,
	mdiSwapVertical,
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

const props = defineProps<{ links: ShortLink[]; folders: Folder[]; tags: Tag[]; loading: boolean; error: string; selected: Set<number>; hasMore: boolean; system: string; sort: string; direction: 'ASC' | 'DESC' }>()
const emit = defineEmits<{ create: []; open: [link: ShortLink]; toggle: [id: number]; refresh: []; bulk: [changes: Record<string, unknown>]; more: []; options: [value: { sort?: string; direction?: 'ASC' | 'DESC' }] }>()
const bulkFolderId = ref<number | null>(null); const bulkTagId = ref<number | null>(null)
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

function setSort(field: string) {
	if (props.sort === field) {
		emit('options', { direction: props.direction === 'ASC' ? 'DESC' : 'ASC' })
		return
	}
	const descendingByDefault = ['click_count', 'created_at', 'updated_at', 'last_clicked_at'].includes(field)
	emit('options', { sort: field, direction: descendingByDefault ? 'DESC' : 'ASC' })
}

function sortIcon(field: string): string {
	if (props.sort !== field) return mdiSwapVertical
	return props.direction === 'ASC' ? mdiArrowUp : mdiArrowDown
}

function ariaSort(field: string): 'ascending' | 'descending' | 'none' {
	if (props.sort !== field) return 'none'
	return props.direction === 'ASC' ? 'ascending' : 'descending'
}

function formatTimestamp(timestamp: number | null): string {
	if (timestamp === null) return '—'
	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(timestamp * 1000))
}

function visibleDateField(): 'created_at' | 'last_clicked_at' | 'updated_at' {
	if (props.sort === 'created_at' || props.sort === 'last_clicked_at') return props.sort
	return 'updated_at'
}

function visibleDateLabel(): string {
	if (visibleDateField() === 'created_at') return t('shortlinks', 'Created')
	if (visibleDateField() === 'last_clicked_at') return t('shortlinks', 'Last used')
	return t('shortlinks', 'Updated')
}

function visibleTimestamp(link: ShortLink): number | null {
	if (visibleDateField() === 'created_at') return link.createdAt
	if (visibleDateField() === 'last_clicked_at') return link.lastClickedAt
	return link.updatedAt
}
</script>

<template>
	<section class="links-view" :aria-label="t('shortlinks', 'Short links')">
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
		<NcEmptyContent v-else-if="links.length === 0" :name="t('shortlinks', 'No short links yet')" :description="t('shortlinks', 'Create your first short link to get started.')">
			<template #action>
				<NcButton variant="primary" @click="emit('create')">
					{{ t('shortlinks', 'Create short link') }}
				</NcButton>
			</template>
		</NcEmptyContent>
		<div v-else class="table-scroll">
			<table>
				<thead>
					<tr>
						<th><span class="visually-hidden">{{ t('shortlinks', 'Select') }}</span></th>
						<th :aria-sort="ariaSort('title')">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${t('shortlinks', 'Title')}`" @click="setSort('title')">
								<span>{{ t('shortlinks', 'Title') }}</span>
								<NcIconSvgWrapper :path="sortIcon('title')" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th :aria-sort="ariaSort('slug')">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${t('shortlinks', 'Alias')}`" @click="setSort('slug')">
								<span>{{ t('shortlinks', 'Short link') }}</span>
								<NcIconSvgWrapper :path="sortIcon('slug')" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th>{{ t('shortlinks', 'Target') }}</th>
						<th>{{ t('shortlinks', 'Tags') }}</th>
						<th :aria-sort="ariaSort('click_count')">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${t('shortlinks', 'Clicks')}`" @click="setSort('click_count')">
								<span>{{ t('shortlinks', 'Clicks') }}</span>
								<NcIconSvgWrapper :path="sortIcon('click_count')" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th :aria-sort="ariaSort(visibleDateField())">
							<button class="table-sort-button" :aria-label="`${t('shortlinks', 'Sort by')} ${visibleDateLabel()}`" @click="setSort(visibleDateField())">
								<span>{{ visibleDateLabel() }}</span>
								<NcIconSvgWrapper :path="sortIcon(visibleDateField())" :size="18" aria-hidden="true" />
							</button>
						</th>
						<th>{{ t('shortlinks', 'Status') }}</th>
						<th>{{ t('shortlinks', 'Actions') }}</th>
					</tr>
				</thead><tbody>
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
						</td><td>{{ link.clickCount }}</td>
						<td class="date-cell">
							{{ formatTimestamp(visibleTimestamp(link)) }}
						</td>
						<td>{{ link.active ? t('shortlinks', 'Active') : t('shortlinks', 'Inactive') }}</td><td class="row-actions">
							<NcActions force-menu :aria-label="t('shortlinks', 'Actions for {title}', { title: link.title || link.slug })">
								<NcActionLink name="QR" :href="api.qrUrl(link.id)" target="_blank">
									<template #icon>
										<NcIconSvgWrapper :path="mdiQrcode" />
									</template>
								</NcActionLink>
								<NcActionButton :name="t('shortlinks', 'Copy target')" @click="copy(link.targetUrl)">
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
		<NcButton v-if="hasMore" :disabled="loading" @click="emit('more')">
			{{ t('shortlinks', 'Load more') }}
		</NcButton>
	</section>
</template>
