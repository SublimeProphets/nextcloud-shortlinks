import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../../../src/api/client'

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }))

vi.mock('@nextcloud/axios', () => ({ default: { request: requestMock } }))
vi.mock('@nextcloud/router', () => ({
	generateOcsUrl: (path: string) => `/ocs${path}`,
	generateUrl: (path: string, params: Record<string, number>) => path.replace('{id}', String(params.id)),
}))

describe('API client', () => {
	beforeEach(() => requestMock.mockReset())

	it('unwraps the OCS data envelope and sends bounded list parameters', async () => {
		requestMock.mockResolvedValue({ status: 200, data: { ocs: { data: { data: { items: [], pagination: { page: 1, perPage: 50, hasMore: 0 } }, error: null } } } })
		await expect(api.listLinks({ page: 1, perPage: 50 })).resolves.toMatchObject({ items: [] })
		expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET', url: '/ocs/apps/shortlinks/api/v1/links', params: { page: 1, perPage: 50 } }))
	})

	it('handles empty 204 responses', async () => {
		requestMock.mockResolvedValue({ status: 204, data: null })
		await expect(api.deleteLink(42, true)).resolves.toEqual({})
		expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({ method: 'DELETE', params: { permanent: true } }))
	})

	it('surfaces structured API errors', async () => {
		requestMock.mockResolvedValue({ status: 400, data: { ocs: { data: { data: null, error: { code: 'validation_error', message: 'Invalid target' } } } } })
		await expect(api.createLink({ targetUrl: 'javascript:alert(1)' })).rejects.toThrow('Invalid target')
	})

	it('builds an authenticated QR download URL', () => {
		expect(api.qrUrl(7, 'png')).toBe('/apps/shortlinks/qr/7?format=png')
	})
})
