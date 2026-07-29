<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mdiChartLine, mdiHistory, mdiStarOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { api } from '../api/client'
import type { Folder, LinkDraft, ShortLink, Tag } from '../types'
import BookmarkletGuide from './BookmarkletGuide.vue'
import CompactLinkCard from './CompactLinkCard.vue'
import QuickLinkCreator from './QuickLinkCreator.vue'

const props = withDefaults(defineProps<{
	folders: Folder[]
	tags: Tag[]
	redirectStatuses?: number[]
	allowedSchemes?: string[]
	shortUrlTemplate?: string | null
	create: (draft: Partial<LinkDraft>) => Promise<ShortLink>
}>(), {
	redirectStatuses: () => [301, 302, 307, 308],
	allowedSchemes: () => ['http', 'https'],
	shortUrlTemplate: null,
})
const emit = defineEmits<{ open: [link: ShortLink] }>()
const newest = ref<ShortLink[]>([])
const favorites = ref<ShortLink[]>([])
const top = ref<ShortLink[]>([])
const loading = ref(true)
const error = ref('')

onMounted(loadDashboard)

async function loadDashboard() {
	loading.value = true
	error.value = ''
	try {
		const [recentResult, favoriteResult, topResult] = await Promise.all([
			api.listLinks({ system: 'recent', sort: 'created_at', direction: 'DESC', page: 1, perPage: 5 }),
			api.listLinks({ system: 'favorites', sort: 'updated_at', direction: 'DESC', page: 1, perPage: 5 }),
			api.listLinks({ system: 'top', page: 1, perPage: 5 }),
		])
		newest.value = recentResult.items
		favorites.value = favoriteResult.items
		top.value = topResult.items
	} catch (caught) {
		error.value = caught instanceof Error ? caught.message : String(caught)
	} finally {
		loading.value = false
	}
}

async function createAndRefresh(draft: Partial<LinkDraft>): Promise<ShortLink> {
	const created = await props.create(draft)
	await loadDashboard()
	return created
}

const columns = [
	{ key: 'newest', title: 'Newest links', description: 'Recently created', icon: mdiHistory, links: newest },
	{ key: 'favorites', title: 'Favorites', description: 'Links you marked as important', icon: mdiStarOutline, links: favorites },
	{ key: 'top', title: 'Top links', description: 'Most visits in the last 30 days', icon: mdiChartLine, links: top },
]
</script>

<template>
	<main class="dashboard-view" aria-labelledby="dashboard-heading">
		<h1 id="dashboard-heading" class="visually-hidden">
			{{ t('shortlinks', 'Dashboard') }}
		</h1>
		<QuickLinkCreator :folders="folders"
			:tags="tags"
			:redirect-statuses="redirectStatuses"
			:allowed-schemes="allowedSchemes"
			:short-url-template="shortUrlTemplate"
			:create="createAndRefresh" />

		<NcLoadingIcon v-if="loading"
			class="dashboard-state"
			:name="t('shortlinks', 'Loading dashboard')"
			:size="36" />
		<p v-else-if="error" class="dashboard-state error" role="alert">
			{{ error }}
		</p>
		<div v-else class="dashboard-columns">
			<section v-for="column in columns" :key="column.key" class="dashboard-column">
				<header>
					<NcIconSvgWrapper :path="column.icon" :size="24" aria-hidden="true" />
					<div><h2>{{ t('shortlinks', column.title) }}</h2><p>{{ t('shortlinks', column.description) }}</p></div>
				</header>
				<div v-if="column.links.value.length" class="dashboard-column__cards">
					<CompactLinkCard v-for="link in column.links.value"
						:key="link.id"
						:link="link"
						@open="emit('open', $event)" />
				</div>
				<NcEmptyContent v-else :name="t('shortlinks', 'No links to show')" :description="t('shortlinks', 'This section fills up as you use Shortlinks.')" />
			</section>
		</div>

		<section class="dashboard-bookmarklet" aria-label="Bookmarklet">
			<BookmarkletGuide compact />
		</section>
	</main>
</template>

<style scoped>
.dashboard-view { display: grid; gap: clamp(20px, 3vw, 32px); inline-size: 100%; padding: clamp(16px, 3vw, 32px); }

.dashboard-state { justify-self: center; margin-block: calc(var(--default-grid-baseline) * 8); }

.dashboard-columns { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 2vw, 24px); align-items: start; }

.dashboard-column { display: grid; gap: calc(var(--default-grid-baseline) * 3); min-inline-size: 0; }

.dashboard-column > header { display: flex; align-items: flex-start; gap: calc(var(--default-grid-baseline) * 2); }

.dashboard-column h2,
.dashboard-column p { margin: 0; }

.dashboard-column h2 { font-size: 1.1rem; }

.dashboard-column p { color: var(--color-text-maxcontrast); font-size: .85rem; }

.dashboard-column__cards { display: grid; gap: calc(var(--default-grid-baseline) * 2); }

.dashboard-bookmarklet { inline-size: min(50%, 760px); padding: calc(var(--default-grid-baseline) * 4); border: 1px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); }
@media (max-width: 1100px) { .dashboard-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); } .dashboard-bookmarklet { inline-size: 100%; } }
@media (max-width: 700px) { .dashboard-columns { grid-template-columns: 1fr; } }
</style>
