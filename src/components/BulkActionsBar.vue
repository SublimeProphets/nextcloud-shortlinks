<script setup lang="ts">
import { mdiDeleteOutline, mdiDotsHorizontal, mdiExportVariant, mdiFolderMoveOutline, mdiQrcode, mdiRestore, mdiStar, mdiTagMultipleOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'

defineProps<{ count: number; system: string }>()
const emit = defineEmits<{ clear: []; favorite: []; tags: []; destination: []; qr: []; export: [format: 'csv' | 'json']; delete: []; restore: [] }>()
</script>

<template>
	<div class="bulk-actions-bar" role="toolbar" :aria-label="t('shortlinks', 'Bulk actions')">
		<input type="checkbox"
			checked
			:indeterminate="true"
			:aria-label="t('shortlinks', 'Clear selection')"
			@change="emit('clear')">
		<strong>{{ t('shortlinks', '{count} selected', { count }) }}</strong>
		<div class="bulk-actions-bar__primary">
			<NcButton variant="tertiary" @click="emit('favorite')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiStar" />
				</template>{{ t('shortlinks', 'Set as favorite') }}
			</NcButton>
			<NcButton variant="tertiary" @click="emit('tags')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiTagMultipleOutline" />
				</template>{{ t('shortlinks', 'Manage tags') }}
			</NcButton>
			<NcButton variant="tertiary" @click="emit('destination')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiFolderMoveOutline" />
				</template>{{ t('shortlinks', 'Move or copy') }}
			</NcButton>
		</div>
		<NcActions force-menu
			force-name
			:menu-name="t('shortlinks', 'Actions')"
			:aria-label="t('shortlinks', 'More bulk actions')">
			<template #icon>
				<NcIconSvgWrapper :path="mdiDotsHorizontal" />
			</template>
			<NcActionButton :name="t('shortlinks', 'Download QR codes')" @click="emit('qr')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiQrcode" />
				</template>
			</NcActionButton>
			<NcActionButton :name="t('shortlinks', 'Export CSV')" @click="emit('export', 'csv')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiExportVariant" />
				</template>
			</NcActionButton>
			<NcActionButton :name="t('shortlinks', 'Export JSON')" @click="emit('export', 'json')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiExportVariant" />
				</template>
			</NcActionButton>
			<NcActionButton v-if="system === 'trash'" :name="t('shortlinks', 'Restore')" @click="emit('restore')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiRestore" />
				</template>
			</NcActionButton>
			<NcActionButton v-else :name="t('shortlinks', 'Delete')" @click="emit('delete')">
				<template #icon>
					<NcIconSvgWrapper :path="mdiDeleteOutline" />
				</template>
			</NcActionButton>
		</NcActions>
	</div>
</template>

<style scoped>
.bulk-actions-bar { display: flex; align-items: center; min-inline-size: 0; inline-size: 100%; min-block-size: 48px; gap: calc(var(--default-grid-baseline) * 2); padding-inline: calc(var(--default-grid-baseline) * 2); background: var(--color-primary-element-light); }

.bulk-actions-bar > input { inline-size: 20px; block-size: 20px; margin: 0; }

.bulk-actions-bar > strong { min-inline-size: max-content; }

.bulk-actions-bar__primary { display: flex; align-items: center; flex: 1; min-inline-size: 0; gap: var(--default-grid-baseline); overflow: hidden; }
@media (max-width: 900px) { .bulk-actions-bar__primary > :nth-child(n+3) { display: none; } }
@media (max-width: 640px) { .bulk-actions-bar__primary > :nth-child(n+2) { display: none; } }
</style>
