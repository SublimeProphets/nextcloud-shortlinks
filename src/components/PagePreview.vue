<script setup lang="ts">
import { computed } from 'vue'
import { mdiAccountOutline, mdiCursorDefaultClickOutline, mdiEmailOutline, mdiFileOutline, mdiFolderOutline, mdiLockOutline, mdiPhoneOutline, mdiTagOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import type { Folder, LinkPageDraft, ShortLink } from '../types'

const props = defineProps<{ draft: LinkPageDraft; links: ShortLink[]; folders: Folder[]; interactive?: boolean }>()
const selectedLinks = computed(() => props.links.filter(link => props.draft.linkIds.includes(link.id)
	|| (link.folderId !== null && props.draft.folderIds.includes(link.folderId))
	|| link.tags.some(tag => props.draft.tagIds.includes(tag.id))))
const previewStyle = computed(() => ({
	'--page-background': props.draft.theme.background || 'var(--color-main-background)',
	'--page-text': props.draft.theme.text || 'var(--color-main-text)',
	'--page-primary': props.draft.theme.primary || 'var(--color-primary-element)',
	'--page-surface': props.draft.theme.surface || 'var(--color-background-hover)',
}))
const groupedLinks = computed(() => {
	if (props.draft.grouping === 'none') return [{ key: '', title: '', links: selectedLinks.value }]
	const groups = new Map<string, ShortLink[]>()
	selectedLinks.value.forEach(link => {
		const keys = props.draft.grouping === 'folder'
			? [props.folders.find(folder => folder.id === link.folderId)?.name || t('shortlinks', 'Without folder')]
			: (link.tags.length ? link.tags.map(tag => tag.name) : [t('shortlinks', 'Without tag')])
		keys.forEach(key => groups.set(key, [...(groups.get(key) ?? []), link]))
	})
	return [...groups.entries()].map(([title, links]) => ({ key: title, title, links }))
})
function field(name: string): boolean { return props.draft.visibleFields.includes(name) }
function targetDomain(url: string): string { try { return new URL(url).hostname } catch { return url } }
function fileName(path: string): string { return path.split('/').filter(Boolean).at(-1) || path }
</script>

<template>
	<article class="page-preview" :style="previewStyle">
		<header v-if="draft.header.title !== false" class="page-preview__header">
			<div class="page-preview__mark" aria-hidden="true">
				{{ (draft.title || 'S').slice(0, 1).toUpperCase() }}
			</div>
			<h1>{{ draft.title || t('shortlinks', 'Untitled page') }}</h1>
			<p v-if="draft.header.lead !== false && draft.lead">
				{{ draft.lead }}
			</p>
		</header>
		<div class="page-preview__groups">
			<section v-for="group in groupedLinks" :key="group.key">
				<h2 v-if="group.title">
					{{ group.title }}
				</h2>
				<div class="page-preview__links" :class="`layout--${draft.layout}`">
					<component :is="interactive ? 'a' : 'div'"
						v-for="link in group.links"
						:key="link.id"
						class="page-link"
						:href="interactive ? link.shortUrl : undefined"
						:style="{ '--item-accent': link.color || 'var(--page-primary)' }">
						<div v-if="field('media') && link.mediaUrl" class="page-link__media">
							<video v-if="link.mediaMime?.startsWith('video/')"
								:src="link.mediaUrl"
								muted
								playsinline
								preload="metadata" /><img v-else :src="link.mediaUrl" alt="">
						</div>
						<img v-if="field('thumbnail') && link.thumbnailMediaUrl"
							class="page-link__thumbnail"
							:src="link.thumbnailMediaUrl"
							alt="">
						<div class="page-link__content">
							<strong v-if="field('title')">{{ link.title || link.slug }}</strong><span v-if="field('description') && link.description">{{ link.description }}</span><small v-if="field('domain')">{{ targetDomain(link.targetUrl) }}</small><code v-if="field('shortUrl')">…/{{ link.slug }}</code><div class="page-link__meta">
								<span v-if="field('clicks')"><NcIconSvgWrapper :path="mdiCursorDefaultClickOutline" :size="15" />{{ link.clickCount }}</span><span v-if="field('folder') && link.folderId"><NcIconSvgWrapper :path="mdiFolderOutline" :size="15" />{{ folders.find(folder => folder.id === link.folderId)?.name }}</span><span v-if="field('tags') && link.tags.length"><NcIconSvgWrapper :path="mdiTagOutline" :size="15" />{{ link.tags.map(tag => tag.name).join(', ') }}</span><span v-if="link.passwordProtected"><NcIconSvgWrapper :path="mdiLockOutline" :size="15" /></span>
							</div>
						</div>
					</component>
				</div>
			</section>
			<section v-if="draft.filePaths.length" class="page-preview__content-section">
				<h2><NcIconSvgWrapper :path="mdiFileOutline" :size="22" />{{ t('shortlinks', 'Files') }}</h2><div class="page-preview__content-grid">
					<div v-for="path in draft.filePaths" :key="path" class="page-content-card">
						<span class="page-content-card__icon"><NcIconSvgWrapper :path="mdiFileOutline" :size="28" /></span><span><strong>{{ fileName(path) }}</strong><small>{{ path }}</small></span>
					</div>
				</div>
			</section><section v-if="draft.contacts.length" class="page-preview__content-section">
				<h2><NcIconSvgWrapper :path="mdiAccountOutline" :size="22" />{{ t('shortlinks', 'Contacts') }}</h2><div class="page-preview__content-grid">
					<div v-for="contact in draft.contacts" :key="contact.key" class="page-content-card page-content-card--contact">
						<span class="page-content-card__icon"><NcIconSvgWrapper :path="mdiAccountOutline" :size="28" /></span><span><strong>{{ contact.name }}</strong><small v-if="contact.organization">{{ contact.organization }}</small><small v-if="contact.emails[0]"><NcIconSvgWrapper :path="mdiEmailOutline" :size="14" />{{ contact.emails[0] }}</small><small v-if="contact.phones[0]"><NcIconSvgWrapper :path="mdiPhoneOutline" :size="14" />{{ contact.phones[0] }}</small></span>
					</div>
				</div>
			</section><p v-if="!selectedLinks.length && !draft.filePaths.length && !draft.contacts.length" class="page-preview__empty">
				{{ t('shortlinks', 'Select links, files, or contacts to fill this page.') }}
			</p>
		</div>
		<footer v-if="draft.footer.enabled !== false">
			<span v-if="draft.footer.brand !== false">{{ t('shortlinks', 'Shared with Shortlinks') }}</span><span v-if="draft.footer.updated !== false">{{ new Date().toLocaleDateString() }}</span>
		</footer>
	</article>
</template>

<style scoped>
.page-preview{--page-background:var(--color-main-background);--page-text:var(--color-main-text);--page-primary:var(--color-primary-element);--page-surface:var(--color-background-hover);display:grid;align-content:start;min-block-size:560px;padding:clamp(20px,5vw,48px);overflow:auto;border:1px solid var(--color-border);border-radius:var(--border-radius-large);background:var(--page-background);color:var(--page-text)}

.page-preview__header{display:grid;justify-items:center;gap:8px;margin-block-end:32px;text-align:center}

.page-preview__mark{display:grid;place-items:center;inline-size:64px;block-size:64px;border-radius:20px;background:var(--page-primary);color:#fff;font-size:1.8rem;font-weight:800}

.page-preview h1,.page-preview h2,.page-preview p{margin:0}

.page-preview__header p{max-inline-size:560px;opacity:.75}

.page-preview__groups{display:grid;gap:28px}

.page-preview__groups>section{display:grid;gap:12px}

.page-preview__groups h2{display:flex;align-items:center;gap:7px}

.page-preview__links,.page-preview__content-grid{display:grid;gap:12px}

.page-preview__content-grid{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}

.page-content-card{display:flex;align-items:center;gap:11px;min-inline-size:0;padding:13px;border:1px solid color-mix(in srgb,var(--page-primary) 28%,var(--color-border));border-radius:14px;background:color-mix(in srgb,var(--page-primary) 7%,var(--page-surface))}

.page-content-card__icon{display:grid;place-items:center;flex:0 0 44px;inline-size:44px;block-size:44px;border-radius:12px;background:color-mix(in srgb,var(--page-primary) 16%,var(--page-surface));color:var(--page-primary)}

.page-content-card>span:last-child{display:grid;min-inline-size:0;gap:2px}

.page-content-card strong,.page-content-card small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.page-content-card small{display:flex;align-items:center;gap:4px;opacity:.7}

.layout--cards{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}

.layout--tiles{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}

.layout--spaced{gap:20px}

.layout--compact{gap:6px}

.page-link{--item-accent:var(--page-primary);display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;min-inline-size:0;padding:14px;overflow:hidden;border:1px solid color-mix(in srgb,var(--item-accent) 28%,var(--color-border));border-radius:14px;background:color-mix(in srgb,var(--item-accent) 8%,var(--page-surface));color:inherit;text-decoration:none}

.layout--tiles .page-link{grid-template-columns:1fr;align-content:start}

.layout--compact .page-link{padding:8px;border-radius:8px}

.page-link__media{grid-column:1/-1;margin:-14px -14px 2px;aspect-ratio:16/9;overflow:hidden}

.page-link__media img,.page-link__media video{inline-size:100%;block-size:100%;object-fit:cover}

.page-link__thumbnail{inline-size:48px;block-size:48px;border-radius:10px;object-fit:cover}

.page-link__content{display:grid;min-inline-size:0;gap:3px}

.page-link__content>strong,.page-link__content>span,.page-link__content>small,.page-link__content>code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.page-link__content code{color:var(--page-primary)}

.page-link__content small,.page-link__meta{opacity:.7}

.page-link__meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.75rem}

.page-link__meta span{display:inline-flex;align-items:center;gap:3px}

.page-preview__empty{padding:48px 20px;text-align:center;opacity:.65}

.page-preview footer{display:flex;justify-content:space-between;gap:12px;margin-block-start:36px;padding-block-start:16px;border-block-start:1px solid color-mix(in srgb,var(--page-text) 18%,transparent);opacity:.62;font-size:.8rem}
</style>
