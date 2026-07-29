<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcTextField from '@nextcloud/vue/components/NcTextField'

interface AdminSettingsState {
	enabled: boolean
	public_creation: boolean
	public_owner_uid: string
	creation_groups: string[]
	public_creation_groups: string[]
	max_links_per_user: number
	alias_mode: 'random' | 'base36' | 'base62'
	alias_length: number
	alias_min_length: number
	reserved_aliases: string[]
	allow_duplicate_targets: boolean
	base_url: string
	domain_allowlist: string[]
	domain_blocklist: string[]
	allowed_schemes: string[]
	redirect_statuses: number[]
	title_fetch: boolean
	stats_enabled: boolean
	privacy_mode: 'counts' | 'detailed'
	respect_dnt: boolean
	referrer_mode: 'none' | 'domain' | 'path' | 'full'
	log_authenticated_users: boolean
	record_bots: boolean
	click_retention_days: number
	aggregate_retention_days: number
	audit_retention_days: number
	trash_retention_days: number
	geoip_path: string
	admin_manage_all: boolean
	legacy_api: boolean
	api_tokens: boolean
	user_deletion_mode: 'retain'
}

const settings = reactive(loadState<AdminSettingsState>('shortlinks', 'admin-settings'))
const lists = reactive({
	creation_groups: settings.creation_groups.join(', '),
	public_creation_groups: settings.public_creation_groups.join(', '),
	reserved_aliases: settings.reserved_aliases.join(', '),
	domain_allowlist: settings.domain_allowlist.join('\n'),
	domain_blocklist: settings.domain_blocklist.join('\n'),
})
const geo = loadState<Record<string, unknown>>('shortlinks', 'geo-status')
const systemStatus = loadState<{ phpVersion: string; phpSupported: boolean; jobs: Record<string, number> }>('shortlinks', 'system-status')
const saving = ref(false)
const maintenanceDays = ref(30)
const runningMaintenance = ref('')
/**
 *
 */
async function save() {
	saving.value = true
	try {
		const split = (value: string) => value.split(/[\n,]/).map(item => item.trim()).filter(Boolean)
		await axios.put(generateUrl('/apps/shortlinks/settings/admin'), { ...settings, creation_groups: split(lists.creation_groups), public_creation_groups: split(lists.public_creation_groups), reserved_aliases: split(lists.reserved_aliases), domain_allowlist: split(lists.domain_allowlist), domain_blocklist: split(lists.domain_blocklist) })
		showSuccess(t('shortlinks', 'Settings saved'))
	} catch (e) { showError(e instanceof Error ? e.message : String(e)) } finally { saving.value = false }
}
function toggleRedirectStatus(status: number) { settings.redirect_statuses = settings.redirect_statuses.includes(status) ? settings.redirect_statuses.filter(value => value !== status) : [...settings.redirect_statuses, status] }
function toggleScheme(scheme: string) { settings.allowed_schemes = settings.allowed_schemes.includes(scheme) ? settings.allowed_schemes.filter(value => value !== scheme) : [...settings.allowed_schemes, scheme] }
async function runMaintenance(action: 'aggregate' | 'cleanup' | 'rebuild') { runningMaintenance.value = action; try { await axios.post(generateUrl('/apps/shortlinks/settings/admin/maintenance/{action}', { action }), undefined, { params: action === 'rebuild' ? { days: maintenanceDays.value } : undefined }); showSuccess(t('shortlinks', 'Maintenance completed')) } catch (error) { showError(error instanceof Error ? error.message : String(error)) } finally { runningMaintenance.value = '' } }
</script>

<template>
	<section class="shortlinks-admin-settings">
		<h2>{{ t('shortlinks', 'Shortlinks') }}</h2><p>{{ t('shortlinks', 'Configure aliases, access, privacy, retention, and optional local GeoIP resolution.') }}</p>
		<NcCheckboxRadioSwitch v-model="settings.enabled" type="switch">
			{{ t('shortlinks', 'Enable Shortlinks') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="settings.public_creation" type="switch">
			{{ t('shortlinks', 'Allow public creation') }}
		</NcCheckboxRadioSwitch>
		<NcTextField v-if="settings.public_creation" v-model="settings.public_owner_uid" :label="t('shortlinks', 'Owner UID for publicly created links')" />
		<NcTextField v-model="lists.creation_groups" :label="t('shortlinks', 'Groups allowed to create (comma-separated, empty means all)')" />
		<NcTextField v-model="lists.public_creation_groups" :label="t('shortlinks', 'Groups allowed on the public endpoint (empty also allows guests)')" />
		<NcTextField v-model="settings.max_links_per_user"
			type="number"
			min="1"
			:label="t('shortlinks', 'Maximum links per user')" />
		<label>{{ t('shortlinks', 'Alias mode') }}<select v-model="settings.alias_mode"><option value="random">{{ t('shortlinks', 'Random Base62') }}</option><option value="base36">{{ t('shortlinks', 'Sequential Base36') }}</option><option value="base62">{{ t('shortlinks', 'Sequential Base62') }}</option></select></label>
		<NcTextField v-model="settings.alias_length"
			type="number"
			min="4"
			max="64"
			:label="t('shortlinks', 'Default alias length')" />
		<NcTextField v-model="settings.alias_min_length"
			type="number"
			min="1"
			max="64"
			:label="t('shortlinks', 'Minimum sequential alias length')" />
		<NcTextField v-model="lists.reserved_aliases" :label="t('shortlinks', 'Additional reserved aliases (comma-separated)')" />
		<NcCheckboxRadioSwitch v-model="settings.allow_duplicate_targets" type="switch">
			{{ t('shortlinks', 'Allow the same target URL more than once per owner') }}
		</NcCheckboxRadioSwitch>
		<fieldset>
			<legend>{{ t('shortlinks', 'Allowed redirect status codes') }}</legend><NcCheckboxRadioSwitch v-for="status in [301,302,307,308]"
				:key="status"
				type="checkbox"
				:model-value="settings.redirect_statuses.includes(status)"
				@update:model-value="toggleRedirectStatus(status)">
				{{ status }}
			</NcCheckboxRadioSwitch>
		</fieldset>
		<NcTextField v-model="settings.base_url" type="url" :label="t('shortlinks', 'Public base URL (optional)')" />
		<fieldset>
			<legend>{{ t('shortlinks', 'Allowed URL schemes') }}</legend>
			<NcCheckboxRadioSwitch v-for="scheme in ['http', 'https']"
				:key="scheme"
				type="checkbox"
				:model-value="settings.allowed_schemes.includes(scheme)"
				@update:model-value="toggleScheme(scheme)">
				{{ scheme }}
			</NcCheckboxRadioSwitch>
		</fieldset>
		<label>{{ t('shortlinks', 'Domain allowlist (one rule per line)') }}<textarea v-model="lists.domain_allowlist" rows="4" /></label>
		<label>{{ t('shortlinks', 'Domain blocklist (one rule per line)') }}<textarea v-model="lists.domain_blocklist" rows="4" /></label>
		<NcCheckboxRadioSwitch v-model="settings.title_fetch" type="switch">
			{{ t('shortlinks', 'Allow protected server-side title fetching') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="settings.stats_enabled" type="switch">
			{{ t('shortlinks', 'Collect statistics') }}
		</NcCheckboxRadioSwitch>
		<label>{{ t('shortlinks', 'Privacy mode') }}<select v-model="settings.privacy_mode"><option value="counts">{{ t('shortlinks', 'Counts only') }}</option><option value="detailed">{{ t('shortlinks', 'Privacy-reduced details') }}</option></select></label>
		<NcCheckboxRadioSwitch v-model="settings.respect_dnt" type="switch">
			{{ t('shortlinks', 'Respect DNT and Global Privacy Control') }}
		</NcCheckboxRadioSwitch>
		<label>{{ t('shortlinks', 'Referrer storage') }}<select v-model="settings.referrer_mode"><option value="none">{{ t('shortlinks', 'None') }}</option><option value="domain">{{ t('shortlinks', 'Domain only') }}</option><option value="path">{{ t('shortlinks', 'Domain and path') }}</option><option value="full">{{ t('shortlinks', 'Redacted query parameters') }}</option></select></label>
		<NcCheckboxRadioSwitch v-model="settings.log_authenticated_users" type="switch">
			{{ t('shortlinks', 'Store signed-in user IDs in click events') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="settings.record_bots" type="switch">
			{{ t('shortlinks', 'Store detailed events for detected bots') }}
		</NcCheckboxRadioSwitch>
		<NcTextField v-model="settings.click_retention_days"
			type="number"
			min="0"
			:label="t('shortlinks', 'Detailed event retention (days)')" />
		<NcTextField v-model="settings.aggregate_retention_days"
			type="number"
			min="0"
			:label="t('shortlinks', 'Aggregate retention (days)')" />
		<NcTextField v-model="settings.audit_retention_days"
			type="number"
			min="0"
			:label="t('shortlinks', 'Audit retention (days)')" />
		<NcTextField v-model="settings.trash_retention_days"
			type="number"
			min="0"
			:label="t('shortlinks', 'Trash retention (days)')" />
		<NcTextField v-model="settings.geoip_path" :label="t('shortlinks', 'GeoIP MMDB path')" /><p>{{ t('shortlinks', 'GeoIP status') }}: {{ geo.readable ? t('shortlinks', 'Ready') : t('shortlinks', 'Not configured or unreadable') }}</p>
		<NcCheckboxRadioSwitch v-model="settings.admin_manage_all" type="switch">
			{{ t('shortlinks', 'Administrators can manage all links') }}
		</NcCheckboxRadioSwitch>
		<p>{{ t('shortlinks', 'Deleted user data is retained under its former UID and can be recovered with the owner-transfer OCC command.') }}</p>
		<fieldset>
			<legend>{{ t('shortlinks', 'System status') }}</legend>
			<p :class="{ error: !systemStatus.phpSupported }">
				PHP {{ systemStatus.phpVersion }} — {{ systemStatus.phpSupported ? t('shortlinks', 'Supported') : t('shortlinks', 'Unsupported version') }}
			</p>
			<ul>
				<li v-for="(count, job) in systemStatus.jobs" :key="job">
					{{ t('shortlinks', job) }}: {{ count ? t('shortlinks', 'Registered') : t('shortlinks', 'Missing') }}
				</li>
			</ul>
			<div class="maintenance-actions">
				<NcButton :disabled="Boolean(runningMaintenance)" @click="runMaintenance('aggregate')">
					{{ t('shortlinks', 'Aggregate now') }}
				</NcButton><NcButton :disabled="Boolean(runningMaintenance)" @click="runMaintenance('cleanup')">
					{{ t('shortlinks', 'Run cleanup') }}
				</NcButton><label>{{ t('shortlinks', 'Rebuild days') }}<input v-model.number="maintenanceDays"
					type="number"
					min="1"
					max="365"></label><NcButton :disabled="Boolean(runningMaintenance)" @click="runMaintenance('rebuild')">
						{{ t('shortlinks', 'Rebuild statistics') }}
					</NcButton>
			</div>
		</fieldset>
		<NcButton variant="primary" :disabled="saving" @click="save">
			{{ t('shortlinks', 'Save') }}
		</NcButton>
	</section>
</template>
