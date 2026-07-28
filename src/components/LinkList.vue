<script setup lang="ts">
import { ref } from 'vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { ShortLink } from '../types'

defineProps<{ links: ShortLink[]; loading: boolean; error: string; selected: Set<number> }>()
const emit = defineEmits<{ open: [link: ShortLink]; toggle: [id: number]; refresh: []; search: [query: string]; bulk: [changes: Record<string, unknown>] }>()
const query = ref('')
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
		</header>
		<div v-if="selected.size"
			class="bulk-toolbar"
			role="toolbar"
			:aria-label="t('shortlinks', 'Bulk actions')">
			<span>{{ selected.size }} {{ t('shortlinks', 'selected') }}</span><NcButton @click="emit('bulk', { active: true })">
				{{ t('shortlinks', 'Activate') }}
			</NcButton><NcButton @click="emit('bulk', { active: false })">
				{{ t('shortlinks', 'Deactivate') }}
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
							</NcButton><NcButton @click="remove(link)">
								{{ t('shortlinks', 'Delete') }}
							</NcButton>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
