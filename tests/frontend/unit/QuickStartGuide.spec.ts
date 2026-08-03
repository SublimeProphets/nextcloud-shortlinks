import { fireEvent, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuickStartGuide from '../../../src/components/QuickStartGuide.vue'
import type { FolderIcon } from '../../../src/types'

const { apiMock, showSuccessMock } = vi.hoisted(() => ({
	apiMock: {
		getUserSettings: vi.fn().mockResolvedValue({ aliasStrategy: 'shortest', urlMode: 'inherit', baseUrl: '' }),
		updateUserSettings: vi.fn(),
		createFolder: vi.fn(),
		createTag: vi.fn(),
	},
	showSuccessMock: vi.fn(),
}))

vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: showSuccessMock }))

const global = {
	stubs: {
		NcButton: { props: ['disabled'], template: '<button :disabled="disabled" v-bind="$attrs"><slot/><slot name="icon"/></button>' },
		NcIconSvgWrapper: true,
		NcTextField: true,
		BookmarkletGuide: true,
		FolderForm: {
			props: ['folders'],
			emits: ['close', 'save'],
			template: '<div role="dialog"><button @click="$emit(\'save\', { name: \'Research\', parentId: null, icon: \'star\' })">Submit custom folder</button></div>',
		},
	},
}

function folderResult(id: number, name: string, icon: FolderIcon) {
	return { id, parentId: null, name, icon, position: id, count: 0 }
}

async function openFolderStep(view: ReturnType<typeof render>) {
	await fireEvent.click(view.getByRole('button', { name: 'Skip this step' }))
	await fireEvent.click(view.getByRole('button', { name: 'Skip this step' }))
}

describe('QuickStartGuide folder step', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		apiMock.getUserSettings.mockResolvedValue({ aliasStrategy: 'shortest', urlMode: 'inherit', baseUrl: '' })
		apiMock.createFolder.mockImplementation(async (name: string, _parentId: number | null, icon: FolderIcon) => folderResult(apiMock.createFolder.mock.calls.length, name, icon))
	})

	it('offers useful examples and creates several selected folders together', async () => {
		const view = render(QuickStartGuide, { props: { folders: [], tags: [] }, global })
		await openFolderStep(view)

		expect(view.getByRole('button', { name: /Projects/ }).getAttribute('aria-pressed')).toBe('true')
		expect(view.getByRole('button', { name: /Read later/ })).toBeTruthy()
		await fireEvent.click(view.getByRole('button', { name: /Team/ }))
		await fireEvent.click(view.getByRole('button', { name: 'Continue' }))

		await waitFor(() => expect(apiMock.createFolder).toHaveBeenCalledTimes(2))
		expect(apiMock.createFolder).toHaveBeenNthCalledWith(1, 'Projects', null, 'projects')
		expect(apiMock.createFolder).toHaveBeenNthCalledWith(2, 'Team', null, 'work')
		expect(view.emitted('changed')).toHaveLength(1)
	})

	it('places the full folder dialog action last and keeps newly created folders visible', async () => {
		const view = render(QuickStartGuide, { props: { folders: [], tags: [] }, global })
		await openFolderStep(view)

		const cards = view.container.querySelectorAll('.option-grid > .choice-card')
		expect(cards.item(cards.length - 1).textContent).toContain('Create a custom folder')
		expect(cards.item(cards.length - 1).classList.contains('choice-card--create')).toBe(true)

		await fireEvent.click(view.getByRole('button', { name: /Create a custom folder/ }))
		await fireEvent.click(view.getByRole('button', { name: 'Submit custom folder' }))

		await waitFor(() => expect(apiMock.createFolder).toHaveBeenCalledWith('Research', null, 'star'))
		expect(view.queryByRole('dialog')).toBeNull()
		expect(view.getByText('Research')).toBeTruthy()
		expect(showSuccessMock).toHaveBeenCalledWith('Folder created. You can add another one.')
	})
})
