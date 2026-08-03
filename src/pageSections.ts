import type { PageEditorTab, PageSectionOrder } from './types'

export const pageSectionIds: Record<PageEditorTab, readonly string[]> = {
	general: ['identity', 'access'],
	content: ['sources', 'links', 'files', 'contacts'],
	design: ['layout', 'theme', 'grouping', 'visible', 'customizing', 'header', 'footer'],
}

export function defaultPageSectionOrder(): PageSectionOrder {
	return {
		general: [...pageSectionIds.general],
		content: [...pageSectionIds.content],
		design: [...pageSectionIds.design],
	}
}

export function normalizePageSectionOrder(value?: Partial<PageSectionOrder> | null): PageSectionOrder {
	const defaults = defaultPageSectionOrder()
	return (Object.keys(defaults) as PageEditorTab[]).reduce((result, tab) => {
		const allowed = new Set(pageSectionIds[tab])
		const supplied = Array.isArray(value?.[tab]) ? value[tab] : []
		const ordered = [...new Set(supplied.filter(id => typeof id === 'string' && allowed.has(id)))]
		result[tab] = [...ordered, ...defaults[tab].filter(id => !ordered.includes(id))]
		return result
	}, defaultPageSectionOrder())
}

export function movePageSection(order: PageSectionOrder, tab: PageEditorTab, id: string, targetIndex: number): PageSectionOrder {
	const current = [...order[tab]]
	const sourceIndex = current.indexOf(id)
	if (sourceIndex < 0) return normalizePageSectionOrder(order)
	current.splice(sourceIndex, 1)
	current.splice(Math.max(0, Math.min(targetIndex, current.length)), 0, id)
	return normalizePageSectionOrder({ ...order, [tab]: current })
}

export function publicPageContentOrder(order: PageSectionOrder): Array<'links' | 'files' | 'contacts'> {
	const result: Array<'links' | 'files' | 'contacts'> = []
	for (const id of order.content) {
		const content = id === 'sources' || id === 'links' ? 'links' : id === 'files' || id === 'contacts' ? id : null
		if (content && !result.includes(content)) result.push(content)
	}
	for (const content of ['links', 'files', 'contacts'] as const) {
		if (!result.includes(content)) result.push(content)
	}
	return result
}
