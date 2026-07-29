import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Navigation from '../../../src/components/Navigation.vue'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		createFolder: vi.fn(),
		createTag: vi.fn(),
		updateFolder: vi.fn(),
		deleteFolder: vi.fn(),
		updateTag: vi.fn(),
		mergeTag: vi.fn(),
		deleteTag: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const global = {
	stubs: {
		NcAppNavigation: { template: '<nav><slot name="header"/><slot/></nav>' },
		NcAppNavigationCaption: { props: ['name'], template: '<h2>{{name}}</h2>' },
		NcAppNavigationItem: { props: ['name'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{name}}</button>' },
		NcButton: { template: '<button v-bind="$attrs"><slot/></button>' },
		NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' },
	},
}

describe('Navigation', () => {
	beforeEach(() => vi.clearAllMocks())

	it('creates folders and tags and announces a collection refresh', async () => {
		apiMock.createFolder.mockResolvedValue({ id: 3 })
		apiMock.createTag.mockResolvedValue({ id: 4 })
		const view = render(Navigation, { props: { folders: [], tags: [], activeSystem: 'all', activeFolderId: null, activeTagIds: [] }, global })
		await fireEvent.update(view.getByLabelText('New folder'), 'Campaigns')
		await fireEvent.submit(view.getByLabelText('New folder').closest('form')!)
		await fireEvent.update(view.getByLabelText('New tag'), 'Launch')
		await fireEvent.submit(view.getByLabelText('New tag').closest('form')!)
		expect(apiMock.createFolder).toHaveBeenCalledWith('Campaigns', null)
		expect(apiMock.createTag).toHaveBeenCalledWith('Launch')
		expect(view.emitted('changed')).toHaveLength(2)
	})

	it('emits system and tag filters from keyboard-operable buttons', async () => {
		const view = render(Navigation, { props: { folders: [], tags: [{ id: 4, name: 'Launch', color: null, count: 2 }], activeSystem: 'all', activeFolderId: null, activeTagIds: [] }, global })
		await fireEvent.click(view.getByRole('button', { name: 'Favorites' }))
		await fireEvent.click(view.getByRole('button', { name: 'Launch (2)' }))
		expect(view.emitted('filter')?.[0]).toEqual([{ system: 'favorites', folderId: null }])
		expect(view.emitted('tag')?.[0]).toEqual([4])
	})
})
