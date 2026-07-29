import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Navigation from '../../../src/components/Navigation.vue'

const global = {
	stubs: {
		NcAppNavigation: { template: '<nav><slot/><slot name="footer"/></nav>' },
		NcAppNavigationCaption: { props: ['name'], template: '<h2>{{name}}</h2>' },
		NcAppNavigationItem: { props: ['name'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{name}}</button>' },
		NcIconSvgWrapper: true,
	},
}

describe('Navigation', () => {
	it('emits system and tag filters from keyboard-operable buttons', async () => {
		const view = render(Navigation, { props: { folders: [], tags: [{ id: 4, name: 'Launch', color: null, count: 2 }], activeSystem: 'all', activeFolderId: null, activeTagIds: [] }, global })
		await fireEvent.click(view.getByRole('button', { name: 'Favorites' }))
		await fireEvent.click(view.getByRole('button', { name: 'Launch' }))
		expect(view.emitted('filter')?.[0]).toEqual([{ system: 'favorites', folderId: null }])
		expect(view.emitted('tag')?.[0]).toEqual([4])
	})

	it('provides dashboard, trending, trash, and settings navigation', async () => {
		const view = render(Navigation, { props: { folders: [], tags: [], activeSystem: 'dashboard', activeFolderId: null, activeTagIds: [] }, global })
		await fireEvent.click(view.getByRole('button', { name: 'Dashboard' }))
		await fireEvent.click(view.getByRole('button', { name: 'Trending links' }))
		await fireEvent.click(view.getByRole('button', { name: 'Trash' }))
		await fireEvent.click(view.getByRole('button', { name: 'Settings' }))
		expect(view.emitted('filter')?.[0]).toEqual([{ system: 'dashboard', folderId: null }])
		expect(view.emitted('filter')?.[1]).toEqual([{ system: 'trending', folderId: null }])
		expect(view.emitted('filter')?.[2]).toEqual([{ system: 'trash', folderId: null }])
		expect(view.emitted('settings')).toHaveLength(1)
	})
})
