import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import LinkForm from '../../../src/components/LinkForm.vue'
import type { LinkDraft } from '../../../src/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: { aliasAvailable: vi.fn().mockResolvedValue({ available: true }), fetchTitle: vi.fn(), createTag: vi.fn() } }))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const global = { stubs: { NcDialog: { template: '<div><slot/><slot name="actions"/></div>' }, NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' }, NcTextArea: true, NcButton: { template: '<button v-bind="$attrs"><slot/></button>' }, NcSelect: true, NcCheckboxRadioSwitch: true } }

describe('LinkForm', () => {
	it('keeps entered values and submits a valid draft', async () => {
		const view = render(LinkForm, { props: { folders: [], tags: [], prefillUrl: 'https://example.com', prefillTitle: 'Example' }, global })
		expect(view.getByDisplayValue('https://example.com')).toBeTruthy()
		await fireEvent.submit(view.container.querySelector('form')!)
		const saves = view.emitted('save') as Array<[Partial<LinkDraft>]>
		expect(saves[0]?.[0]).toMatchObject({ targetUrl: 'https://example.com', title: 'Example' })
	})

	it('fetches a title only when the administrator enabled the feature', async () => {
		apiMock.fetchTitle.mockResolvedValueOnce({ title: 'Fetched title' })
		const view = render(LinkForm, { props: { folders: [], tags: [], prefillUrl: 'https://example.com', allowTitleFetch: true }, global })
		await fireEvent.click(view.getByRole('button', { name: 'Fetch title' }))
		expect(await view.findByDisplayValue('Fetched title')).toBeTruthy()
		expect(apiMock.fetchTitle).toHaveBeenCalledWith('https://example.com')
	})
})
