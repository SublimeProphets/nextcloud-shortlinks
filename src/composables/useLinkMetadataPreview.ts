import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { api } from '../api/client'

export function useLinkMetadataPreview(url: Ref<string>, title: Ref<string>, valid: Ref<boolean>, enabled: Ref<boolean>) {
	const loading = ref(false)
	const hasThumbnail = ref(false)
	const titleEdited = ref(Boolean(title.value))
	let timer: ReturnType<typeof setTimeout> | undefined
	let requestId = 0

	watch([url, valid, enabled], () => {
		if (timer) clearTimeout(timer)
		hasThumbnail.value = false
		if (!valid.value || !enabled.value) {
			loading.value = false
			return
		}
		timer = setTimeout(load, 550)
	}, { immediate: true })

	onBeforeUnmount(() => {
		if (timer) clearTimeout(timer)
	})

	async function load() {
		const activeRequest = ++requestId
		const targetUrl = url.value
		loading.value = true
		try {
			const metadata = await api.fetchMetadata(targetUrl)
			if (activeRequest !== requestId || targetUrl !== url.value) return
			hasThumbnail.value = metadata.hasThumbnail
			if (!titleEdited.value && metadata.title) title.value = metadata.title
		} catch {
			if (activeRequest === requestId) hasThumbnail.value = false
		} finally {
			if (activeRequest === requestId) loading.value = false
		}
	}

	return {
		hasThumbnail,
		loading,
		markTitleEdited: () => { titleEdited.value = true },
		resetTitleEditing: () => { titleEdited.value = false },
		thumbnailSrc: computed(() => hasThumbnail.value && valid.value ? api.previewThumbnailUrl(url.value) : ''),
	}
}
