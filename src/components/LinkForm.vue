<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'
import type { AccessMode, Folder, LinkDraft, ShortLink, Tag } from '../types'

const props = withDefaults(defineProps<{ folders: Folder[]; tags: Tag[]; redirectStatuses?: Array<301 | 302 | 307 | 308>; prefillUrl?: string; prefillTitle?: string; link?: ShortLink }>(), {
	redirectStatuses: () => [301, 302, 307, 308],
	prefillUrl: '',
	prefillTitle: '',
	link: undefined,
})
const emit = defineEmits<{ close: []; save: [draft: Partial<LinkDraft>] }>()
const draft = reactive<LinkDraft>({ targetUrl: props.link?.targetUrl ?? props.prefillUrl ?? '', title: props.link?.title ?? props.prefillTitle ?? '', slug: props.link?.slug ?? '', description: props.link?.description ?? '', folderId: props.link?.folderId ?? null, tagIds: props.link?.tags.map(tag => tag.id) ?? [], active: props.link?.active ?? true, favorite: props.link?.favorite ?? false, accessMode: props.link?.accessMode ?? 'public', password: '', redirectStatus: props.link?.redirectStatus ?? 302, startsAt: props.link?.startsAt ?? null, expiresAt: props.link?.expiresAt ?? null, clickLimit: props.link?.clickLimit ?? null })
const checking = ref(false); const aliasMessage = ref('')
const accessModes: Array<{ value: AccessMode; label: string }> = [{ value: 'public', label: 'Public/unlisted' }, { value: 'authenticated', label: 'Signed-in users' }, { value: 'users', label: 'Selected users' }, { value: 'groups', label: 'Selected groups' }, { value: 'password', label: 'Password protected' }, { value: 'disabled', label: 'Disabled' }]
const canSave = computed(() => /^https?:\/\//i.test(draft.targetUrl ?? '') && (draft.accessMode !== 'password' || Boolean(draft.password) || Boolean(props.link?.passwordProtected)))
const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: value => { draft.startsAt = toTimestamp(value) } })
const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: value => { draft.expiresAt = toTimestamp(value) } })
/**
 *
 */
async function checkAlias() { if (!draft.slug) { aliasMessage.value = ''; return } if (props.link?.slug === draft.slug) { aliasMessage.value = t('shortlinks', 'This is the current alias'); return } checking.value = true; try { const result = await api.aliasAvailable(draft.slug); aliasMessage.value = result.available ? t('shortlinks', 'Alias is available') : t('shortlinks', 'Alias is already used') } catch (e) { aliasMessage.value = e instanceof Error ? e.message : String(e) } finally { checking.value = false } }
/**
 *
 * @param id Tag identifier to toggle
 */
function toggleTag(id: number) { const values = draft.tagIds ?? []; draft.tagIds = values.includes(id) ? values.filter(value => value !== id) : [...values, id] }
function toLocal(timestamp: number | null): string { if (timestamp === null) return ''; const date = new Date(timestamp * 1000); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) }
function toTimestamp(value: string): number | null { if (!value) return null; const milliseconds = new Date(value).getTime(); return Number.isFinite(milliseconds) ? Math.floor(milliseconds / 1000) : null }
function submit() { const payload: Partial<LinkDraft> = { ...draft, tagIds: [...draft.tagIds] }; if (props.link && !payload.password) delete payload.password; emit('save', payload) }
</script>

<template>
	<NcDialog :name="link ? t('shortlinks', 'Edit short link') : t('shortlinks', 'New short link')" size="large" @closing="emit('close')">
		<form id="shortlink-form" class="link-form" @submit.prevent="submit">
			<NcTextField v-model="draft.targetUrl"
				type="url"
				required
				:label="t('shortlinks', 'Target URL')" />
			<NcTextField v-model="draft.slug"
				:label="t('shortlinks', 'Alias (optional)')"
				:helper-text="aliasMessage"
				:loading="checking"
				@blur="checkAlias" />
			<NcTextField v-model="draft.title" :label="t('shortlinks', 'Title')" />
			<NcTextArea v-model="draft.description" :label="t('shortlinks', 'Description')" />
			<label>{{ t('shortlinks', 'Folder') }}<select v-model="draft.folderId"><option :value="null">{{ t('shortlinks', 'No folder') }}</option><option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option></select></label>
			<fieldset>
				<legend>{{ t('shortlinks', 'Tags') }}</legend><NcCheckboxRadioSwitch v-for="tag in tags"
					:key="tag.id"
					type="checkbox"
					:model-value="draft.tagIds?.includes(tag.id)"
					@update:model-value="toggleTag(tag.id)">
					{{ tag.name }}
				</NcCheckboxRadioSwitch>
			</fieldset>
			<div class="form-grid">
				<label>{{ t('shortlinks', 'Redirect') }}<select v-model="draft.redirectStatus"><option v-for="status in redirectStatuses" :key="status" :value="status">{{ status }}</option></select></label><label>{{ t('shortlinks', 'Access') }}<select v-model="draft.accessMode"><option v-for="mode in accessModes" :key="mode.value" :value="mode.value">{{ t('shortlinks', mode.label) }}</option></select></label>
			</div>
			<p v-if="draft.redirectStatus === 301 || draft.redirectStatus === 308" class="warning">
				{{ t('shortlinks', 'Permanent redirects can be cached, making statistics incomplete.') }}
			</p>
			<NcTextField v-if="draft.accessMode === 'password'"
				v-model="draft.password"
				type="password"
				autocomplete="new-password"
				:required="!link?.passwordProtected"
				:label="t('shortlinks', 'Password')" />
			<div class="form-grid">
				<label>{{ t('shortlinks', 'Valid from') }}<input v-model="startsAtLocal" type="datetime-local"></label>
				<label>{{ t('shortlinks', 'Expires at') }}<input v-model="expiresAtLocal" type="datetime-local"></label>
			</div>
			<label>{{ t('shortlinks', 'Click limit') }}<input v-model.number="draft.clickLimit" type="number" min="1"></label>
			<NcCheckboxRadioSwitch v-model="draft.favorite" type="switch">
				{{ t('shortlinks', 'Favorite') }}
			</NcCheckboxRadioSwitch>
		</form>
		<template #actions>
			<NcButton @click="emit('close')">
				{{ t('shortlinks', 'Cancel') }}
			</NcButton><NcButton type="submit"
				form="shortlink-form"
				variant="primary"
				:disabled="!canSave">
				{{ link ? t('shortlinks', 'Save changes') : t('shortlinks', 'Create') }}
			</NcButton>
		</template>
	</NcDialog>
</template>
