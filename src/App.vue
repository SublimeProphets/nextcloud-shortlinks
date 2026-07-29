<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { loadState } from '@nextcloud/initial-state'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcAppSidebar from '@nextcloud/vue/components/NcAppSidebar'
import NcContent from '@nextcloud/vue/components/NcContent'
import LinkList from './components/LinkList.vue'
import Navigation from './components/Navigation.vue'
import { useShortlinks } from './stores/useShortlinks'
import type { ShortLink } from './types'

const store = useShortlinks()
const LinkDetail = defineAsyncComponent(() => import('./components/LinkDetail.vue'))
const LinkForm = defineAsyncComponent(() => import('./components/LinkForm.vue'))
const StatsOverview = defineAsyncComponent(() => import('./components/StatsOverview.vue'))
const capabilities = loadState<{ redirectStatuses: Array<301 | 302 | 307 | 308> }>('shortlinks', 'capabilities')
const settings = loadState<{ titleFetch: boolean }>('shortlinks', 'settings')
const showCreate = ref(false)
const showStats = ref(false)
const selectedLink = ref<ShortLink | null>(null)
const editLink = ref<ShortLink | null>(null)
const prefill = new URLSearchParams(location.search)

onMounted(async () => {
	await store.refresh()
	if (prefill.get('url')) showCreate.value = true
})
</script>

<template>
	<NcContent app-name="shortlinks">
		<Navigation :folders="store.state.folders"
			:tags="store.state.tags"
			:active-system="store.state.system"
			:active-folder-id="store.state.folderId"
			:active-tag-ids="store.state.tagIds"
			@create="showCreate = true"
			@filter="store.setFilter($event.system, $event.folderId)"
			@tag="store.toggleTagFilter($event)"
			@changed="store.refresh()" />
		<NcAppContent>
			<LinkList :links="store.state.links"
				:folders="store.state.folders"
				:tags="store.state.tags"
				:loading="store.state.loading"
				:error="store.state.error"
				:selected="store.state.selected"
				:has-more="store.state.hasMore"
				:system="store.state.system"
				:folder-id="store.state.folderId"
				:tag-ids="store.state.tagIds"
				:sort="store.state.sort"
				:direction="store.state.direction"
				:tag-mode="store.state.tagMode"
				@open="selectedLink = $event"
				@overview="showStats = true"
				@options="store.setListOptions($event)"
				@toggle="store.toggleSelected($event)"
				@refresh="store.refresh()"
				@search="store.state.search = $event; store.refresh()"
				@bulk="store.bulk($event)"
				@more="store.loadMore()" />
		</NcAppContent>
		<NcAppSidebar v-if="selectedLink" :name="selectedLink.title || selectedLink.slug" @close="selectedLink = null">
			<LinkDetail :link="selectedLink"
				@edit="editLink = $event"
				@changed="store.refresh(); selectedLink = null" />
		</NcAppSidebar>
		<LinkForm v-if="showCreate"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:redirect-statuses="capabilities.redirectStatuses"
			:allow-title-fetch="settings.titleFetch"
			:prefill-url="prefill.get('url') || ''"
			:prefill-title="prefill.get('title') || ''"
			@close="showCreate = false"
			@save="store.create($event).then(() => showCreate = false)" />
		<LinkForm v-if="editLink"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:redirect-statuses="capabilities.redirectStatuses"
			:allow-title-fetch="settings.titleFetch"
			:link="editLink"
			@close="editLink = null"
			@save="store.update(editLink, $event).then(() => { editLink = null; selectedLink = null })" />
		<StatsOverview v-if="showStats" @close="showStats = false" />
	</NcContent>
</template>
