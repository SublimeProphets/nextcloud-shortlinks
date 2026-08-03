<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { mdiCheck, mdiChevronLeft, mdiChevronRight, mdiClose, mdiFolderOutline, mdiIdentifier, mdiOpenInNew, mdiShareVariantOutline, mdiTagOutline } from '@mdi/js'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { Folder, Tag, UserSettings } from '../types'
import BookmarkletGuide from './BookmarkletGuide.vue'

const props = defineProps<{ folders: Folder[]; tags: Tag[]; shortUrlTemplate?: string | null }>()
const emit = defineEmits<{ changed: []; saved: [settings: UserSettings]; hidden: [] }>()
const step = ref(0)
const busy = ref(false)
const aliasChoice = ref<'shortest' | 'readable' | 'random'>('shortest')
const urlChoice = ref<'nextcloud' | 'custom'>('nextcloud')
const customUrl = ref('')
const selectedFolder = ref<number | null>(null)
const newFolder = ref('')
const selectedExamples = ref<string[]>(['Important'])
const newTag = ref('')

const steps = ['Automatic aliases', 'URL to share', 'Folders', 'Tags', 'Bookmarklet', 'Done']
const currentStep = computed(() => steps[step.value] ?? 'Quick Start')
const nextcloudExample = computed(() => props.shortUrlTemplate?.replace('{alias}', 'summer') || `${window.location.origin}/apps/shortlinks/r/summer`)
const aliasOptions = [
	{ id: 'shortest', title: 'As short as possible', description: 'Compact aliases that are quick to type and scan.' },
	{ id: 'readable', title: 'Based on destination', description: 'Guess a memorable alias from the page title or URL.' },
	{ id: 'random', title: 'Random and anonymous', description: 'Use an unrelated random alias that reveals no destination context.' },
] as const
const tagExamples = [
	{ name: 'Important', description: 'Things that should stay easy to find.', color: '#e9322d' },
	{ name: 'Campaign', description: 'Shareable links for campaigns and launches.', color: '#8c42ab' },
	{ name: 'Team', description: 'Frequently used links for collaboration.', color: '#0082c9' },
]
const nextDisabled = computed(() => step.value === 1 && urlChoice.value === 'custom' && !/^https?:\/\//i.test(customUrl.value.trim()))

onMounted(async () => {
	selectedFolder.value = props.folders[0]?.id ?? null
	try {
		const settings = await api.getUserSettings()
		if (settings.aliasStrategy === 'readable' || settings.aliasStrategy === 'random' || settings.aliasStrategy === 'shortest') aliasChoice.value = settings.aliasStrategy
		urlChoice.value = settings.urlMode === 'inherit' ? 'nextcloud' : 'custom'
		customUrl.value = settings.baseUrl
	} catch { /* Defaults provide a fully usable first step. */ }
})

async function hide() {
	busy.value = true
	try {
		const updated = await api.updateUserSettings({ showQuickStart: false })
		emit('saved', updated)
		emit('hidden')
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { busy.value = false }
}

async function next() {
	busy.value = true
	try {
		if (step.value === 0) {
			emit('saved', await api.updateUserSettings({ aliasStrategy: aliasChoice.value }))
		} else if (step.value === 1) {
			emit('saved', await api.updateUserSettings(urlChoice.value === 'nextcloud' ? { urlMode: 'inherit' } : { urlMode: 'simple', baseUrl: customUrl.value.trim() }))
		} else if (step.value === 2 && newFolder.value.trim()) {
			const created = await api.createFolder(newFolder.value.trim())
			selectedFolder.value = created.id
			newFolder.value = ''
			emit('changed')
		} else if (step.value === 3) {
			const names = [...selectedExamples.value, ...(newTag.value.trim() ? [newTag.value.trim()] : [])]
			for (const name of names) {
				if (!props.tags.some(tag => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
					const example = tagExamples.find(tag => tag.name === name)
					await api.createTag(name, example?.color ?? null)
				}
			}
			newTag.value = ''
			emit('changed')
		}
		if (step.value < steps.length - 1) step.value++
		else { showSuccess(t('shortlinks', 'Quick Start completed')); await hide() }
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { busy.value = false }
}

function toggleExample(name: string) {
	selectedExamples.value = selectedExamples.value.includes(name) ? selectedExamples.value.filter(item => item !== name) : [...selectedExamples.value, name]
}
</script>

<template>
	<section class="quick-start" aria-labelledby="quick-start-title">
		<header class="quick-start__header">
			<div>
				<p>{{ t('shortlinks', 'Quick Start') }}</p><h2 id="quick-start-title">
					{{ t('shortlinks', currentStep) }}
				</h2>
			</div>
			<NcButton variant="tertiary" :aria-label="t('shortlinks', 'Hide Quick Start Guide')" @click="hide">
				<template #icon>
					<NcIconSvgWrapper :path="mdiClose" />
				</template>
			</NcButton>
		</header>
		<ol class="quick-start__progress" :aria-label="t('shortlinks', 'Quick Start progress')">
			<li v-for="(label, index) in steps" :key="label" :class="{ active: index === step, complete: index < step }">
				<span>{{ index < step ? '✓' : index + 1 }}</span><small>{{ t('shortlinks', label) }}</small>
			</li>
		</ol>

		<div v-if="step === 0" class="option-grid">
			<button v-for="option in aliasOptions"
				:key="option.id"
				type="button"
				class="choice-card"
				:class="{ selected: aliasChoice === option.id }"
				@click="aliasChoice = option.id">
				<NcIconSvgWrapper :path="mdiIdentifier" /><span><strong>{{ t('shortlinks', option.title) }}</strong><small>{{ t('shortlinks', option.description) }}</small></span><NcIconSvgWrapper v-if="aliasChoice === option.id" :path="mdiCheck" />
			</button>
		</div>
		<div v-else-if="step === 1" class="option-grid">
			<button type="button"
				class="choice-card"
				:class="{ selected: urlChoice === 'nextcloud' }"
				@click="urlChoice = 'nextcloud'">
				<NcIconSvgWrapper :path="mdiShareVariantOutline" /><span><strong>{{ t('shortlinks', 'Use Nextcloud') }}</strong><small>{{ nextcloudExample }}</small></span><NcIconSvgWrapper v-if="urlChoice === 'nextcloud'" :path="mdiCheck" />
			</button>
			<button type="button"
				class="choice-card"
				:class="{ selected: urlChoice === 'custom' }"
				@click="urlChoice = 'custom'">
				<NcIconSvgWrapper :path="mdiOpenInNew" /><span><strong>{{ t('shortlinks', 'Use a custom domain or URL') }}</strong><small>{{ t('shortlinks', 'Display and copy links from your own short domain.') }}</small></span><NcIconSvgWrapper v-if="urlChoice === 'custom'" :path="mdiCheck" />
			</button>
			<NcTextField v-if="urlChoice === 'custom'"
				v-model="customUrl"
				type="url"
				:label="t('shortlinks', 'Custom base URL')"
				:helper-text="t('shortlinks', 'Example: https://go.example')" />
		</div>
		<div v-else-if="step === 2" class="option-grid">
			<button v-for="folder in folders"
				:key="folder.id"
				type="button"
				class="choice-card choice-card--compact"
				:class="{ selected: selectedFolder === folder.id }"
				@click="selectedFolder = folder.id">
				<NcIconSvgWrapper :path="mdiFolderOutline" /><span><strong>{{ folder.name }}</strong><small>{{ t('shortlinks', '{count} links', { count: folder.count }) }}</small></span><NcIconSvgWrapper v-if="selectedFolder === folder.id" :path="mdiCheck" />
			</button>
			<NcTextField v-model="newFolder" :label="t('shortlinks', 'Create another folder')" :helper-text="t('shortlinks', 'It will be added when you continue.')" />
		</div>
		<div v-else-if="step === 3" class="option-grid">
			<button v-for="tag in tagExamples"
				:key="tag.name"
				type="button"
				class="choice-card"
				:class="{ selected: selectedExamples.includes(tag.name) }"
				@click="toggleExample(tag.name)">
				<NcIconSvgWrapper :path="mdiTagOutline" :style="{ color: tag.color }" /><span><strong>{{ t('shortlinks', tag.name) }}</strong><small>{{ t('shortlinks', tag.description) }}</small></span><NcIconSvgWrapper v-if="selectedExamples.includes(tag.name)" :path="mdiCheck" />
			</button>
			<NcTextField v-model="newTag" :label="t('shortlinks', 'Create a custom tag')" />
		</div>
		<BookmarkletGuide v-else-if="step === 4" :show-heading="false" />
		<div v-else class="quick-start__done">
			<NcIconSvgWrapper :path="mdiCheck" :size="48" /><h3>{{ t('shortlinks', 'You are ready to create better links') }}</h3><p>{{ t('shortlinks', 'Your choices are saved. You can change them at any time in Shortlinks settings.') }}</p>
		</div>

		<footer class="quick-start__actions">
			<NcButton v-if="step > 0" :disabled="busy" @click="step--">
				<template #icon>
					<NcIconSvgWrapper :path="mdiChevronLeft" />
				</template>{{ t('shortlinks', 'Back') }}
			</NcButton>
			<span />
			<NcButton v-if="step < steps.length - 1"
				variant="tertiary"
				:disabled="busy"
				@click="step++">
				{{ t('shortlinks', 'Skip this step') }}
			</NcButton>
			<NcButton variant="primary" :disabled="busy || nextDisabled" @click="next">
				{{ step === steps.length - 1 ? t('shortlinks', 'Finish and hide guide') : t('shortlinks', 'Continue') }}<template #icon>
					<NcIconSvgWrapper :path="step === steps.length - 1 ? mdiCheck : mdiChevronRight" />
				</template>
			</NcButton>
		</footer>
	</section>
</template>

<style scoped>
.quick-start { display: grid; gap: calc(var(--default-grid-baseline) * 4); padding: clamp(16px, 3vw, 28px); border: 1px solid var(--color-primary-element); border-radius: var(--border-radius-large); background: linear-gradient(135deg, var(--color-primary-element-light), var(--color-main-background) 70%); }

.quick-start__header { display: flex; justify-content: space-between; align-items: flex-start; }

.quick-start__header p, .quick-start__header h2, .quick-start__done h3, .quick-start__done p { margin: 0; }

.quick-start__header p { color: var(--color-primary-element); font-weight: 700; }

.quick-start__progress { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); margin: 0; padding: 0; list-style: none; }

.quick-start__progress li { display: grid; justify-items: center; gap: var(--default-grid-baseline); color: var(--color-text-maxcontrast); text-align: center; }

.quick-start__progress li::before { content: ''; position: relative; z-index: 0; grid-area: 1 / 1; inline-size: 100%; block-size: 2px; margin-block-start: 14px; background: var(--color-border); }

.quick-start__progress span { z-index: 1; grid-area: 1 / 1; display: grid; inline-size: 28px; block-size: 28px; place-items: center; border-radius: 50%; background: var(--color-main-background); border: 2px solid var(--color-border); }

.quick-start__progress .active span, .quick-start__progress .complete span { color: var(--color-primary-element-text); border-color: var(--color-primary-element); background: var(--color-primary-element); }

.option-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr)); gap: calc(var(--default-grid-baseline) * 3); }

.choice-card { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: calc(var(--default-grid-baseline) * 2); align-items: start; min-block-size: 100px; padding: calc(var(--default-grid-baseline) * 3); color: var(--color-main-text); text-align: start; border: 2px solid var(--color-border); border-radius: var(--border-radius-large); background: var(--color-main-background); }

.choice-card:hover { background: var(--color-background-hover); }

.choice-card.selected { border-color: var(--color-primary-element); box-shadow: 0 0 0 1px var(--color-primary-element); }

.choice-card span { display: grid; gap: var(--default-grid-baseline); }

.choice-card small { color: var(--color-text-maxcontrast); overflow-wrap: anywhere; }

.choice-card--compact { min-block-size: 72px; }

.quick-start__actions { display: grid; grid-template-columns: auto 1fr auto auto; gap: calc(var(--default-grid-baseline) * 2); align-items: center; }

.quick-start__done { display: grid; justify-items: center; gap: calc(var(--default-grid-baseline) * 2); padding: calc(var(--default-grid-baseline) * 6); text-align: center; }
@media (max-width: 700px) { .quick-start__progress small { display: none; } .quick-start__actions { grid-template-columns: 1fr 1fr; } .quick-start__actions > span { display: none; } }
</style>
