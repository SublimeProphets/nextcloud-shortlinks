<script setup lang="ts">
import { ref, watch } from 'vue'
import { mdiLinkVariant } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'

const props = withDefaults(defineProps<{ src?: string; alt?: string; size?: 'small' | 'normal' | 'large' }>(), {
	src: '',
	alt: '',
	size: 'normal',
})
const failed = ref(!props.src)

watch(() => props.src, value => { failed.value = !value })
</script>

<template>
	<div class="link-thumbnail" :class="`link-thumbnail--${size}`">
		<img v-if="src && !failed"
			:src="src"
			:alt="alt"
			loading="lazy"
			@error="failed = true">
		<div v-else
			class="link-thumbnail__fallback"
			:aria-label="t('shortlinks', 'Shortlinks icon')"
			role="img">
			<NcIconSvgWrapper :path="mdiLinkVariant" :size="size === 'large' ? 44 : size === 'small' ? 22 : 32" aria-hidden="true" />
		</div>
	</div>
</template>

<style scoped>
.link-thumbnail {
	position: relative;
	flex: 0 0 auto;
	inline-size: 72px;
	block-size: 72px;
	overflow: hidden;
	border: 1px solid var(--color-border);
	border-radius: var(--border-radius-large);
	background: var(--color-background-hover);
}

.link-thumbnail--small { inline-size: 48px; block-size: 48px; border-radius: var(--border-radius); }

.link-thumbnail--large { inline-size: 112px; block-size: 112px; }

.link-thumbnail img { inline-size: 100%; block-size: 100%; object-fit: cover; }

.link-thumbnail__fallback { display: grid; inline-size: 100%; block-size: 100%; place-items: center; color: var(--color-primary-element); background: linear-gradient(145deg, var(--color-primary-element-light), var(--color-main-background)); }
</style>
