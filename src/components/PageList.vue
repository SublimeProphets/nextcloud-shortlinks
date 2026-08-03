<script setup lang="ts">
import { ref } from 'vue'
import { mdiContentCopy, mdiDeleteOutline, mdiEarth, mdiLockOutline, mdiOpenInNew, mdiPencilOutline, mdiPlus, mdiRestore, mdiShieldAccountOutline, mdiViewGridOutline, mdiViewListOutline } from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import type { LinkPage } from '../types'

defineProps<{ pages: LinkPage[]; loading: boolean; trash?: boolean }>()
const emit = defineEmits<{ create: []; edit: [page: LinkPage]; delete: [page: LinkPage, permanent: boolean]; restore: [page: LinkPage] }>()
const view = ref<'table' | 'grid'>('table')
function accessIcon(page: LinkPage): string { if (page.accessMode === 'public') return mdiEarth; if (page.accessMode === 'restricted') return mdiShieldAccountOutline; return mdiLockOutline }
function accessLabel(page: LinkPage): string { return t('shortlinks', ({ private: 'Private', public: 'Public', password: 'Password protected', restricted: 'Selected users and groups' })[page.accessMode]) }
async function copy(page: LinkPage) { try { await navigator.clipboard.writeText(page.publicUrl); showSuccess(t('shortlinks', 'Copied')) } catch { showError(t('shortlinks', 'Could not copy')) } }
</script>

<template>
	<section class="page-list" aria-labelledby="pages-heading">
		<header>
			<div>
				<h1 id="pages-heading">
					{{ trash ? t('shortlinks', 'Deleted pages') : t('shortlinks', 'Pages') }}
				</h1><p>{{ trash ? t('shortlinks', 'Restore pages or delete them permanently.') : t('shortlinks', 'Share curated collections of short links with a single address.') }}</p>
			</div><div>
				<NcButton v-if="!trash" variant="primary" @click="emit('create')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'New page') }}
				</NcButton><div class="view-switch" role="group" :aria-label="t('shortlinks', 'View')">
					<NcButton variant="tertiary"
						:pressed="view === 'table'"
						:aria-label="t('shortlinks', 'Table view')"
						@click="view = 'table'">
						<template #icon>
							<NcIconSvgWrapper :path="mdiViewListOutline" />
						</template>
					</NcButton><NcButton variant="tertiary"
						:pressed="view === 'grid'"
						:aria-label="t('shortlinks', 'Grid view')"
						@click="view = 'grid'">
						<template #icon>
							<NcIconSvgWrapper :path="mdiViewGridOutline" />
						</template>
					</NcButton>
				</div>
			</div>
		</header>
		<NcLoadingIcon v-if="loading" :name="t('shortlinks', 'Loading pages')" />
		<NcEmptyContent v-else-if="!pages.length" :name="trash ? t('shortlinks', 'No deleted pages') : t('shortlinks', 'Create your first page')" :description="trash ? t('shortlinks', 'Deleted pages will appear here.') : t('shortlinks', 'Combine folders, tags, and hand-picked links in a shareable page.')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiViewGridOutline" />
			</template><template v-if="!trash" #action>
				<NcButton variant="primary" @click="emit('create')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiPlus" />
					</template>{{ t('shortlinks', 'New page') }}
				</NcButton>
			</template>
		</NcEmptyContent>
		<div v-else-if="view === 'table'" class="page-table-wrap">
			<table class="page-table">
				<thead><tr><th>{{ t('shortlinks', 'Page') }}</th><th>{{ t('shortlinks', 'Access') }}</th><th>{{ t('shortlinks', 'Sources') }}</th><th>{{ t('shortlinks', 'Updated') }}</th><th><span class="visually-hidden">{{ t('shortlinks', 'Actions') }}</span></th></tr></thead><tbody>
					<tr v-for="page in pages" :key="page.id">
						<td>
							<button type="button" class="page-identity" @click="trash ? undefined : emit('edit', page)">
								<span class="page-identity__mark" :style="{ background: page.theme.primary || 'var(--color-primary-element)' }">{{ page.title.slice(0, 1).toUpperCase() }}</span><span><strong>{{ page.title }}</strong><code>…/p/{{ page.slug }}</code></span>
							</button>
						</td><td><span class="access-label"><NcIconSvgWrapper :path="accessIcon(page)" :size="18" />{{ accessLabel(page) }}</span></td><td>{{ t('shortlinks', '{folders} folders, {tags} tags, {links} links', { folders: page.folderIds.length, tags: page.tagIds.length, links: page.linkIds.length }) }}</td><td>{{ new Date(page.updatedAt * 1000).toLocaleDateString() }}</td><td>
							<div class="row-actions">
								<template v-if="trash">
									<NcButton :aria-label="t('shortlinks', 'Restore')" @click="emit('restore', page)">
										<template #icon>
											<NcIconSvgWrapper :path="mdiRestore" />
										</template>
									</NcButton><NcButton :aria-label="t('shortlinks', 'Delete permanently')" @click="emit('delete', page, true)">
										<template #icon>
											<NcIconSvgWrapper :path="mdiDeleteOutline" />
										</template>
									</NcButton>
								</template><template v-else>
									<NcButton :aria-label="t('shortlinks', 'Copy page address')" @click="copy(page)">
										<template #icon>
											<NcIconSvgWrapper :path="mdiContentCopy" />
										</template>
									</NcButton><NcButton :href="page.publicUrl" target="_blank" :aria-label="t('shortlinks', 'Open page')">
										<template #icon>
											<NcIconSvgWrapper :path="mdiOpenInNew" />
										</template>
									</NcButton><NcButton :aria-label="t('shortlinks', 'Edit')" @click="emit('edit', page)">
										<template #icon>
											<NcIconSvgWrapper :path="mdiPencilOutline" />
										</template>
									</NcButton><NcButton :aria-label="t('shortlinks', 'Move to trash')" @click="emit('delete', page, false)">
										<template #icon>
											<NcIconSvgWrapper :path="mdiDeleteOutline" />
										</template>
									</NcButton>
								</template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-else class="page-grid">
			<article v-for="page in pages" :key="page.id" :style="{ '--page-accent': page.theme.primary || 'var(--color-primary-element)', '--page-bg': page.theme.background || 'var(--color-main-background)' }">
				<button type="button" class="page-card__main" @click="trash ? undefined : emit('edit', page)">
					<span class="page-card__mark">{{ page.title.slice(0, 1).toUpperCase() }}</span><strong>{{ page.title }}</strong><span>{{ page.lead || t('shortlinks', 'A curated collection of short links.') }}</span><code>…/p/{{ page.slug }}</code><small><NcIconSvgWrapper :path="accessIcon(page)" :size="16" />{{ accessLabel(page) }} · {{ new Date(page.updatedAt * 1000).toLocaleDateString() }}</small>
				</button><div class="page-card__actions">
					<template v-if="trash">
						<NcButton @click="emit('restore', page)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiRestore" />
							</template>{{ t('shortlinks', 'Restore') }}
						</NcButton><NcButton @click="emit('delete', page, true)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiDeleteOutline" />
							</template>
						</NcButton>
					</template><template v-else>
						<NcButton @click="copy(page)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiContentCopy" />
							</template>
						</NcButton><NcButton :href="page.publicUrl" target="_blank">
							<template #icon>
								<NcIconSvgWrapper :path="mdiOpenInNew" />
							</template>
						</NcButton><NcButton variant="primary" @click="emit('edit', page)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiPencilOutline" />
							</template>{{ t('shortlinks', 'Edit') }}
						</NcButton>
					</template>
				</div>
			</article>
		</div>
	</section>
</template>

<style scoped>
.page-list{display:grid;gap:20px;padding:clamp(16px,3vw,32px)}

.page-list>header{position:sticky;z-index:3;inset-block-start:0;display:flex;align-items:center;justify-content:space-between;gap:16px;padding-block:8px;background:var(--color-main-background)}

.page-list h1,.page-list p{margin:0}

.page-list header p{color:var(--color-text-maxcontrast)}

.page-list>header>div:last-child,.view-switch,.row-actions{display:flex;align-items:center;gap:6px}

.page-table-wrap{overflow-x:auto;border:1px solid var(--color-border);border-radius:var(--border-radius-large)}

.page-table{inline-size:100%;border-collapse:collapse}

.page-table th,.page-table td{padding:10px 12px;border-block-end:1px solid var(--color-border);text-align:start;white-space:nowrap}

.page-table tbody tr:last-child td{border:0}

.page-table tbody tr:hover{background:var(--color-background-hover)}

.page-identity{display:flex;align-items:center;gap:10px;min-inline-size:260px;margin:0;padding:0;border:0;background:transparent;color:inherit;text-align:start;cursor:pointer}

.page-identity>span:last-child{display:grid}

.page-identity__mark,.page-card__mark{display:grid;place-items:center;inline-size:42px;block-size:42px;border-radius:12px;color:#fff;font-weight:800}

.page-identity code{color:var(--color-primary-element)}

.access-label{display:inline-flex;align-items:center;gap:6px}

.row-actions{justify-content:flex-end}

.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}

.page-grid article{--page-accent:var(--color-primary-element);--page-bg:var(--color-main-background);display:grid;gap:10px;padding:14px;border:1px solid color-mix(in srgb,var(--page-accent) 32%,var(--color-border));border-radius:var(--border-radius-large);background:color-mix(in srgb,var(--page-accent) 8%,var(--page-bg));box-shadow:0 3px 12px var(--color-box-shadow)}

.page-card__main{display:grid;justify-items:start;gap:7px;min-block-size:190px;margin:0;padding:0;border:0;background:transparent;color:inherit;text-align:start;cursor:pointer}

.page-card__mark{background:var(--page-accent)}

.page-card__main>span:nth-of-type(2){display:-webkit-box;overflow:hidden;color:var(--color-text-maxcontrast);-webkit-line-clamp:2;-webkit-box-orient:vertical}

.page-card__main code{color:var(--page-accent)}

.page-card__main small{display:flex;align-items:center;gap:4px;margin-block-start:auto;color:var(--color-text-maxcontrast)}

.page-card__actions{display:flex;gap:6px;padding-block-start:10px;border-block-start:1px solid var(--color-border)}

.visually-hidden{position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}@media(max-width:700px){.page-list>header{align-items:start;flex-direction:column}.page-list>header>div:last-child{inline-size:100%;justify-content:space-between}}
</style>
