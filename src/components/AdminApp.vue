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
	alias_mode: 'random' | 'base36' | 'base62'
	alias_length: number
	base_url: string
	stats_enabled: boolean
	respect_dnt: boolean
	click_retention_days: number
	aggregate_retention_days: number
	audit_retention_days: number
	trash_retention_days: number
	geoip_path: string
	admin_manage_all: boolean
}

const settings = reactive(loadState<AdminSettingsState>('shortlinks', 'admin-settings'))
const geo = loadState<Record<string, unknown>>('shortlinks', 'geo-status')
const saving = ref(false)
/**
 *
 */
async function save() { saving.value = true; try { await axios.put(generateUrl('/apps/shortlinks/settings/admin'), settings); showSuccess(t('shortlinks', 'Settings saved')) } catch (e) { showError(e instanceof Error ? e.message : String(e)) } finally { saving.value = false } }
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
		<label>{{ t('shortlinks', 'Alias mode') }}<select v-model="settings.alias_mode"><option value="random">Random Base62</option><option value="base36">Sequential Base36</option><option value="base62">Sequential Base62</option></select></label>
		<NcTextField v-model="settings.alias_length"
			type="number"
			min="4"
			max="64"
			:label="t('shortlinks', 'Default alias length')" />
		<NcTextField v-model="settings.base_url" type="url" :label="t('shortlinks', 'Public base URL (optional)')" />
		<NcCheckboxRadioSwitch v-model="settings.stats_enabled" type="switch">
			{{ t('shortlinks', 'Collect statistics') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch v-model="settings.respect_dnt" type="switch">
			{{ t('shortlinks', 'Respect DNT and Global Privacy Control') }}
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
		<NcButton variant="primary" :disabled="saving" @click="save">
			{{ t('shortlinks', 'Save') }}
		</NcButton>
	</section>
</template>
