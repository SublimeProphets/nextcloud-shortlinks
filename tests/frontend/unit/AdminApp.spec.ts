import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AdminApp from '../../../src/components/AdminApp.vue'

const { axiosMock } = vi.hoisted(() => ({ axiosMock: { put: vi.fn(), post: vi.fn() } }))
vi.mock('@nextcloud/axios', () => ({ default: axiosMock }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showSuccess: vi.fn() }))
vi.mock('@nextcloud/router', () => ({ generateUrl: (path: string, params?: Record<string, string>) => params?.action ? path.replace('{action}', params.action) : path }))
vi.mock('@nextcloud/initial-state', () => ({
	loadState: (_app: string, key: string) => {
		if (key === 'geo-status') return { readable: false, configured: false }
		if (key === 'system-status') return { phpVersion: '8.3.0', phpSupported: true, jobs: { 'Statistics aggregation': 1, 'Retention cleanup': 1, 'Visitor secret rotation': 1 } }
		if (key === 'thumbnail-status') return { total: 4, found: 2, refreshed: 3, lastRefresh: 1_700_000_000 }
		return {
			enabled: true,
			public_creation: false,
			public_owner_uid: '',
			creation_groups: [],
			public_creation_groups: [],
			max_links_per_user: 10000,
			alias_mode: 'random',
			alias_length: 7,
			alias_min_length: 4,
			alias_collision_mode: 'random',
			alias_suffix_length: 2,
			allow_user_alias_settings: true,
			allow_user_url_settings: true,
			reserved_aliases: [],
			allow_duplicate_targets: true,
			base_url: '',
			link_url_mode: 'simple',
			link_url_template: '',
			link_url_pattern: '',
			link_url_replacement: '',
			domain_allowlist: [],
			domain_blocklist: [],
			allowed_schemes: ['http', 'https'],
			redirect_statuses: [301, 302, 307, 308],
			title_fetch: false,
			stats_enabled: true,
			privacy_mode: 'detailed',
			respect_dnt: true,
			referrer_mode: 'domain',
			log_authenticated_users: false,
			record_bots: true,
			click_retention_days: 90,
			aggregate_retention_days: 365,
			audit_retention_days: 180,
			trash_retention_days: 30,
			geoip_path: '',
			admin_manage_all: false,
			legacy_api: false,
			api_tokens: false,
			user_deletion_mode: 'retain',
		}
	},
}))

const global = {
	stubs: {
		NcButton: { template: '<button v-bind="$attrs"><slot/></button>' },
		NcCheckboxRadioSwitch: { props: ['modelValue'], emits: ['update:modelValue'], template: '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', !modelValue)"><slot/></label>' },
		NcNoteCard: { props: ['heading', 'text'], template: '<aside><strong>{{heading}}</strong>{{text}}<slot/></aside>' },
		NcSettingsSection: { props: ['name', 'description'], template: '<section><h2>{{name}}</h2><p>{{description}}</p><slot/></section>' },
		NcTextArea: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></label>' },
		NcTextField: { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<label>{{label}}<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></label>' },
	},
}

describe('AdminApp', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		axiosMock.put.mockResolvedValue({ data: {} })
		axiosMock.post.mockResolvedValue({ data: {} })
	})

	it('saves validated settings through the protected app route', async () => {
		const view = render(AdminApp, { global })
		await fireEvent.click(view.getByRole('button', { name: 'Save' }))
		expect(axiosMock.put).toHaveBeenCalledWith('/apps/shortlinks/settings/admin', expect.objectContaining({ enabled: true, allowed_schemes: ['http', 'https'] }))
	})

	it('runs bounded maintenance actions from the system status panel', async () => {
		const view = render(AdminApp, { global })
		await fireEvent.click(view.getByRole('button', { name: 'Aggregate now' }))
		expect(axiosMock.post).toHaveBeenCalledWith('/apps/shortlinks/settings/admin/maintenance/aggregate', undefined, { params: undefined })
	})

	it('adds custom redirect status codes and URL schemes', async () => {
		const view = render(AdminApp, { global })
		await fireEvent.update(view.getByLabelText('Custom redirect status code'), '303')
		await fireEvent.click(view.getAllByRole('button', { name: 'Add' })[0]!)
		await fireEvent.update(view.getByLabelText('Custom URL scheme'), 'mailto')
		await fireEvent.click(view.getAllByRole('button', { name: 'Add' })[1]!)
		await fireEvent.click(view.getByRole('button', { name: 'Save' }))

		expect(axiosMock.put).toHaveBeenCalledWith('/apps/shortlinks/settings/admin', expect.objectContaining({
			allowed_schemes: ['http', 'https', 'mailto'],
			redirect_statuses: [301, 302, 303, 307, 308],
		}))
	})

	it('refreshes existing thumbnails in bounded batches', async () => {
		axiosMock.post.mockResolvedValueOnce({
			data: {
				data: {
					processed: 2,
					found: 1,
					failed: 1,
					nextAfterId: 4,
					hasMore: false,
					stats: { total: 4, found: 3, refreshed: 4, lastRefresh: 1_700_000_100 },
				},
			},
		})
		const view = render(AdminApp, { global })
		await fireEvent.click(view.getByRole('button', { name: 'Refresh all thumbnails' }))
		expect(axiosMock.post).toHaveBeenCalledWith('/apps/shortlinks/settings/admin/thumbnails/refresh', {
			afterId: 0,
			limit: 5,
			onlyMissing: false,
		})
		expect(view.getByText('3')).toBeTruthy()
	})
})
