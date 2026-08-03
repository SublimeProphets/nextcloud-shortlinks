import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ContentToolbar from '../../../src/components/ContentToolbar.vue'

const { apiMock, eventBusMock } = vi.hoisted(() => ({
	apiMock: {
		exportLinks: vi.fn(),
		importLinks: vi.fn(),
	},
	eventBusMock: {
		emit: vi.fn(),
		subscribe: vi.fn(),
		unsubscribe: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))
vi.mock('@nextcloud/event-bus', () => eventBusMock)

const props = {
	folders: [
		{ id: 1, parentId: null, name: 'Work', icon: 'folder' as const, position: 0, count: 2 },
		{ id: 2, parentId: null, name: 'Archive', icon: 'archive' as const, position: 1, count: 1 },
		{ id: 3, parentId: 1, name: 'Projects', icon: 'projects' as const, position: 0, count: 1 },
		{ id: 4, parentId: 1, name: 'Clients', icon: 'work' as const, position: 1, count: 1 },
	],
	tags: [{ id: 8, name: 'Launch', color: '#336699', count: 2 }],
	system: 'all',
	folderId: 3,
	tagIds: [8],
	tagMode: 'and' as const,
	search: 'summer',
	createdFrom: 123,
	active: true,
	listMode: true,
}

const global = {
	stubs: {
		CreateMenu: { emits: ['link', 'folder', 'tag'], template: '<button @click="$emit(\'link\')">New</button>' },
		NcActionButton: { props: ['name'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{name}}</button>' },
		NcActions: { props: ['menuName'], template: '<div><button>{{menuName}}</button><slot name="icon"/><slot/></div>' },
		NcBreadcrumb: { props: ['name'], template: '<div><button>{{name}}</button><slot/></div>' },
		NcBreadcrumbs: { template: '<nav><slot/></nav>' },
		NcButton: { props: ['pressed'], emits: ['click'], template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot name="icon"/><slot/></button>' },
		NcCheckboxRadioSwitch: {
			props: ['modelValue', 'type', 'value', 'name'],
			emits: ['update:modelValue'],
			template: '<label><input :type="type" :name="name" :checked="type === \'radio\' ? modelValue === value : modelValue" @change="$emit(\'update:modelValue\', type === \'radio\' ? value : $event.target.checked)"><slot/></label>',
		},
		NcIconSvgWrapper: true,
		NcPopover: { template: '<div><slot name="trigger" :attrs="{}"/><slot/></div>' },
		NcTextField: {
			props: ['modelValue', 'label'],
			emits: ['update:modelValue'],
			template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>',
		},
	},
}

describe('ContentToolbar', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		apiMock.exportLinks.mockResolvedValue({ content: '{}', mimeType: 'application/json', filename: 'shortlinks.json' })
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
		vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
		vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
	})

	it('switches to a sibling from a folder breadcrumb', async () => {
		const view = render(ContentToolbar, { props, global })
		await fireEvent.click(view.getByRole('button', { name: 'Clients' }))
		expect(view.emitted('filter')).toContainEqual([{ system: 'all', folderId: 4 }])
	})

	it('places the navigation toggle first and controls the native navigation event', async () => {
		const view = render(ContentToolbar, { props, global })
		const buttons = view.getAllByRole('button')
		expect(buttons[0]?.getAttribute('aria-label')).toBe('Close navigation')
		expect(buttons[1]?.textContent).toContain('New')
		await fireEvent.click(buttons[0]!)
		expect(eventBusMock.emit).toHaveBeenCalledWith('toggle-navigation', { open: false })
	})

	it('applies text, age, and activity restrictions together', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-07-29T12:00:00Z'))
		const view = render(ContentToolbar, { props: { ...props, search: '', createdFrom: null, active: null }, global })
		await fireEvent.update(view.getByLabelText('Search'), 'release')
		await fireEvent.update(view.getByLabelText('Created'), 'week')
		await fireEvent.update(view.getByLabelText('Status'), 'active')
		await fireEvent.click(view.getByRole('button', { name: 'Apply search' }))
		expect(view.emitted('search')?.[0]).toEqual([{
			search: 'release',
			createdFrom: Math.floor(new Date('2026-07-29T12:00:00Z').getTime() / 1000) - 7 * 86_400,
			active: true,
		}])
		vi.useRealTimers()
	})

	it('exports the complete visible filter selection', async () => {
		const view = render(ContentToolbar, { props, global })
		await fireEvent.click(view.getByRole('button', { name: 'Export JSON' }))
		expect(apiMock.exportLinks).toHaveBeenCalledWith('json', {
			system: 'all',
			folderId: 3,
			tagIds: [8],
			tagMode: 'and',
			search: 'summer',
			createdFrom: 123,
			active: true,
		})
		expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
	})
})
