<script setup lang="ts">
import { mdiDeleteOutline, mdiMerge, mdiPencilOutline, mdiTagOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import type { Tag } from '../types'

const props = withDefaults(defineProps<{
	tags: Tag[]
	mode?: 'manage' | 'select'
	selectedIds?: number[]
}>(), {
	mode: 'manage',
	selectedIds: () => [],
})
const emit = defineEmits<{
	toggle: [tag: Tag]
	edit: [tag: Tag]
	merge: [tag: Tag]
	delete: [tag: Tag]
}>()

function linkCountLabel(count: number): string {
	return count === 1 ? t('shortlinks', '{count} link', { count }) : t('shortlinks', '{count} links', { count })
}
</script>

<template>
	<ul class="tag-list" :aria-label="t('shortlinks', 'Tags')">
		<li v-for="tag in tags" :key="tag.id" :class="{ 'is-selected': selectedIds.includes(tag.id) }">
			<NcListItem :name="tag.name"
				:details="linkCountLabel(tag.count)"
				:actions-aria-label="t('shortlinks', 'Tag actions for {name}', { name: tag.name })"
				@click="mode === 'select' ? emit('toggle', tag) : emit('edit', tag)">
				<template #icon>
					<span class="tag-list__icon" :style="{ color: tag.color || 'var(--color-primary-element)' }"><NcIconSvgWrapper :path="mdiTagOutline" /></span>
				</template>
				<template v-if="mode === 'manage'" #actions>
					<NcActionButton :name="t('shortlinks', 'Edit')" @click="emit('edit', tag)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiPencilOutline" />
						</template>
					</NcActionButton>
					<NcActionButton v-if="props.tags.length > 1" :name="t('shortlinks', 'Merge')" @click="emit('merge', tag)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiMerge" />
						</template>
					</NcActionButton>
					<NcActionButton :name="t('shortlinks', 'Delete')" @click="emit('delete', tag)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiDeleteOutline" />
						</template>
					</NcActionButton>
				</template>
			</NcListItem>
		</li>
	</ul>
</template>

<style scoped>
.tag-list { inline-size: 100%; margin: 0; padding: 0; list-style: none; }

.tag-list > li { min-block-size: 52px; border-block-end: 1px solid var(--color-border); transition: background-color .15s ease; }

.tag-list > li.is-selected { background: var(--color-primary-element-light); }

.tag-list__icon { display: grid; place-items: center; }

.tag-list :deep(.list-item) { min-block-size: 51px; padding-block: 2px; }
</style>
