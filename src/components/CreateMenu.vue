<script setup lang="ts">
import { ref } from 'vue'
import { mdiFileDocumentPlusOutline, mdiFolderPlusOutline, mdiLinkPlus, mdiTagPlusOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'

const emit = defineEmits<{ folder: []; link: []; page: []; tag: [] }>()
const open = ref(false)
const menuKey = ref(0)

function select(type: 'folder' | 'link' | 'page' | 'tag') {
	open.value = false
	if (type === 'folder') emit('folder')
	else if (type === 'link') emit('link')
	else if (type === 'page') emit('page')
	else emit('tag')
	setTimeout(() => {
		open.value = false
		menuKey.value++
	}, 0)
}
</script>

<template>
	<NcActions :key="menuKey"
		v-model:open="open"
		class="create-menu"
		force-menu
		primary
		default-icon="icon-add"
		:menu-name="t('shortlinks', '+ New')"
		:aria-label="t('shortlinks', 'Create new')">
		<NcActionButton :name="t('shortlinks', 'New short link')" @click="select('link')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiLinkPlus" />
			</template>
		</NcActionButton>
		<NcActionButton :name="t('shortlinks', 'New page')" @click="select('page')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiFileDocumentPlusOutline" />
			</template>
		</NcActionButton>
		<NcActionButton :name="t('shortlinks', 'New folder')" @click="select('folder')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiFolderPlusOutline" />
			</template>
		</NcActionButton>
		<NcActionButton :name="t('shortlinks', 'New tag')" @click="select('tag')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiTagPlusOutline" />
			</template>
		</NcActionButton>
	</NcActions>
</template>

<style scoped>
.create-menu {
	min-inline-size: 112px;
}
</style>
