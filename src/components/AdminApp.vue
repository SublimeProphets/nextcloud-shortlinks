<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcSettingsSection from '@nextcloud/vue/components/NcSettingsSection'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'

interface AdminSettingsState {
	enabled: boolean
	public_creation: boolean
	public_owner_uid: string
	creation_groups: string[]
	public_creation_groups: string[]
	max_links_per_user: number
	alias_mode: 'random' | 'base36' | 'base62' | 'readable'
	alias_length: number
	alias_min_length: number
	alias_collision_mode: 'random' | 'numbered'
	alias_suffix_length: number
	allow_user_alias_settings: boolean
	allow_user_url_settings: boolean
	reserved_aliases: string[]
	allow_duplicate_targets: boolean
	base_url: string
	link_url_mode: 'simple' | 'template' | 'regex'
	link_url_template: string
	link_url_pattern: string
	link_url_replacement: string
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

const defaultRedirectStatuses = [301, 302, 307, 308]
const defaultSchemes = ['http', 'https']
const unsafeSchemes = ['about', 'blob', 'data', 'file', 'javascript', 'vbscript']
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
const newRedirectStatus = ref('')
const newScheme = ref('')
const customSchemeWarning = t('shortlinks', 'Custom schemes open in the visitor browser. Domain rules apply only to URLs that contain a host.')
const displayedRedirectStatuses = computed(() => [...new Set([...defaultRedirectStatuses, ...settings.redirect_statuses])].sort((a, b) => a - b))
const displayedSchemes = computed(() => [...new Set([...defaultSchemes, ...settings.allowed_schemes])].sort((a, b) => a.localeCompare(b)))
const canonicalUrlExample = `${window.location.origin}/apps/shortlinks/r/summer-campaign`
const publicUrlPreview = computed(() => {
	try {
		if (settings.link_url_mode === 'simple') return settings.base_url.trim() ? `${settings.base_url.trim().replace(/\/$/, '')}/summer-campaign` : canonicalUrlExample
		if (settings.link_url_mode === 'template') return settings.link_url_template.replaceAll('{alias}', 'summer-campaign').replaceAll('{user}', 'alice')
		const result = canonicalUrlExample.replace(new RegExp(settings.link_url_pattern, 'u'), settings.link_url_replacement)
		return result === canonicalUrlExample ? t('shortlinks', 'The regular expression does not match the current Shortlinks URL.') : result
	} catch {
		return t('shortlinks', 'The regular expression is invalid.')
	}
})

watch(() => settings.link_url_mode, mode => {
	if (mode === 'template' && !settings.link_url_template) {
		settings.link_url_template = `${settings.base_url.trim().replace(/\/$/, '') || `${window.location.origin}/apps/shortlinks/r`}/{alias}`
	}
	if (mode === 'regex' && !settings.link_url_pattern) {
		const prefix = `${window.location.origin}/apps/shortlinks/r/`
		settings.link_url_pattern = `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.+)$`
		settings.link_url_replacement = `${settings.base_url.trim().replace(/\/$/, '') || 'https://go.example'}/$1`
	}
})

async function save() {
	saving.value = true
	try {
		const split = (value: string) => value.split(/[\n,]/).map(item => item.trim()).filter(Boolean)
		await axios.put(generateUrl('/apps/shortlinks/settings/admin'), {
			...settings,
			creation_groups: split(lists.creation_groups),
			public_creation_groups: split(lists.public_creation_groups),
			reserved_aliases: split(lists.reserved_aliases),
			domain_allowlist: split(lists.domain_allowlist),
			domain_blocklist: split(lists.domain_blocklist),
			allowed_schemes: [...settings.allowed_schemes].sort(),
			redirect_statuses: [...settings.redirect_statuses].sort((a, b) => a - b),
		})
		showSuccess(t('shortlinks', 'Settings saved'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		saving.value = false
	}
}

function toggleRedirectStatus(status: number) {
	if (settings.redirect_statuses.includes(status)) {
		if (settings.redirect_statuses.length === 1) {
			showError(t('shortlinks', 'At least one redirect status code must remain enabled.'))
			return
		}
		settings.redirect_statuses = settings.redirect_statuses.filter(value => value !== status)
	} else {
		settings.redirect_statuses = [...settings.redirect_statuses, status]
	}
}

function addRedirectStatus() {
	const raw = newRedirectStatus.value.trim()
	const status = Number(raw)
	if (!/^\d{3}$/.test(raw) || !Number.isInteger(status) || status < 300 || status > 399) {
		showError(t('shortlinks', 'Enter a status code between 300 and 399.'))
		return
	}
	if (!settings.redirect_statuses.includes(status)) {
		settings.redirect_statuses = [...settings.redirect_statuses, status]
	}
	newRedirectStatus.value = ''
}

function toggleScheme(scheme: string) {
	if (settings.allowed_schemes.includes(scheme)) {
		if (settings.allowed_schemes.length === 1) {
			showError(t('shortlinks', 'At least one URL scheme must remain enabled.'))
			return
		}
		settings.allowed_schemes = settings.allowed_schemes.filter(value => value !== scheme)
	} else {
		settings.allowed_schemes = [...settings.allowed_schemes, scheme]
	}
}

function addScheme() {
	const scheme = newScheme.value.trim().toLowerCase()
	if (!/^[a-z][a-z0-9+.-]{0,63}$/.test(scheme) || unsafeSchemes.includes(scheme)) {
		showError(t('shortlinks', 'Enter a safe URL scheme without a colon, for example mailto or webcal.'))
		return
	}
	if (!settings.allowed_schemes.includes(scheme)) {
		settings.allowed_schemes = [...settings.allowed_schemes, scheme]
	}
	newScheme.value = ''
}

async function runMaintenance(action: 'aggregate' | 'cleanup' | 'rebuild') {
	runningMaintenance.value = action
	try {
		await axios.post(generateUrl('/apps/shortlinks/settings/admin/maintenance/{action}', { action }), undefined, { params: action === 'rebuild' ? { days: maintenanceDays.value } : undefined })
		showSuccess(t('shortlinks', 'Maintenance completed'))
	} catch (error) {
		showError(error instanceof Error ? error.message : String(error))
	} finally {
		runningMaintenance.value = ''
	}
}
</script>

<template>
	<div class="shortlinks-admin-settings">
		<NcSettingsSection :name="t('shortlinks', 'General')"
			:description="t('shortlinks', 'Control whether Shortlinks is available and set global permissions and limits.')">
			<div class="settings-controls">
				<NcCheckboxRadioSwitch v-model="settings.enabled" type="switch">
					{{ t('shortlinks', 'Enable Shortlinks') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch v-model="settings.admin_manage_all" type="switch">
					{{ t('shortlinks', 'Administrators can manage all links') }}
				</NcCheckboxRadioSwitch>
				<NcTextField v-model="settings.max_links_per_user"
					type="number"
					min="1"
					max="1000000"
					:label="t('shortlinks', 'Maximum links per user')" />
			</div>
		</NcSettingsSection>

		<NcSettingsSection :name="t('shortlinks', 'Creation and access')"
			:description="t('shortlinks', 'Choose who can create links, including optional access through the public endpoint.')">
			<div class="settings-controls">
				<NcTextField v-model="lists.creation_groups"
					:label="t('shortlinks', 'Groups allowed to create (comma-separated, empty means all)')" />
				<NcCheckboxRadioSwitch v-model="settings.public_creation" type="switch">
					{{ t('shortlinks', 'Allow public creation') }}
				</NcCheckboxRadioSwitch>
				<div v-if="settings.public_creation" class="settings-grid">
					<NcTextField v-model="settings.public_owner_uid"
						:label="t('shortlinks', 'Owner UID for publicly created links')" />
					<NcTextField v-model="lists.public_creation_groups"
						:label="t('shortlinks', 'Groups allowed on the public endpoint (empty also allows guests)')" />
				</div>
			</div>
		</NcSettingsSection>

		<NcSettingsSection :name="t('shortlinks', 'Aliases and short-link URLs')"
			:description="t('shortlinks', 'Configure generated aliases, the URL users share, and personal overrides.')">
			<div class="settings-controls">
				<div class="settings-grid settings-grid--three">
					<label class="settings-select">
						<span>{{ t('shortlinks', 'Alias mode') }}</span>
						<select v-model="settings.alias_mode">
							<option value="random">{{ t('shortlinks', 'Random Base62') }}</option>
							<option value="base36">{{ t('shortlinks', 'Sequential Base36') }}</option>
							<option value="base62">{{ t('shortlinks', 'Sequential Base62') }}</option>
							<option value="readable">{{ t('shortlinks', 'Readable from title or destination') }}</option>
						</select>
					</label>
					<NcTextField v-model="settings.alias_length"
						type="number"
						min="1"
						max="64"
						:label="t('shortlinks', 'Default alias length')" />
					<NcTextField v-model="settings.alias_min_length"
						type="number"
						min="1"
						max="64"
						:label="t('shortlinks', 'Minimum sequential alias length')" />
				</div>
				<div v-if="settings.alias_mode === 'readable'" class="settings-grid">
					<label class="settings-select">
						<span>{{ t('shortlinks', 'If the alias is already used') }}</span>
						<select v-model="settings.alias_collision_mode">
							<option value="random">{{ t('shortlinks', 'Add a short random suffix') }}</option>
							<option value="numbered">{{ t('shortlinks', 'Add an ascending number') }}</option>
						</select>
					</label>
					<NcTextField v-if="settings.alias_collision_mode === 'random'"
						v-model="settings.alias_suffix_length"
						type="number"
						min="1"
						max="12"
						:label="t('shortlinks', 'Initial random suffix length')" />
				</div>
				<NcCheckboxRadioSwitch v-model="settings.allow_user_alias_settings" type="switch">
					{{ t('shortlinks', 'Allow users to choose their alias strategy') }}
				</NcCheckboxRadioSwitch>
				<NcTextField v-model="lists.reserved_aliases"
					:label="t('shortlinks', 'Additional reserved aliases (comma-separated)')" />
				<NcCheckboxRadioSwitch v-model="settings.allow_duplicate_targets" type="switch">
					{{ t('shortlinks', 'Allow the same target URL more than once per owner') }}
				</NcCheckboxRadioSwitch>
				<hr>
				<div class="settings-subsection">
					<h3>{{ t('shortlinks', 'Shared short-link URL') }}</h3>
					<p class="settings-hint">
						{{ t('shortlinks', 'Use a simple domain, a placeholder template, or transform the canonical Nextcloud URL with a regular expression.') }}
					</p>
					<label class="settings-select">
						<span>{{ t('shortlinks', 'URL format') }}</span>
						<select v-model="settings.link_url_mode">
							<option value="simple">{{ t('shortlinks', 'Domain and append alias') }}</option>
							<option value="template">{{ t('shortlinks', 'Template with placeholders') }}</option>
							<option value="regex">{{ t('shortlinks', 'Regular expression replacement') }}</option>
						</select>
					</label>
					<NcTextField v-if="settings.link_url_mode === 'simple'"
						v-model="settings.base_url"
						type="url"
						:label="t('shortlinks', 'Short-link domain or base URL')"
						:helper-text="t('shortlinks', 'The alias is appended automatically. Leave empty to use Nextcloud.')" />
					<NcTextField v-else-if="settings.link_url_mode === 'template'"
						v-model="settings.link_url_template"
						:label="t('shortlinks', 'URL template')"
						:helper-text="t('shortlinks', 'Use {alias}; {user} is optional. Example: https://go.example/{user}/{alias}')" />
					<div v-else class="settings-grid">
						<NcTextField v-model="settings.link_url_pattern"
							:label="t('shortlinks', 'Regular expression')"
							:helper-text="t('shortlinks', 'Enter the pattern without delimiters.')" />
						<NcTextField v-model="settings.link_url_replacement"
							:label="t('shortlinks', 'Replacement')"
							:helper-text="t('shortlinks', 'Use $1, $2, and so on for captured groups.')" />
					</div>
					<NcNoteCard type="info" :heading="t('shortlinks', 'Preview')" :text="publicUrlPreview" />
					<NcCheckboxRadioSwitch v-model="settings.allow_user_url_settings" type="switch">
						{{ t('shortlinks', 'Allow users to override the shared short-link URL') }}
					</NcCheckboxRadioSwitch>
					<NcNoteCard type="warning" :text="t('shortlinks', 'Custom domains must route requests to this Nextcloud Shortlinks endpoint. This setting changes displayed and copied URLs; it does not configure DNS or a reverse proxy.')" />
				</div>
				<hr>
				<fieldset class="settings-options">
					<legend>{{ t('shortlinks', 'Allowed redirect status codes') }}</legend>
					<div class="settings-options__list">
						<NcCheckboxRadioSwitch v-for="status in displayedRedirectStatuses"
							:key="status"
							type="checkbox"
							:model-value="settings.redirect_statuses.includes(status)"
							@update:model-value="toggleRedirectStatus(status)">
							{{ status }}
						</NcCheckboxRadioSwitch>
					</div>
					<div class="settings-add-row">
						<NcTextField v-model="newRedirectStatus"
							type="number"
							min="300"
							max="399"
							:label="t('shortlinks', 'Custom redirect status code')"
							@keyup.enter="addRedirectStatus" />
						<NcButton type="button" :disabled="!newRedirectStatus.trim()" @click="addRedirectStatus">
							{{ t('shortlinks', 'Add') }}
						</NcButton>
					</div>
					<NcNoteCard type="info" :text="t('shortlinks', 'Codes from 300 to 399 are accepted. Non-standard codes may not be followed consistently by clients.')" />
				</fieldset>
			</div>
		</NcSettingsSection>

		<NcSettingsSection :name="t('shortlinks', 'Target URL policy')"
			:description="t('shortlinks', 'Restrict which destination URLs can be stored and fetched.')">
			<div class="settings-controls">
				<fieldset class="settings-options">
					<legend>{{ t('shortlinks', 'Allowed URL schemes') }}</legend>
					<div class="settings-options__list">
						<NcCheckboxRadioSwitch v-for="scheme in displayedSchemes"
							:key="scheme"
							type="checkbox"
							:model-value="settings.allowed_schemes.includes(scheme)"
							@update:model-value="toggleScheme(scheme)">
							{{ scheme }}
						</NcCheckboxRadioSwitch>
					</div>
					<div class="settings-add-row">
						<NcTextField v-model="newScheme"
							:label="t('shortlinks', 'Custom URL scheme')"
							:helper-text="t('shortlinks', 'Enter the name without a colon.')"
							@keyup.enter="addScheme" />
						<NcButton type="button" :disabled="!newScheme.trim()" @click="addScheme">
							{{ t('shortlinks', 'Add') }}
						</NcButton>
					</div>
					<NcNoteCard type="warning" :text="customSchemeWarning" />
				</fieldset>
				<div class="settings-grid">
					<NcTextArea v-model="lists.domain_allowlist"
						rows="5"
						resize="vertical"
						:label="t('shortlinks', 'Domain allowlist (one rule per line)')"
						:helper-text="t('shortlinks', 'Leave empty to allow every domain not listed below.')" />
					<NcTextArea v-model="lists.domain_blocklist"
						rows="5"
						resize="vertical"
						:label="t('shortlinks', 'Domain blocklist (one rule per line)')"
						:helper-text="t('shortlinks', 'Blocked domains always take precedence over the allowlist.')" />
				</div>
				<NcCheckboxRadioSwitch v-model="settings.title_fetch" type="switch">
					{{ t('shortlinks', 'Allow protected server-side title fetching') }}
				</NcCheckboxRadioSwitch>
				<p class="settings-hint">
					{{ t('shortlinks', 'Server-side title fetching remains limited to public HTTP and HTTPS targets.') }}
				</p>
			</div>
		</NcSettingsSection>

		<NcSettingsSection :name="t('shortlinks', 'Statistics and privacy')"
			:description="t('shortlinks', 'Choose which usage data is collected and how identifying details are reduced.')">
			<div class="settings-controls">
				<NcCheckboxRadioSwitch v-model="settings.stats_enabled" type="switch">
					{{ t('shortlinks', 'Collect statistics') }}
				</NcCheckboxRadioSwitch>
				<div class="settings-grid">
					<label class="settings-select">
						<span>{{ t('shortlinks', 'Privacy mode') }}</span>
						<select v-model="settings.privacy_mode">
							<option value="counts">{{ t('shortlinks', 'Counts only') }}</option>
							<option value="detailed">{{ t('shortlinks', 'Privacy-reduced details') }}</option>
						</select>
					</label>
					<label class="settings-select">
						<span>{{ t('shortlinks', 'Referrer storage') }}</span>
						<select v-model="settings.referrer_mode">
							<option value="none">{{ t('shortlinks', 'None') }}</option>
							<option value="domain">{{ t('shortlinks', 'Domain only') }}</option>
							<option value="path">{{ t('shortlinks', 'Domain and path') }}</option>
							<option value="full">{{ t('shortlinks', 'Redacted query parameters') }}</option>
						</select>
					</label>
				</div>
				<NcCheckboxRadioSwitch v-model="settings.respect_dnt" type="switch">
					{{ t('shortlinks', 'Respect DNT and Global Privacy Control') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch v-model="settings.log_authenticated_users" type="switch">
					{{ t('shortlinks', 'Store signed-in user IDs in click events') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch v-model="settings.record_bots" type="switch">
					{{ t('shortlinks', 'Store detailed events for detected bots') }}
				</NcCheckboxRadioSwitch>
				<NcTextField v-model="settings.geoip_path"
					:label="t('shortlinks', 'GeoIP MMDB path')"
					:helper-text="t('shortlinks', 'Optional local database used for country and region statistics.')" />
				<NcNoteCard :type="geo.readable ? 'success' : 'info'"
					:heading="t('shortlinks', 'GeoIP status')"
					:text="geo.readable ? t('shortlinks', 'Ready') : t('shortlinks', 'Not configured or unreadable')" />
			</div>
		</NcSettingsSection>

		<NcSettingsSection :name="t('shortlinks', 'Retention')"
			:description="t('shortlinks', 'Define how long operational and analytics data remains available.')">
			<div class="settings-controls">
				<div class="settings-grid">
					<NcTextField v-model="settings.click_retention_days"
						type="number"
						min="0"
						max="36500"
						:label="t('shortlinks', 'Detailed event retention (days)')" />
					<NcTextField v-model="settings.aggregate_retention_days"
						type="number"
						min="0"
						max="36500"
						:label="t('shortlinks', 'Aggregate retention (days)')" />
					<NcTextField v-model="settings.audit_retention_days"
						type="number"
						min="0"
						max="36500"
						:label="t('shortlinks', 'Audit retention (days)')" />
					<NcTextField v-model="settings.trash_retention_days"
						type="number"
						min="0"
						max="36500"
						:label="t('shortlinks', 'Trash retention (days)')" />
				</div>
				<NcNoteCard type="info" :text="t('shortlinks', 'Deleted user data is retained under its former UID and can be recovered with the owner-transfer OCC command.')" />
			</div>
		</NcSettingsSection>

		<NcSettingsSection :name="t('shortlinks', 'System and maintenance')"
			:description="t('shortlinks', 'Review background jobs and run bounded maintenance tasks.')">
			<div class="settings-controls">
				<NcNoteCard :type="systemStatus.phpSupported ? 'success' : 'error'"
					:heading="t('shortlinks', 'System status')"
					:text="`PHP ${systemStatus.phpVersion} — ${systemStatus.phpSupported ? t('shortlinks', 'Supported') : t('shortlinks', 'Unsupported version')}`" />
				<ul class="system-jobs">
					<li v-for="(count, job) in systemStatus.jobs" :key="job">
						<span>{{ t('shortlinks', job) }}</span>
						<strong :class="{ 'system-jobs__missing': !count }">{{ count ? t('shortlinks', 'Registered') : t('shortlinks', 'Missing') }}</strong>
					</li>
				</ul>
				<div class="maintenance-actions">
					<NcButton :disabled="Boolean(runningMaintenance)" @click="runMaintenance('aggregate')">
						{{ t('shortlinks', 'Aggregate now') }}
					</NcButton>
					<NcButton :disabled="Boolean(runningMaintenance)" @click="runMaintenance('cleanup')">
						{{ t('shortlinks', 'Run cleanup') }}
					</NcButton>
					<NcTextField v-model="maintenanceDays"
						type="number"
						min="1"
						max="365"
						:label="t('shortlinks', 'Rebuild days')" />
					<NcButton :disabled="Boolean(runningMaintenance)" @click="runMaintenance('rebuild')">
						{{ t('shortlinks', 'Rebuild statistics') }}
					</NcButton>
				</div>
				<div class="save-actions">
					<NcButton variant="primary" :disabled="saving" @click="save">
						{{ t('shortlinks', 'Save') }}
					</NcButton>
				</div>
			</div>
		</NcSettingsSection>
	</div>
</template>

<style scoped>
.shortlinks-admin-settings {
	padding-block-end: calc(var(--default-grid-baseline) * 8);
}

.settings-controls {
	display: grid;
	max-inline-size: 760px;
	gap: calc(var(--default-grid-baseline) * 3);
}

.settings-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: calc(var(--default-grid-baseline) * 3);
	align-items: start;
}

.settings-grid--three {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.settings-select {
	display: grid;
	gap: var(--default-grid-baseline);
	font-weight: 600;
}

.settings-select select {
	inline-size: 100%;
	margin: 0;
	font-weight: normal;
}

.settings-options {
	display: grid;
	margin: 0;
	padding: 0;
	border: 0;
	gap: calc(var(--default-grid-baseline) * 2);
}

.settings-options legend {
	margin-block-end: calc(var(--default-grid-baseline) * 2);
	font-weight: 600;
}

.settings-options__list {
	display: flex;
	flex-wrap: wrap;
	gap: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 5);
}

.settings-add-row {
	display: grid;
	grid-template-columns: minmax(220px, 420px) auto;
	gap: calc(var(--default-grid-baseline) * 2);
	align-items: center;
}

.settings-add-row > :last-child {
	justify-self: start;
}

.settings-hint {
	margin: calc(var(--default-grid-baseline) * -2) 0 0;
	color: var(--color-text-maxcontrast);
}

.system-jobs {
	display: grid;
	max-inline-size: 560px;
	margin: 0;
	padding: 0;
	list-style: none;
}

.system-jobs li {
	display: flex;
	justify-content: space-between;
	gap: calc(var(--default-grid-baseline) * 4);
	padding-block: calc(var(--default-grid-baseline) * 2);
	border-block-end: 1px solid var(--color-border-dark);
}

.system-jobs__missing {
	color: var(--color-error-text);
}

.maintenance-actions {
	display: flex;
	flex-wrap: wrap;
	gap: calc(var(--default-grid-baseline) * 2);
	align-items: center;
}

.maintenance-actions > :nth-child(3) {
	inline-size: 160px;
}

.save-actions {
	display: flex;
	padding-block-start: calc(var(--default-grid-baseline) * 3);
}

@media (max-width: 700px) {
	.settings-grid,
	.settings-grid--three,
	.settings-add-row {
		grid-template-columns: 1fr;
	}
}
</style>
