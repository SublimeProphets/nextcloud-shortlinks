import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import StatsOverview from '../../../src/components/StatsOverview.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: { statsOverview: vi.fn() } }))
vi.mock('../../../src/api/client', () => ({ api: apiMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const overview = {
	totalLinks: 4,
	activeLinks: 3,
	totalClicks: 12,
	uniqueVisitors: 5,
	clicksToday: 2,
	clicks7Days: 7,
	clicks30Days: 12,
	periodClicks: 9,
	topLinks: [{ id: 1, slug: 'campaign', title: 'Campaign', clicks: 8 }],
	leastUsedLinks: [],
	newestLinks: [],
	dimensions: { browser: [{ value: 'Firefox', clicks: 5, uniqueVisitors: 3 }] },
}

describe('StatsOverview', () => {
	it('loads metrics and renders accessible table fallbacks', async () => {
		apiMock.statsOverview.mockResolvedValue(overview)
		const view = render(StatsOverview, { global: { stubs: { NcDialog: { template: '<div><slot/><slot name="actions"/></div>' }, NcButton: { template: '<button v-bind="$attrs"><slot/></button>' }, NcLoadingIcon: true } } })
		expect((await view.findAllByText('Campaign')).length).toBeGreaterThan(0)
		expect(view.getAllByText('Firefox').length).toBeGreaterThan(0)
		expect(view.getAllByRole('table')).toHaveLength(2)
		await fireEvent.click(view.getByRole('button', { name: 'Last 7 days' }))
		expect(apiMock.statsOverview).toHaveBeenCalledTimes(2)
	})

	it('emits close from the dialog action', async () => {
		apiMock.statsOverview.mockResolvedValue(overview)
		const view = render(StatsOverview, { global: { stubs: { NcDialog: { template: '<div><slot/><slot name="actions"/></div>' }, NcButton: { template: '<button v-bind="$attrs"><slot/></button>' }, NcLoadingIcon: true } } })
		await fireEvent.click(await view.findByRole('button', { name: 'Close' }))
		expect(view.emitted('close')).toHaveLength(1)
	})
})
