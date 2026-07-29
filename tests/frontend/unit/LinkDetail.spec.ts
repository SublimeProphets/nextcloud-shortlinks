import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ShortLink } from '../../../src/types'

import LinkDetail from '../../../src/components/LinkDetail.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		stats: vi.fn(),
		activity: vi.fn(),
		shares: vi.fn(),
		updateLink: vi.fn(),
		createShare: vi.fn(),
		deleteShare: vi.fn(),
		exportStats: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/vue/components/NcButton', () => ({ default: { template: '<button v-bind="$attrs"><slot/></button>' } }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const link = (canShare: boolean): ShortLink => ({
	id: 1,
	ownerUid: 'alice',
	folderId: null,
	slug: 'example',
	shortUrl: 'https://cloud.test/r/example',
	targetUrl: 'https://example.com',
	title: 'Example',
	description: null,
	favorite: false,
	active: true,
	accessMode: 'public',
	passwordProtected: false,
	redirectStatus: 302,
	startsAt: null,
	expiresAt: null,
	clickLimit: null,
	clickCount: 3,
	lastClickedAt: null,
	createdAt: 1,
	updatedAt: 1,
	deletedAt: null,
	version: 1,
	tags: [],
	canEdit: true,
	canShare,
})

const options = { global: { stubs: { NcButton: { template: '<button v-bind="$attrs"><slot/></button>' } } } }

describe('LinkDetail permissions', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		apiMock.shares.mockResolvedValue([])
	})

	it('does not expose delegation controls to a shared editor', () => {
		const view = render(LinkDetail, { props: { link: link(false) }, ...options })
		expect(view.queryByRole('button', { name: 'shares' })).toBeNull()
		expect(view.getByRole('button', { name: 'Edit' })).toBeTruthy()
	})

	it('allows an owner to open share management', async () => {
		const view = render(LinkDetail, { props: { link: link(true) }, ...options })
		await fireEvent.click(view.getByRole('button', { name: 'shares' }))
		expect(apiMock.shares).toHaveBeenCalledWith(1)
		expect(view.getByText('Shares and access')).toBeTruthy()
	})
})
