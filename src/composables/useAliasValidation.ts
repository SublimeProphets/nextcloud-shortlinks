import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { t } from '@nextcloud/l10n'
import { api } from '../api/client'

export type AliasState = 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'

export function aliasSyntaxError(alias: string): string {
	if (!alias) return t('shortlinks', 'Enter an alias.')
	if (alias.length > 128) return t('shortlinks', 'The alias cannot be longer than 128 characters.')
	if (/\s/.test(alias)) return t('shortlinks', 'Spaces are not allowed in an alias.')
	if (!/^[A-Za-z0-9]/.test(alias)) return t('shortlinks', 'The alias must start with a letter or number.')
	if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(alias)) return t('shortlinks', 'Use only letters, numbers, hyphens, and underscores.')
	return ''
}

export function useAliasValidation(alias: Ref<string>, currentAlias = '') {
	const state = ref<AliasState>('idle')
	const serverMessage = ref('')
	let timer: ReturnType<typeof setTimeout> | undefined
	let requestId = 0
	let suggestionId = 0

	async function check(value = alias.value) {
		const syntaxError = aliasSyntaxError(value)
		if (syntaxError) {
			state.value = value ? 'invalid' : 'idle'
			serverMessage.value = ''
			return
		}
		if (value === currentAlias) {
			state.value = 'available'
			serverMessage.value = t('shortlinks', 'This is the current alias')
			return
		}
		const activeRequest = ++requestId
		state.value = 'checking'
		serverMessage.value = ''
		try {
			const result = await api.aliasAvailable(value)
			if (activeRequest !== requestId) return
			state.value = result.available ? 'available' : 'unavailable'
			serverMessage.value = result.available ? t('shortlinks', 'Alias is available') : t('shortlinks', 'Alias is already used')
		} catch (error) {
			if (activeRequest !== requestId) return
			state.value = 'invalid'
			serverMessage.value = error instanceof Error && error.message.includes('reserved')
				? t('shortlinks', 'This alias is reserved.')
				: t('shortlinks', 'The alias could not be checked.')
		}
	}

	watch(alias, value => {
		if (timer) clearTimeout(timer)
		const syntaxError = aliasSyntaxError(value)
		if (syntaxError) {
			state.value = value ? 'invalid' : 'idle'
			serverMessage.value = ''
			return
		}
		state.value = 'checking'
		timer = setTimeout(() => check(value), 350)
	}, { immediate: true })

	onBeforeUnmount(() => {
		if (timer) clearTimeout(timer)
	})

	const message = computed(() => aliasSyntaxError(alias.value) || serverMessage.value)
	const valid = computed(() => !aliasSyntaxError(alias.value) && state.value === 'available')

	async function suggest(context: { title?: string; targetUrl?: string } = {}) {
		const requestedFor = alias.value
		const activeSuggestion = ++suggestionId
		state.value = 'checking'
		try {
			const suggestion = await api.suggestAlias(context)
			if (activeSuggestion !== suggestionId || alias.value !== requestedFor) return
			alias.value = suggestion.slug
			await check(alias.value)
		} catch {
			if (activeSuggestion !== suggestionId || alias.value !== requestedFor) return
			state.value = 'invalid'
			serverMessage.value = t('shortlinks', 'An alias could not be generated. Try again.')
		}
	}

	return { check, message, state, suggest, valid }
}
