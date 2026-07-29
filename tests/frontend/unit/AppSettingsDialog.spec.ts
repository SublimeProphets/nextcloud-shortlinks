import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import AppSettingsDialog from '../../../src/components/AppSettingsDialog.vue'
import type { Folder } from '../../../src/types'

const { apiMock } = vi.hoisted(() => ({
	apiMock: {
		reorderFolders: vi.fn().mockResolvedValue([]),
		deleteFolder: vi.fn().mockResolvedValue({}),
		createFolder: vi.fn(),
		updateFolder: vi.fn(),
		createTag: vi.fn(),
		updateTag: vi.fn(),
		deleteTag: vi.fn(),
		mergeTag: vi.fn(),
	},
}))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))

const folders: Folder[] = [
	{ id: 1, parentId: null, name: 'Campaigns', icon: 'projects', position: 0, count: 1 },
	{ id: 3, parentId: 1, name: 'Summer', icon: 'folder', position: 0, count: 2 },
	{ id: 2, parentId: null, name: 'Archive', icon: 'archive', position: 1, count: 4 },
]
const global = {
	stubs: {
		NcAppSettingsDialog: { template: '<div><slot/></div>' },
		NcAppSettingsSection: { props: ['name'], template: '<section><h2>{{name}}</h2><slot/></section>' },
		NcButton: { template: '<button v-bind="$attrs"><slot/><slot name="icon"/></button>' },
		NcDialog: { props: ['name'], template: '<div role="dialog"><h2>{{name}}</h2><slot/><slot name="actions"/></div>' },
		NcEmptyContent: true,
		NcFormBoxButton: { props: ['label', 'description'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{label}} {{description}}<slot name="description"/></button>' },
		NcIconSvgWrapper: true,
		NcListItem: { props: ['name', 'details'], emits: ['click'], template: '<div><button @click="$emit(\'click\')">{{name}} {{details}}</button><slot name="actions"/></div>' },
		NcActionButton: { props: ['name', 'disabled'], emits: ['click'], template: '<button :disabled="disabled" @click="$emit(\'click\')">{{name}}</button>' },
		FolderForm: true,
		TagForm: true,
	},
}

describe('AppSettingsDialog', () => {
	it('reorders siblings with accessible arrow actions', async () => {
		apiMock.reorderFolders.mockClear()
		const view = render(AppSettingsDialog, { props: { open: true, folders, tags: [] }, global })
		await fireEvent.click(view.getAllByRole('button', { name: 'Move down' })[0]!)
		expect(apiMock.reorderFolders).toHaveBeenCalledWith(null, [2, 1])
		expect(view.emitted('changed')).toHaveLength(1)
	})

	it('shows the concrete subtree link count before destructive deletion', async () => {
		apiMock.deleteFolder.mockClear()
		const view = render(AppSettingsDialog, { props: { open: true, folders, tags: [] }, global })
		await fireEvent.click(view.getAllByRole('button', { name: 'Delete' })[0]!)
		expect(view.getByRole('button', { name: /Delete folder and links/ }).textContent).toContain('3')
		await fireEvent.click(view.getByRole('button', { name: /Delete folder and links/ }))
		expect(apiMock.deleteFolder).toHaveBeenCalledWith(1, true)
	})
})
