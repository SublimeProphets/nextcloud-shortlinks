import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import QuickLinkCreator from '../../../src/components/QuickLinkCreator.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		aliasAvailable: vi.fn().mockResolvedValue({ available: true }),
		suggestAlias: vi.fn().mockResolvedValue({ slug: 'bright-link' }),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))

const global = {
	stubs: {
		NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' },
		NcTextArea: true,
		NcButton: { template: '<button v-bind="$attrs"><slot/><slot name="icon"/></button>' },
		NcCheckboxRadioSwitch: true,
		NcIconSvgWrapper: true,
	},
}

describe('QuickLinkCreator', () => {
	it('shows a generated editable alias and creates only after a URL is entered', async () => {
		const create = vi.fn().mockResolvedValue(undefined)
		const view = render(QuickLinkCreator, { props: { folders: [], tags: [], create, baseUrl: 'https://go.example' }, global })
		await vi.waitFor(() => expect(view.getByText('bright-link')).toBeTruthy())
		const button = view.getByRole('button', { name: 'Create' }) as HTMLButtonElement
		expect(button.disabled).toBe(true)
		await fireEvent.update(view.getByLabelText('Destination URL'), 'https://example.com/long')
		await vi.waitFor(() => expect(button.disabled).toBe(false))
		await fireEvent.click(button)
		expect(create).toHaveBeenCalledWith(expect.objectContaining({ targetUrl: 'https://example.com/long', slug: 'bright-link' }))
	})
})
