import { describe, expect, it } from 'vitest'
import { defaultPageSectionOrder, movePageSection, normalizePageSectionOrder, publicPageContentOrder } from '../../../src/pageSections'

describe('page sections', () => {
	it('keeps valid custom order and restores missing sections', () => {
		const order = normalizePageSectionOrder({
			general: ['access', 'unknown', 'access'],
			content: ['files', 'contacts', 'links'],
			design: ['footer', 'layout'],
		})

		expect(order.general).toEqual(['access', 'identity'])
		expect(order.content).toEqual(['files', 'contacts', 'links', 'sources'])
		expect(order.design).toEqual(['footer', 'layout', 'theme', 'grouping', 'visible', 'customizing', 'header'])
	})

	it('moves sections without mutating the source order', () => {
		const original = defaultPageSectionOrder()
		const moved = movePageSection(original, 'content', 'files', 0)

		expect(moved.content).toEqual(['files', 'sources', 'links', 'contacts'])
		expect(original.content).toEqual(['sources', 'links', 'files', 'contacts'])
	})

	it('maps editor source sections to one public links section', () => {
		const order = normalizePageSectionOrder({ content: ['contacts', 'files', 'links', 'sources'] })
		expect(publicPageContentOrder(order)).toEqual(['contacts', 'files', 'links'])
	})
})
