import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import AliasUrlSettings from '../../../src/components/AliasUrlSettings.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		getUserSettings: vi.fn(),
		updateUserSettings: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))

const response = {
	aliasStrategy: 'inherit' as const,
	collisionStrategy: 'random' as const,
	suffixLength: 2,
	urlMode: 'inherit' as const,
	baseUrl: '',
	urlTemplate: '',
	urlPattern: '',
	urlReplacement: '',
	allowAliasSettings: true,
	allowUrlSettings: true,
	globalAliasMode: 'random',
	globalUrlMode: 'simple',
	previewAlias: 'aB3x9Qz',
	previewUrl: 'https://cloud.example/apps/shortlinks/r/aB3x9Qz',
	shortUrlTemplate: 'https://cloud.example/apps/shortlinks/r/{alias}',
}
const global = {
	stubs: {
		NcButton: { template: '<button v-bind="$attrs"><slot/></button>' },
		NcLoadingIcon: true,
		NcNoteCard: { props: ['text'], template: '<aside>{{text}}</aside>' },
		NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' },
	},
}

describe('AliasUrlSettings', () => {
	it('saves readable aliases and a personal simple domain', async () => {
		apiMock.getUserSettings.mockResolvedValue({ ...response })
		apiMock.updateUserSettings.mockImplementation(async value => ({ ...response, ...value, shortUrlTemplate: 'https://go.example/{alias}' }))
		const view = render(AliasUrlSettings, { global })
		await view.findByText('Automatic aliases')
		await fireEvent.update(view.getByLabelText('Alias strategy'), 'readable')
		await fireEvent.update(view.getByLabelText('URL format'), 'simple')
		await fireEvent.update(view.getByLabelText('Short-link domain or base URL'), 'https://go.example')
		await fireEvent.click(view.getByRole('button', { name: 'Save' }))

		expect(apiMock.updateUserSettings).toHaveBeenCalledWith(expect.objectContaining({
			aliasStrategy: 'readable',
			collisionStrategy: 'random',
			urlMode: 'simple',
			baseUrl: 'https://go.example',
		}))
		expect(view.emitted('saved')).toHaveLength(1)
	})
})
