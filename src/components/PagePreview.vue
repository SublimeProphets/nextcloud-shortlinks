<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiAccountOutline, mdiCursorDefaultClickOutline, mdiEmailOutline, mdiFileOutline, mdiFolderOutline, mdiLockOutline, mdiPhoneOutline, mdiTagOutline } from '@mdi/js'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import { normalizePageSectionOrder, publicPageContentOrder } from '../pageSections'
import { pageFontStack } from '../pageThemes'
import type { Folder, LinkPageDraft, ShortLink } from '../types'

const props = defineProps<{ draft: LinkPageDraft; links: ShortLink[]; folders: Folder[]; interactive?: boolean }>()
const selectedLinks = computed(() => props.links.filter(link => props.draft.linkIds.includes(link.id)
	|| (link.folderId !== null && props.draft.folderIds.includes(link.folderId))
	|| link.tags.some(tag => props.draft.tagIds.includes(tag.id))))
const footerLinks = computed(() => props.links.filter(link => props.draft.footer.linkIds?.includes(link.id)))
const headerVisible = computed(() => props.draft.header.brand !== false || props.draft.header.mark !== false || props.draft.header.title !== false || props.draft.header.lead !== false || props.draft.header.owner !== false)
const contentOrder = computed(() => publicPageContentOrder(normalizePageSectionOrder(props.draft.sectionOrder)))
const failedFilePreviews = ref(new Set<string>())
const previewStyle = computed(() => ({
	'--page-background': props.draft.theme.background || 'var(--color-main-background)',
	'--page-text': props.draft.theme.text || 'var(--color-main-text)',
	'--page-primary': props.draft.theme.primary || 'var(--color-primary-element)',
	'--page-surface': props.draft.theme.surface || 'var(--color-background-hover)',
	'--page-font': pageFontStack(props.draft.theme.font || 'system'),
	'--page-base-size': `${props.draft.theme.baseSize || 16}px`,
	'--page-scale': String((props.draft.theme.scale || 100) / 100),
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
function filePreviewUrl(path: string): string { return `${generateUrl('/core/preview')}?${new URLSearchParams({ file: path, x: '256', y: '192', a: '1' })}` }
function markFilePreviewFailed(path: string) { failedFilePreviews.value = new Set([...failedFilePreviews.value, path]) }
</script>

<template>
	<article class="page-preview" :class="`page-preview--theme-${draft.theme.preset || 'nextcloud'}`" :style="previewStyle">
		<header v-if="headerVisible" class="page-preview__header" :class="[`page-preview__header--${draft.header.alignment || 'center'}`, { 'page-preview__header--compact': draft.header.compact }]">
			<span v-if="draft.header.brand !== false" class="page-preview__brand">Nextcloud Shortlinks</span><div v-if="draft.header.mark !== false" class="page-preview__mark" aria-hidden="true">
				{{ (draft.title || 'S').slice(0, 1).toUpperCase() }}
			</div>
			<h1 v-if="draft.header.title !== false">
				{{ draft.title || t('shortlinks', 'Untitled page') }}
			</h1>
			<p v-if="draft.header.lead !== false && draft.lead">
				{{ draft.lead }}
			</p><small v-if="draft.header.owner !== false">{{ t('shortlinks', 'Shared by you') }}</small>
		</header>
		<div class="page-preview__groups">
			<template v-for="contentType in contentOrder" :key="contentType">
				<template v-if="contentType === 'links'">
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
				</template>
				<section v-else-if="contentType === 'files' && draft.filePaths.length" class="page-preview__content-section">
					<h2><NcIconSvgWrapper :path="mdiFileOutline" :size="22" />{{ t('shortlinks', 'Files') }}</h2><div class="page-preview__content-grid">
						<div v-for="path in draft.filePaths" :key="path" class="page-content-card">
							<span class="page-content-card__icon page-content-card__icon--file"><img v-if="!failedFilePreviews.has(path)"
								:src="filePreviewUrl(path)"
								alt=""
								@error="markFilePreviewFailed(path)"><NcIconSvgWrapper v-else :path="mdiFileOutline" :size="28" /></span><span><strong>{{ fileName(path) }}</strong><small>{{ path }}</small></span>
						</div>
					</div>
				</section><section v-else-if="contentType === 'contacts' && draft.contacts.length" class="page-preview__content-section">
					<h2><NcIconSvgWrapper :path="mdiAccountOutline" :size="22" />{{ t('shortlinks', 'Contacts') }}</h2><div class="page-preview__content-grid">
						<div v-for="contact in draft.contacts" :key="contact.key" class="page-content-card page-content-card--contact">
							<span class="page-content-card__icon"><NcIconSvgWrapper :path="mdiAccountOutline" :size="28" /></span><span><strong>{{ contact.name }}</strong><small v-if="contact.organization">{{ contact.organization }}</small><small v-if="contact.emails[0]"><NcIconSvgWrapper :path="mdiEmailOutline" :size="14" />{{ contact.emails[0] }}</small><small v-if="contact.phones[0]"><NcIconSvgWrapper :path="mdiPhoneOutline" :size="14" />{{ contact.phones[0] }}</small></span>
						</div>
					</div>
				</section>
			</template><p v-if="!selectedLinks.length && !draft.filePaths.length && !draft.contacts.length" class="page-preview__empty">
				{{ t('shortlinks', 'Select links, files, or contacts to fill this page.') }}
			</p>
		</div>
		<footer v-if="draft.footer.enabled !== false">
			<div class="page-preview__footer-meta">
				<span v-if="draft.footer.brand !== false">{{ draft.footer.attribution || t('shortlinks', 'Shared securely with Nextcloud Shortlinks') }}</span><span v-if="draft.footer.updated !== false">{{ new Date().toLocaleDateString() }}</span>
			</div><nav v-if="footerLinks.length" :aria-label="t('shortlinks', 'Footer links')">
				<component :is="interactive ? 'a' : 'span'"
					v-for="link in footerLinks"
					:key="link.id"
					:href="interactive ? link.shortUrl : undefined">
					{{ link.title || link.slug }}
				</component>
			</nav>
		</footer>
	</article>
</template>

<style scoped>
.page-preview{--page-background:var(--color-main-background);--page-text:var(--color-main-text);--page-primary:var(--color-primary-element);--page-surface:var(--color-background-hover);--page-font:system-ui,sans-serif;--page-base-size:16px;--page-scale:1;display:grid;align-content:start;block-size:100%;min-block-size:560px;padding:clamp(calc(20px * var(--page-scale)),5vw,calc(48px * var(--page-scale)));overflow:auto;border:1px solid color-mix(in srgb,var(--page-text) 18%,transparent);border-radius:var(--border-radius-large);background:var(--page-background);color:var(--page-text);font-family:var(--page-font);font-size:calc(var(--page-base-size) * var(--page-scale))}

.page-preview__header{display:grid;justify-items:center;gap:8px;margin-block-end:32px;text-align:center}

.page-preview__header--left{justify-items:start;text-align:start}

.page-preview__header--compact{grid-template-columns:auto 1fr;align-items:center;column-gap:12px;margin-block-end:20px}

.page-preview__header--compact .page-preview__brand,.page-preview__header--compact p,.page-preview__header--compact small{grid-column:1/-1}

.page-preview__header--compact h1{justify-self:start}

.page-preview__brand{padding:5px 10px;border-radius:999px;background:color-mix(in srgb,var(--page-primary) 14%,var(--page-surface));color:var(--page-primary);font-size:.75em;font-weight:800;letter-spacing:.02em}

.page-preview__mark{display:grid;place-items:center;inline-size:64px;block-size:64px;border-radius:20px;background:var(--page-primary);color:#fff;font-size:1.8em;font-weight:800}

.page-preview h1,.page-preview h2,.page-preview p{margin:0}

.page-preview__header p{max-inline-size:560px;opacity:.75}

.page-preview__groups{display:grid;gap:28px}

.page-preview__groups>section{display:grid;gap:12px}

.page-preview__groups h2{display:flex;align-items:center;gap:7px}

.page-preview__links,.page-preview__content-grid{display:grid;gap:12px}

.page-preview__content-grid{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}

.page-content-card{display:flex;align-items:center;gap:11px;min-inline-size:0;padding:13px;border:1px solid color-mix(in srgb,var(--page-primary) 28%,var(--color-border));border-radius:14px;background:color-mix(in srgb,var(--page-primary) 7%,var(--page-surface))}

.page-content-card__icon{display:grid;place-items:center;flex:0 0 44px;inline-size:44px;block-size:44px;overflow:hidden;border-radius:12px;background:color-mix(in srgb,var(--page-primary) 16%,var(--page-surface));color:var(--page-primary)}

.page-content-card__icon--file{flex:0 1 64px;inline-size:min(64px,33%);max-inline-size:33%;block-size:auto;aspect-ratio:4/3}

.page-content-card__icon img{inline-size:100%;block-size:100%;object-fit:cover}

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

.page-link__meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.75em}

.page-link__meta span{display:inline-flex;align-items:center;gap:3px}

.page-preview__empty{padding:48px 20px;text-align:center;opacity:.65}

.page-preview footer{display:grid;justify-items:center;gap:10px;margin-block-start:36px;padding-block-start:16px;border-block-start:1px solid color-mix(in srgb,var(--page-text) 18%,transparent);text-align:center;font-size:.8em}

.page-preview__footer-meta,.page-preview footer nav{display:flex;justify-content:center;flex-wrap:wrap;gap:8px 14px}

.page-preview__footer-meta{opacity:.62}

.page-preview footer nav a,.page-preview footer nav span{color:var(--page-primary);font-weight:700;text-decoration:none}

.page-preview--theme-nextcloud{border-radius:12px}

.page-preview--theme-nextcloud .page-link,.page-preview--theme-nextcloud .page-content-card{border-radius:10px;box-shadow:0 1px 3px rgb(0 0 0 / 8%)}

.page-preview--theme-neutral .page-link,.page-preview--theme-neutral .page-content-card{box-shadow:none}

.page-preview--theme-modern{background-image:radial-gradient(circle at 88% 4%,color-mix(in srgb,var(--page-primary) 30%,transparent),transparent 32%)}

.page-preview--theme-modern .page-preview__mark{border-radius:50%;box-shadow:0 10px 32px color-mix(in srgb,var(--page-primary) 50%,transparent)}

.page-preview--theme-modern .page-link,.page-preview--theme-modern .page-content-card{border-radius:20px;box-shadow:0 16px 34px rgb(0 0 0 / 20%);backdrop-filter:blur(8px)}

.page-preview--theme-editorial .page-preview__brand{border-radius:2px;letter-spacing:.08em;text-transform:uppercase}

.page-preview--theme-editorial .page-preview__mark{border-radius:4px}

.page-preview--theme-editorial .page-link,.page-preview--theme-editorial .page-content-card{border-radius:3px;box-shadow:4px 4px 0 color-mix(in srgb,var(--page-primary) 18%,transparent)}
</style>
