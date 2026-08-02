<script setup lang="ts">
import {
	mdiCalendarRemoveOutline,
	mdiCalendarRange,
	mdiChartBoxOutline,
	mdiCogOutline,
	mdiCursorDefaultClickOutline,
	mdiHistory,
	mdiLinkOff,
	mdiLinkVariant,
	mdiStarOutline,
	mdiTagOutline,
	mdiTrashCanOutline,
	mdiTrendingUp,
	mdiViewDashboardOutline,
} from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationCaption from '@nextcloud/vue/components/NcAppNavigationCaption'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { computed, ref, watch } from 'vue'
import type { Folder, Tag } from '../types'
import FolderNavigationItem from './FolderNavigationItem.vue'

const props = defineProps<{ folders: Folder[]; tags: Tag[]; activeSystem: string; activeFolderId: number | null; activeTagIds: number[] }>()
const emit = defineEmits<{
	filter: [value: { system: string; folderId: number | null }]
	tag: [id: number]
	settings: []
	createLink: [folderId: number]
	createFolder: [parentId: number]
	moveFolder: [folder: Folder]
	copyFolder: [folder: Folder]
	exportFolder: [folder: Folder]
	deleteFolder: [folder: Folder]
	statistics: [value: { period: '7d' | '30d' | '90d' | 'thisYear' | 'lastYear' | 'all' | 'custom'; from?: string; to?: string }]
}>()
const systemItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: mdiViewDashboardOutline },
	{ id: 'all', label: 'All links', icon: mdiLinkVariant },
	{ id: 'favorites', label: 'Favorites', icon: mdiStarOutline },
	{ id: 'trending', label: 'Trending links', icon: mdiTrendingUp },
	{ id: 'recent', label: 'Recently created', icon: mdiHistory },
	{ id: 'used', label: 'Recently used', icon: mdiCursorDefaultClickOutline },
	{ id: 'expired', label: 'Expired', icon: mdiCalendarRemoveOutline },
	{ id: 'inactive', label: 'Inactive', icon: mdiLinkOff },
]
const expandedIds = ref(new Set<number>())
const statisticsOpen = ref(true)
const activeStatisticsPeriod = ref<'7d' | '30d' | '90d' | 'thisYear' | 'lastYear' | 'all' | 'custom'>('30d')
const customFrom = ref(new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10))
const customTo = ref(new Date().toISOString().slice(0, 10))
const statisticsPeriods = [
	{ id: '7d' as const, label: 'Last 7 days' }, { id: '30d' as const, label: 'Last 30 days' }, { id: '90d' as const, label: 'Last 3 months' },
	{ id: 'thisYear' as const, label: 'This year' }, { id: 'lastYear' as const, label: 'Last year' }, { id: 'all' as const, label: 'Since the beginning' }, { id: 'custom' as const, label: 'Custom' },
]
const rootFolders = computed(() => props.folders
	.filter(folder => folder.parentId === null)
	.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)))

watch([() => props.folders, () => props.activeFolderId], () => {
	const next = new Set(expandedIds.value)
	if (next.size === 0) rootFolders.value.forEach(folder => next.add(folder.id))
	let current = props.activeFolderId
	while (current !== null) {
		const folder = props.folders.find(item => item.id === current)
		if (!folder) break
		if (folder.parentId !== null) next.add(folder.parentId)
		current = folder.parentId
	}
	expandedIds.value = next
}, { immediate: true, deep: true })

function toggleFolder(value: { id: number; open: boolean }) {
	const next = new Set(expandedIds.value)
	value.open ? next.add(value.id) : next.delete(value.id)
	expandedIds.value = next
}

function openStatistics(period: typeof activeStatisticsPeriod.value) {
	activeStatisticsPeriod.value = period
	if (period !== 'custom') emit('statistics', { period })
}

function applyCustomStatistics() {
	emit('statistics', { period: 'custom', from: customFrom.value, to: customTo.value })
}
</script>

<template>
	<NcAppNavigation :aria-label="t('shortlinks', 'Shortlinks navigation')">
		<ul class="navigation-section navigation-section--main">
			<NcAppNavigationItem v-for="item in systemItems"
				:key="item.id"
				:name="t('shortlinks', item.label)"
				:active="activeSystem === item.id && activeFolderId === null"
				@click="emit('filter', { system: item.id, folderId: null })">
				<template #icon>
					<NcIconSvgWrapper :path="item.icon" />
				</template>
			</NcAppNavigationItem>

			<NcAppNavigationCaption :name="t('shortlinks', 'Folders')" />
			<FolderNavigationItem v-for="folder in rootFolders"
				:key="folder.id"
				:folder="folder"
				:folders="folders"
				:active-folder-id="activeFolderId"
				:expanded-ids="expandedIds"
				@select="emit('filter', { system: 'all', folderId: $event.id })"
				@toggle="toggleFolder"
				@create-link="emit('createLink', $event.id)"
				@create-folder="emit('createFolder', $event.id)"
				@move="emit('moveFolder', $event)"
				@copy="emit('copyFolder', $event)"
				@export="emit('exportFolder', $event)"
				@delete="emit('deleteFolder', $event)" />

			<NcAppNavigationCaption :name="t('shortlinks', 'Tags')" />
			<NcAppNavigationItem v-for="tag in tags"
				:key="tag.id"
				:name="tag.name"
				:counter-number="tag.count"
				:active="activeTagIds.includes(tag.id)"
				@click="emit('tag', tag.id)">
				<template #icon>
					<span class="tag-navigation-icon" :style="{ color: tag.color || undefined }"><NcIconSvgWrapper :path="mdiTagOutline" /></span>
				</template>
			</NcAppNavigationItem>

			<NcAppNavigationItem :name="t('shortlinks', 'Statistics')"
				:active="activeSystem === 'statistics'"
				allow-collapse
				:open="statisticsOpen"
				@click="openStatistics(activeStatisticsPeriod)"
				@update:open="statisticsOpen = $event">
				<template #icon>
					<NcIconSvgWrapper :path="mdiChartBoxOutline" />
				</template>
				<NcAppNavigationItem v-for="period in statisticsPeriods"
					:key="period.id"
					:name="t('shortlinks', period.label)"
					:active="activeSystem === 'statistics' && activeStatisticsPeriod === period.id"
					@click="openStatistics(period.id)">
					<template #icon>
						<NcIconSvgWrapper :path="period.id === 'custom' ? mdiCalendarRange : mdiChartBoxOutline" />
					</template>
				</NcAppNavigationItem>
				<li v-if="activeStatisticsPeriod === 'custom'" class="statistics-custom" @click.stop>
					<label><span>{{ t('shortlinks', 'Start date') }}</span><input v-model="customFrom" type="date"></label>
					<label><span>{{ t('shortlinks', 'End date') }}</span><input v-model="customTo" type="date"></label>
					<button type="button" @click="applyCustomStatistics">
						{{ t('shortlinks', 'Apply') }}
					</button>
				</li>
			</NcAppNavigationItem>
		</ul>
		<template #footer>
			<ul class="navigation-section navigation-section--footer">
				<NcAppNavigationItem :name="t('shortlinks', 'Trash')"
					:active="activeSystem === 'trash' && activeFolderId === null"
					@click="emit('filter', { system: 'trash', folderId: null })">
					<template #icon>
						<NcIconSvgWrapper :path="mdiTrashCanOutline" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem :name="t('shortlinks', 'Settings')" @click="emit('settings')">
					<template #icon>
						<NcIconSvgWrapper :path="mdiCogOutline" />
					</template>
				</NcAppNavigationItem>
			</ul>
		</template>
	</NcAppNavigation>
</template>

<style scoped>
.navigation-section {
	display: flex;
	inline-size: 100%;
	margin: 0;
	padding: var(--app-navigation-padding);
	flex-direction: column;
	gap: var(--default-grid-baseline);
	list-style: none;
}

.navigation-section--footer {
	flex: 0 0 auto;
	padding-block-start: calc(var(--default-grid-baseline) * 2);
	border-block-start: 1px solid var(--color-border);
}

.tag-navigation-icon { display: grid; place-items: center; color: var(--color-main-text); }

.statistics-custom { display: grid; gap: calc(var(--default-grid-baseline) * 2); padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 3) calc(var(--default-grid-baseline) * 3) 44px; }

.statistics-custom label { display: grid; gap: var(--default-grid-baseline); color: var(--color-text-maxcontrast); font-size: .8rem; }

.statistics-custom input { min-inline-size: 0; inline-size: 100%; min-block-size: 38px; margin: 0; }

.statistics-custom button { min-block-size: 38px; border: 0; border-radius: var(--border-radius-pill); background: var(--color-primary-element); color: var(--color-primary-element-text); cursor: pointer; }
</style>
