<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { mdiArrowDown, mdiArrowUp, mdiDeleteOutline, mdiFolderOutline, mdiPencilOutline } from '@mdi/js'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import { api } from '../api/client'
import { folderIconPath } from '../folderIcons'
import type { Folder } from '../types'

type DropIntent = 'before' | 'inside' | 'after'
const props = withDefaults(defineProps<{
	folders: Folder[]
	mode?: 'manage' | 'select'
	selectedId?: number | null
	allowRoot?: boolean
	rootLabel?: string
}>(), {
	mode: 'manage',
	selectedId: null,
	allowRoot: false,
	rootLabel: '',
})
const emit = defineEmits<{
	select: [folderId: number | null]
	edit: [folder: Folder]
	delete: [folder: Folder]
	changed: []
}>()
const dragged = ref<Folder | null>(null)
const dropTarget = ref<{ id: number; intent: DropIntent } | null>(null)
let nestTimer: ReturnType<typeof setTimeout> | undefined

const ordered = computed(() => {
	const result: Array<{ folder: Folder; depth: number }> = []
	const visited = new Set<number>()
	function append(parentId: number | null, depth: number) {
		props.folders.filter(folder => folder.parentId === parentId)
			.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
			.forEach(folder => {
				if (visited.has(folder.id)) return
				visited.add(folder.id)
				result.push({ folder, depth })
				append(folder.id, depth + 1)
			})
	}
	append(null, 0)
	return result
})

onBeforeUnmount(clearNestTimer)

function siblings(folder: Folder): Folder[] {
	return props.folders.filter(item => item.parentId === folder.parentId)
		.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
}

function linkCountLabel(count: number): string {
	return count === 1 ? t('shortlinks', '{count} link', { count }) : t('shortlinks', '{count} links', { count })
}

function activate(folder: Folder) {
	props.mode === 'select' ? emit('select', folder.id) : emit('edit', folder)
}

async function move(folder: Folder, offset: -1 | 1) {
	const current = siblings(folder)
	const index = current.findIndex(item => item.id === folder.id)
	const target = index + offset
	if (index < 0 || target < 0 || target >= current.length) return
	const ids = current.map(item => item.id)
	const [moved] = ids.splice(index, 1)
	if (moved === undefined) return
	ids.splice(target, 0, moved)
	await persistOrder(folder.parentId, ids)
}

function dragStart(folder: Folder, event: DragEvent) {
	if (props.mode !== 'manage') return
	dragged.value = folder
	event.dataTransfer?.setData('text/plain', String(folder.id))
	if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function dragOver(folder: Folder, event: DragEvent) {
	const source = dragged.value
	if (props.mode !== 'manage' || !source || source.id === folder.id || isDescendant(folder.id, source.id)) return
	event.preventDefault()
	if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	const ratio = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5
	if (ratio < 0.28) {
		clearNestTimer()
		dropTarget.value = { id: folder.id, intent: 'before' }
	} else if (ratio > 0.72) {
		clearNestTimer()
		dropTarget.value = { id: folder.id, intent: 'after' }
	} else if (dropTarget.value?.id !== folder.id || dropTarget.value.intent !== 'inside') {
		if (dropTarget.value?.id !== folder.id) {
			dropTarget.value = { id: folder.id, intent: 'after' }
			clearNestTimer()
			nestTimer = setTimeout(() => { dropTarget.value = { id: folder.id, intent: 'inside' } }, 550)
		}
	}
}

async function drop(folder: Folder, event: DragEvent) {
	event.preventDefault()
	clearNestTimer()
	const source = dragged.value
	const target = dropTarget.value
	dragged.value = null
	dropTarget.value = null
	if (!source || !target || target.id !== folder.id || source.id === folder.id || isDescendant(folder.id, source.id)) return
	try {
		if (target.intent === 'inside') {
			await api.updateFolder(source.id, { parentId: folder.id })
			const ids = props.folders.filter(item => item.parentId === folder.id && item.id !== source.id)
				.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)).map(item => item.id)
			ids.push(source.id)
			await api.reorderFolders(folder.id, ids)
		} else {
			const parentId = folder.parentId
			if (source.parentId !== parentId) await api.updateFolder(source.id, { parentId })
			const ids = props.folders.filter(item => item.parentId === parentId && item.id !== source.id)
				.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)).map(item => item.id)
			const targetIndex = Math.max(0, ids.indexOf(folder.id))
			ids.splice(targetIndex + (target.intent === 'after' ? 1 : 0), 0, source.id)
			await api.reorderFolders(parentId, ids)
		}
		emit('changed')
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}

function dragEnd() {
	clearNestTimer()
	dragged.value = null
	dropTarget.value = null
}

function clearNestTimer() {
	if (nestTimer) clearTimeout(nestTimer)
	nestTimer = undefined
}

function isDescendant(candidateId: number, ancestorId: number): boolean {
	let current = props.folders.find(folder => folder.id === candidateId)
	const seen = new Set<number>()
	while (current?.parentId !== null && current?.parentId !== undefined && !seen.has(current.id)) {
		if (current.parentId === ancestorId) return true
		seen.add(current.id)
		current = props.folders.find(folder => folder.id === current?.parentId)
	}
	return false
}

function ghostBefore(folder: Folder): boolean {
	return dropTarget.value?.id === folder.id && dropTarget.value.intent === 'before'
}

function ghostAfter(folder: Folder): boolean {
	return dropTarget.value?.id === folder.id && dropTarget.value.intent !== 'before'
}

function ghostDepth(entry: { folder: Folder; depth: number }): number {
	return dropTarget.value?.intent === 'inside' ? entry.depth + 1 : entry.depth
}

async function persistOrder(parentId: number | null, ids: number[]) {
	try {
		await api.reorderFolders(parentId, ids)
		emit('changed')
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	}
}
</script>

<template>
	<ul class="folder-tree-list" :aria-label="t('shortlinks', 'Folders')">
		<li v-if="allowRoot" class="folder-tree-list__item folder-tree-list__root" :class="{ 'is-selected': selectedId === null }">
			<NcListItem :name="rootLabel || t('shortlinks', 'No folder')" @click="emit('select', null)">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderOutline" />
				</template>
			</NcListItem>
		</li>
		<template v-for="entry in ordered" :key="entry.folder.id">
			<li v-if="ghostBefore(entry.folder)"
				class="folder-tree-list__ghost"
				:style="{ '--folder-depth': ghostDepth(entry) }">
				<span /><span>{{ t('shortlinks', 'Move here') }}</span>
			</li>
			<li class="folder-tree-list__item"
				:class="{ 'is-selected': selectedId === entry.folder.id, 'is-dragging': dragged?.id === entry.folder.id }"
				:style="{ '--folder-depth': entry.depth }"
				:draggable="mode === 'manage'"
				@dragstart="dragStart(entry.folder, $event)"
				@dragover="dragOver(entry.folder, $event)"
				@drop="drop(entry.folder, $event)"
				@dragend="dragEnd">
				<NcListItem :name="entry.folder.name"
					:details="linkCountLabel(entry.folder.count)"
					:actions-aria-label="t('shortlinks', 'Folder actions for {name}', { name: entry.folder.name })"
					@click="activate(entry.folder)">
					<template #icon>
						<NcIconSvgWrapper :path="folderIconPath(entry.folder.icon)" />
					</template>
					<template v-if="mode === 'manage'" #actions>
						<NcActionButton :name="t('shortlinks', 'Move up')" :disabled="siblings(entry.folder)[0]?.id === entry.folder.id" @click="move(entry.folder, -1)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiArrowUp" />
							</template>
						</NcActionButton>
						<NcActionButton :name="t('shortlinks', 'Move down')" :disabled="siblings(entry.folder).at(-1)?.id === entry.folder.id" @click="move(entry.folder, 1)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiArrowDown" />
							</template>
						</NcActionButton>
						<NcActionButton :name="t('shortlinks', 'Edit')" @click="emit('edit', entry.folder)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiPencilOutline" />
							</template>
						</NcActionButton>
						<NcActionButton :name="t('shortlinks', 'Delete')" @click="emit('delete', entry.folder)">
							<template #icon>
								<NcIconSvgWrapper :path="mdiDeleteOutline" />
							</template>
						</NcActionButton>
					</template>
				</NcListItem>
			</li>
			<li v-if="ghostAfter(entry.folder)"
				class="folder-tree-list__ghost"
				:style="{ '--folder-depth': ghostDepth(entry) }">
				<span /><span>{{ dropTarget?.intent === 'inside' ? t('shortlinks', 'Move into folder') : t('shortlinks', 'Move here') }}</span>
			</li>
		</template>
	</ul>
</template>

<style scoped>
.folder-tree-list { inline-size: 100%; margin: 0; padding: 0; list-style: none; }

.folder-tree-list__item { min-block-size: 52px; padding-inline-start: calc(var(--folder-depth, 0) * 24px); border-block-end: 1px solid var(--color-border); transition: opacity .15s ease, background-color .15s ease; }

.folder-tree-list__item[draggable="true"] { cursor: grab; }

.folder-tree-list__item.is-selected { background: var(--color-primary-element-light); }

.folder-tree-list__item.is-dragging { opacity: .4; }

.folder-tree-list__ghost { display: grid; grid-template-columns: 24px 1fr; align-items: center; min-block-size: 38px; margin-inline-start: calc(var(--folder-depth, 0) * 24px); padding: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 2); border: 1px dashed var(--color-primary-element); border-radius: var(--border-radius); color: var(--color-primary-element); background: var(--color-primary-element-light-hover); font-size: .9rem; }

.folder-tree-list__ghost > :first-child { inline-size: 16px; block-size: 2px; background: currentColor; }

.folder-tree-list :deep(.list-item) { min-block-size: 51px; }
</style>
