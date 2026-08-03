<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { api } from '../api/client'

const props = withDefaults(defineProps<{
	kind?: 'import-compatibility' | 'general' | 'bug' | 'development'
	email?: string
}>(), { kind: 'general', email: '' })
const emit = defineEmits<{ sent: [] }>()
const sending = ref(false)
const form = reactive({ email: props.email, anonymous: false, name: '', details: '' })
watch(() => props.email, value => { if (!form.email) form.email = value })

async function submit() {
	sending.value = true
	try {
		await api.submitSuggestion({ kind: props.kind, ...form, email: form.anonymous ? '' : form.email })
		form.name = ''
		form.details = ''
		showSuccess(t('shortlinks', 'Thank you — your message was sent.'))
		emit('sent')
	} catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { sending.value = false }
}
</script>

<template>
	<form class="suggestion-form" @submit.prevent="submit">
		<NcTextField v-model="form.email"
			type="email"
			:disabled="form.anonymous"
			:label="t('shortlinks', 'Email address')"
			:helper-text="form.anonymous ? t('shortlinks', 'Your account and email address will not be included.') : t('shortlinks', 'Used only to reply to this request.')" />
		<NcCheckboxRadioSwitch v-model="form.anonymous" type="checkbox">
			{{ t('shortlinks', 'Submit anonymously') }}
		</NcCheckboxRadioSwitch>
		<NcTextField v-model="form.name" :label="kind === 'import-compatibility' ? t('shortlinks', 'Name of the service or import format') : t('shortlinks', 'Subject')" />
		<NcTextArea v-model="form.details"
			rows="6"
			resize="vertical"
			:label="t('shortlinks', 'Further information, details, or wishes')" />
		<NcButton type="submit" variant="primary" :disabled="sending || !form.name.trim() || !form.details.trim() || (!form.anonymous && !form.email.trim())">
			{{ sending ? t('shortlinks', 'Sending…') : t('shortlinks', 'Send request') }}
		</NcButton>
	</form>
</template>

<style scoped>
.suggestion-form { display: grid; inline-size: min(100%, 720px); gap: calc(var(--default-grid-baseline) * 3); }

.suggestion-form > :last-child { justify-self: start; }
</style>
