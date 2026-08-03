import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import PagePreview from '../../../src/components/PagePreview.vue'
import { defaultPageSectionOrder } from '../../../src/pageSections'
import type { Folder, LinkPageDraft, ShortLink } from '../../../src/types'

vi.mock('@nextcloud/router', () => ({ generateUrl: vi.fn((path: string) => path) }))

const folder: Folder = { id: 4, parentId: null, name: 'Campaigns', icon: 'folder', position: 0, count: 1 }
const link: ShortLink = {
	id: 1,
	ownerUid: 'alice',
	folderId: 4,
	slug: 'launch',
	shortUrl: 'https://cloud.example/r/launch',
	targetUrl: 'https://example.com/launch',
	title: 'Launch plan',
	description: null,
	favorite: false,
	active: true,
	accessMode: 'public',
	passwordProtected: false,
	redirectStatus: 302,
	startsAt: null,
	expiresAt: null,
	clickLimit: null,
	clickCount: 4,
	lastClickedAt: null,
	createdAt: 1,
	updatedAt: 1,
	deletedAt: null,
	version: 1,
	tags: [],
	canEdit: true,
	canShare: true,
}
const draft: LinkPageDraft = {
	slug: 'demo',
	title: 'Demo page',
	lead: 'A stable preview',
	accessMode: 'public',
	password: '',
	allowEmbedding: false,
	startsAt: null,
	expiresAt: null,
	folderIds: [],
	tagIds: [],
	linkIds: [1],
	filePaths: ['/Photos/cover.jpg'],
	contacts: [{ key: 'ada', name: 'Ada Lovelace', emails: [], phones: [], organization: 'Analytical Engines' }],
	userIds: [],
	groupIds: [],
	layout: 'cards',
	grouping: 'folder',
	visibleFields: ['title'],
	theme: { preset: 'nextcloud', primary: '#0082c9', background: '#ffffff', surface: '#f5f5f5', text: '#222222', font: 'system', baseSize: 16, scale: 100 },
	header: { brand: true, mark: true, title: true, lead: true, owner: true, compact: false, alignment: 'center' },
	footer: { enabled: false, brand: false, updated: false, attribution: '', linkIds: [] },
	sectionOrder: defaultPageSectionOrder(),
	active: true,
}
const global = { stubs: { NcIconSvgWrapper: { template: '<i />' } } }

describe('PagePreview', () => {
	it('keeps rendering when header alignment and grouping change', async () => {
		const view = render(PagePreview, { props: { draft, links: [link], folders: [folder] }, global })
		expect(view.getByRole('heading', { name: 'Demo page' })).toBeTruthy()

		await view.rerender({ draft: { ...draft, grouping: 'tag', header: { ...draft.header, alignment: 'left' } }, links: [link], folders: [folder] })

		expect(view.getByRole('heading', { name: 'Demo page' })).toBeTruthy()
		expect(view.container.querySelector('.page-preview__header--left')).toBeTruthy()
		expect(view.getByRole('heading', { name: 'Without tag' })).toBeTruthy()
	})

	it('reflects the chosen content section order immediately', () => {
		const orderedDraft: LinkPageDraft = {
			...draft,
			sectionOrder: { ...defaultPageSectionOrder(), content: ['contacts', 'files', 'links', 'sources'] },
		}
		const view = render(PagePreview, { props: { draft: orderedDraft, links: [link], folders: [folder] }, global })
		const headings = [...view.container.querySelectorAll('.page-preview__groups > section > h2')].map(element => element.textContent?.trim())

		expect(headings).toEqual(['Contacts', 'Files', 'Campaigns'])
	})
})
