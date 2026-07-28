<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcAppSidebar from '@nextcloud/vue/components/NcAppSidebar'
import NcContent from '@nextcloud/vue/components/NcContent'
import LinkDetail from './components/LinkDetail.vue'
import LinkForm from './components/LinkForm.vue'
import LinkList from './components/LinkList.vue'
import Navigation from './components/Navigation.vue'
import { useShortlinks } from './stores/useShortlinks'
import type { ShortLink } from './types'

const store = useShortlinks()
const showCreate = ref(false)
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
			@create="showCreate = true"
			@filter="store.setFilter($event.system, $event.folderId)"
			@changed="store.refresh()" />
		<NcAppContent>
			<LinkList :links="store.state.links"
				:loading="store.state.loading"
				:error="store.state.error"
				:selected="store.state.selected"
				@open="selectedLink = $event"
				@toggle="store.toggleSelected($event)"
				@refresh="store.refresh()"
				@search="store.state.search = $event; store.refresh()"
				@bulk="store.bulk($event)" />
		</NcAppContent>
		<NcAppSidebar v-if="selectedLink" :name="selectedLink.title || selectedLink.slug" @close="selectedLink = null">
			<LinkDetail :link="selectedLink"
				@edit="editLink = $event"
				@changed="store.refresh(); selectedLink = null" />
		</NcAppSidebar>
		<LinkForm v-if="showCreate"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:prefill-url="prefill.get('url') || ''"
			:prefill-title="prefill.get('title') || ''"
			@close="showCreate = false"
			@save="store.create($event).then(() => showCreate = false)" />
		<LinkForm v-if="editLink"
			:folders="store.state.folders"
			:tags="store.state.tags"
			:link="editLink"
			@close="editLink = null"
			@save="store.update(editLink, $event).then(() => { editLink = null; selectedLink = null })" />
	</NcContent>
</template>
