import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import CompactLinkCard from '../../../src/components/CompactLinkCard.vue'
import type { ShortLink } from '../../../src/types'

vi.mock('../../../src/api/client', () => ({
	api: {
		thumbnailUrl: (id: number) => `/thumbnail/${id}`,
		qrUrl: (id: number) => `/qr/${id}`,
	},
}))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))

const link: ShortLink = {
	id: 7,
	ownerUid: 'alice',
	folderId: null,
	slug: 'campaign',
	shortUrl: 'https://go.example/a/very/long/path/campaign',
	targetUrl: 'https://example.com',
	title: 'Campaign',
	description: null,
	favorite: false,
	active: true,
	accessMode: 'public',
	passwordProtected: false,
	redirectStatus: 302,
	startsAt: null,
	expiresAt: null,
	clickLimit: null,
	clickCount: 12,
	lastClickedAt: null,
	createdAt: Math.floor(Date.now() / 1000),
	updatedAt: Math.floor(Date.now() / 1000),
	deletedAt: null,
	version: 1,
	tags: [],
	canEdit: true,
	canShare: true,
}

describe('CompactLinkCard', () => {
	it('shows only the slug and opens details when the card is clicked', async () => {
		const view = render(CompactLinkCard, {
			props: { link },
			global: {
				stubs: {
					NcButton: { template: '<button v-bind="$attrs"><slot/><slot name="icon"/></button>' },
					NcIconSvgWrapper: true,
					LinkThumbnail: true,
				},
			},
		})
		expect(view.getByText('.../campaign')).toBeTruthy()
		expect(view.queryByText(link.shortUrl)).toBeNull()
		await fireEvent.click(view.getByRole('button', { name: 'Open details for {title}' }))
		expect(view.emitted('open')?.[0]).toEqual([link])
	})
})
