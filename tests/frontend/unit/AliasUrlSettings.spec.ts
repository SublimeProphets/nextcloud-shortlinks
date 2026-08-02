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
	it('automatically saves readable alias preferences without a save button', async () => {
		apiMock.getUserSettings.mockResolvedValue({ ...response })
		apiMock.updateUserSettings.mockImplementation(async value => ({ ...response, ...value }))
		const view = render(AliasUrlSettings, { props: { section: 'alias' }, global })
		await view.findByText('Choose how the editable alias field is prefilled when you create a link.')
		await fireEvent.update(view.getByLabelText('Alias strategy'), 'readable')
		await vi.waitFor(() => expect(apiMock.updateUserSettings).toHaveBeenCalled(), { timeout: 1500 })

		expect(apiMock.updateUserSettings).toHaveBeenCalledWith(expect.objectContaining({
			aliasStrategy: 'readable',
			collisionStrategy: 'random',
		}))
		expect(view.queryByRole('button', { name: 'Save' })).toBeNull()
		expect(view.emitted('saved')).toHaveLength(1)
	})

	it('saves a personal URL domain explicitly', async () => {
		apiMock.getUserSettings.mockResolvedValue({ ...response })
		apiMock.updateUserSettings.mockImplementation(async value => ({ ...response, ...value, shortUrlTemplate: 'https://go.example/{alias}' }))
		const view = render(AliasUrlSettings, { props: { section: 'url' }, global })
		await view.findByText('Keep the global URL, append the alias to your own domain, or define an expert transformation.')
		await fireEvent.update(view.getByLabelText('URL format'), 'simple')
		await fireEvent.update(view.getByLabelText('Short-link domain or base URL'), 'https://go.example')
		await fireEvent.click(view.getByRole('button', { name: 'Save' }))

		expect(apiMock.updateUserSettings).toHaveBeenCalledWith(expect.objectContaining({
			urlMode: 'simple',
			baseUrl: 'https://go.example',
		}))
		expect(view.emitted('saved')).toHaveLength(1)
	})
})
