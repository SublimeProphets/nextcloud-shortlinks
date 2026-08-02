import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import LinkForm from '../../../src/components/LinkForm.vue'
import type { LinkDraft } from '../../../src/types'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		aliasAvailable: vi.fn().mockResolvedValue({ available: true }),
		suggestAlias: vi.fn().mockResolvedValue({ slug: 'example' }),
		fetchMetadata: vi.fn(),
		previewThumbnailUrl: vi.fn().mockReturnValue('/thumbnail/preview'),
		createTag: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const global = { stubs: { NcDialog: { template: '<div><slot/><slot name="actions"/></div>' }, NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' }, NcTextArea: true, NcButton: { template: '<button v-bind="$attrs"><slot/></button>' }, NcSelect: true, NcCheckboxRadioSwitch: true } }

describe('LinkForm', () => {
	it('keeps entered values and submits a valid draft', async () => {
		const view = render(LinkForm, { props: { folders: [], tags: [], prefillUrl: 'https://example.com', prefillTitle: 'Example', prefillAlias: 'example' }, global })
		expect(view.getByDisplayValue('https://example.com')).toBeTruthy()
		await vi.waitFor(() => expect(apiMock.aliasAvailable).toHaveBeenCalledWith('example'))
		await fireEvent.submit(view.container.querySelector('form')!)
		const saves = view.emitted('save') as Array<[Partial<LinkDraft>]>
		expect(saves[0]?.[0]).toMatchObject({ targetUrl: 'https://example.com', title: 'Example' })
	})

	it('automatically previews metadata when the administrator enabled the feature', async () => {
		apiMock.fetchMetadata.mockResolvedValueOnce({ title: 'Fetched title', hasThumbnail: false })
		const view = render(LinkForm, { props: { folders: [], tags: [], prefillUrl: 'https://example.com', prefillAlias: 'example', allowTitleFetch: true }, global })
		expect(await view.findByDisplayValue('Fetched title', {}, { timeout: 1500 })).toBeTruthy()
		expect(apiMock.fetchMetadata).toHaveBeenCalledWith('https://example.com')
	})
})
