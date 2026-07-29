import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import QuickLinkCreator from '../../../src/components/QuickLinkCreator.vue'
import type { ShortLink } from '../../../src/types'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		aliasAvailable: vi.fn().mockResolvedValue({ available: true }),
		suggestAlias: vi.fn().mockResolvedValue({ slug: 'bright-link' }),
		qrUrl: vi.fn((id: number) => `/apps/shortlinks/qr/${id}?format=svg`),
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

const createdLink: ShortLink = {
	id: 42,
	ownerUid: 'alice',
	folderId: null,
	slug: 'bright-link',
	shortUrl: 'https://go.example/bright-link',
	targetUrl: 'https://example.com/long',
	title: 'Bright link',
	description: null,
	favorite: false,
	active: true,
	accessMode: 'public',
	passwordProtected: false,
	redirectStatus: 302,
	startsAt: null,
	expiresAt: null,
	clickLimit: null,
	clickCount: 0,
	lastClickedAt: null,
	createdAt: 1_785_321_600,
	updatedAt: 1_785_321_600,
	deletedAt: null,
	version: 1,
	tags: [],
	canEdit: true,
	canShare: true,
}

describe('QuickLinkCreator', () => {
	it('shows a generated editable alias and creates only after a URL is entered', async () => {
		const create = vi.fn().mockResolvedValue(createdLink)
		const view = render(QuickLinkCreator, { props: { folders: [], tags: [], create, shortUrlTemplate: 'https://go.example/{alias}' }, global })
		await vi.waitFor(() => expect(view.getByText('bright-link')).toBeTruthy())
		const button = view.getByRole('button', { name: 'Create' }) as HTMLButtonElement
		expect(button.disabled).toBe(true)
		await fireEvent.update(view.getByLabelText('Destination URL'), 'https://example.com/long')
		await vi.waitFor(() => expect(button.disabled).toBe(false))
		await fireEvent.click(button)
		expect(create).toHaveBeenCalledWith(expect.objectContaining({ targetUrl: 'https://example.com/long', slug: 'bright-link' }))
		await vi.waitFor(() => expect(view.getByRole('heading', { name: 'Bright link' })).toBeTruthy())
		expect(view.getByRole('link', { name: 'https://go.example/bright-link' })).toBeTruthy()
		expect(view.getByRole('button', { name: 'Copy QR code as SVG' })).toBeTruthy()
		const download = view.getByRole('button', { name: 'Download QR code' })
		expect(download.getAttribute('href')).toBe('/apps/shortlinks/qr/42?format=svg')
		expect(download.getAttribute('download')).toBe('bright-link-qr.svg')
	})
})
