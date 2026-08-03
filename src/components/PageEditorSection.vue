<script setup lang="ts">
import { mdiArrowDown, mdiArrowUp, mdiChevronDown } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'

const props = withDefaults(defineProps<{
	id: string
	title: string
	description?: string
	icon?: string
	open: boolean
	first?: boolean
	last?: boolean
	dragging?: boolean
	dropPosition?: 'before' | 'after' | null
}>(), {
	description: '',
	icon: '',
	first: false,
	last: false,
	dragging: false,
	dropPosition: null,
})
const emit = defineEmits<{
	toggle: []
	move: [offset: -1 | 1]
	dragStart: [event: DragEvent]
	dragOver: [payload: { position: 'before' | 'after'; event: DragEvent }]
	drop: [payload: { position: 'before' | 'after'; event: DragEvent }]
	dragEnd: []
}>()

function position(event: DragEvent): 'before' | 'after' {
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

function dragStart(event: DragEvent) {
	if ((event.target as HTMLElement | null)?.closest('button, a, input, select, textarea')) {
		event.preventDefault()
		return
	}
	emit('dragStart', event)
}
</script>

<template>
	<section class="editor-section" :class="{ 'is-open': open, 'is-dragging': dragging }">
		<div v-if="dropPosition === 'before'" class="editor-section__placeholder">
			{{ t('shortlinks', 'Move section here') }}
		</div>
		<header class="editor-section__header"
			draggable="true"
			@dragstart="dragStart"
			@dragover.prevent="emit('dragOver', { position: position($event), event: $event })"
			@drop.prevent="emit('drop', { position: position($event), event: $event })"
			@dragend="emit('dragEnd')">
			<button class="editor-section__summary"
				type="button"
				:aria-expanded="open"
				:aria-controls="`editor-section-${id}`"
				@click="emit('toggle')">
				<NcIconSvgWrapper v-if="icon" :path="icon" :size="22" />
				<span><h2>{{ title }}</h2><small v-if="description">{{ description }}</small></span>
			</button>
			<div class="editor-section__actions" @click.stop @mousedown.stop>
				<slot name="header-action" />
				<NcActions :aria-label="t('shortlinks', 'Actions for {section}', { section: title })" class="editor-section__menu">
					<NcActionButton :name="t('shortlinks', 'Move up')" :disabled="first" @click="emit('move', -1)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiArrowUp" />
						</template>
					</NcActionButton>
					<NcActionButton :name="t('shortlinks', 'Move down')" :disabled="last" @click="emit('move', 1)">
						<template #icon>
							<NcIconSvgWrapper :path="mdiArrowDown" />
						</template>
					</NcActionButton>
				</NcActions>
				<NcButton variant="tertiary"
					:aria-label="open ? t('shortlinks', 'Collapse {section}', { section: title }) : t('shortlinks', 'Expand {section}', { section: title })"
					@click="emit('toggle')">
					<template #icon>
						<NcIconSvgWrapper class="editor-section__chevron" :class="{ 'is-open': open }" :path="mdiChevronDown" />
					</template>
				</NcButton>
			</div>
		</header>
		<Transition name="section-collapse">
			<div v-show="open" :id="`editor-section-${id}`" class="editor-section__body">
				<slot />
			</div>
		</Transition>
		<div v-if="dropPosition === 'after'" class="editor-section__placeholder">
			{{ t('shortlinks', 'Move section here') }}
		</div>
	</section>
</template>

<style scoped>
.editor-section { display: grid; padding-block-end: 20px; border-block-end: 1px solid var(--color-border); transition: opacity .15s ease; }

.editor-section.is-dragging { opacity: .38; }

.editor-section__header { display: flex; align-items: flex-start; justify-content: space-between; min-block-size: 52px; gap: 10px; padding: 4px; border-radius: var(--border-radius-large); cursor: grab; transition: background-color .15s ease; }

.editor-section__header:active { cursor: grabbing; }

.editor-section__header:hover, .editor-section__header:focus-within { background: var(--color-background-hover); }

.editor-section__summary { display: flex; align-items: flex-start; flex: 1; min-inline-size: 0; gap: 8px; margin: 0; padding: 6px; border: 0; background: transparent; color: inherit; text-align: start; cursor: pointer; }

.editor-section__summary > span { display: grid; min-inline-size: 0; gap: 3px; }

.editor-section__summary h2, .editor-section__summary small { margin: 0; }

.editor-section__summary small { color: var(--color-text-maxcontrast); font-weight: normal; line-height: 1.35; }

.editor-section__actions { display: flex; align-items: center; flex: 0 0 auto; gap: 2px; }

.editor-section__menu { opacity: 0; transition: opacity .15s ease; }

.editor-section__header:hover .editor-section__menu, .editor-section__header:focus-within .editor-section__menu { opacity: 1; }

.editor-section__chevron { transition: transform .18s ease; }

.editor-section__chevron.is-open { transform: rotate(180deg); }

.editor-section__body { display: grid; gap: 12px; padding: 10px 6px 4px; }

.editor-section__placeholder { display: grid; place-items: center; min-block-size: 42px; margin-block: 5px; border: 1px dashed var(--color-primary-element); border-radius: var(--border-radius); background: var(--color-primary-element-light); color: var(--color-primary-element); font-size: .9rem; font-weight: 600; }

.section-collapse-enter-active, .section-collapse-leave-active { transition: opacity .15s ease, transform .15s ease; }

.section-collapse-enter-from, .section-collapse-leave-to { opacity: 0; transform: translateY(-4px); }

@media (hover: none) { .editor-section__menu { opacity: 1; } }
</style>
