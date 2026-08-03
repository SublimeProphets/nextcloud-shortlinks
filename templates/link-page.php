<?php

declare(strict_types=1);

/** @var array{page:array<string,mixed>,links:list<array<string,mixed>>,files:list<array<string,mixed>>,contacts:list<array<string,mixed>>,owner:string} $_ */
$page = $_['page'];
$links = $_['links'];
$files = $_['files'];
$contacts = $_['contacts'];
$fields = array_flip((array)$page['visibleFields']);
$theme = (array)$page['theme'];
$header = (array)$page['header'];
$footer = (array)$page['footer'];
$candidateColor = (string)($theme['primary'] ?? $theme['accent'] ?? '');
$color = preg_match('/^#[0-9a-fA-F]{6}$/D', $candidateColor) === 1 ? $candidateColor : '#0082c9';
$background = preg_match('/^#[0-9a-fA-F]{6}$/D', (string)($theme['background'] ?? '')) === 1 ? (string)$theme['background'] : '#f5f6f8';
$surface = preg_match('/^#[0-9a-fA-F]{6}$/D', (string)($theme['surface'] ?? '')) === 1 ? (string)$theme['surface'] : '#ffffff';
$text = preg_match('/^#[0-9a-fA-F]{6}$/D', (string)($theme['text'] ?? '')) === 1 ? (string)$theme['text'] : '#222222';
$formatSize = static function (int $bytes) use ($l): string {
	if ($bytes < 1024) {
		return $l->n('%n byte', '%n bytes', $bytes);
	}
	$units = ['KiB', 'MiB', 'GiB', 'TiB'];
	$value = $bytes / 1024;
	$unit = $units[0];
	foreach (array_slice($units, 1) as $candidate) {
		if ($value < 1024) {
			break;
		}
		$value /= 1024;
		$unit = $candidate;
	}
	return number_format($value, $value >= 10 ? 0 : 1) . ' ' . $unit;
};
$groups = [['title' => '', 'links' => $links]];
if (($page['grouping'] ?? 'none') === 'folder') {
	$byFolder = [];
	foreach ($links as $link) {
		$name = is_array($link['folder'] ?? null) ? (string)($link['folder']['name'] ?? $l->t('Without folder')) : $l->t('Without folder');
		$byFolder[$name][] = $link;
	}
	$groups = array_map(static fn (string $name, array $items): array => ['title' => $name, 'links' => $items], array_keys($byFolder), array_values($byFolder));
} elseif (($page['grouping'] ?? 'none') === 'tag') {
	$byTag = [];
	foreach ($links as $link) {
		$tags = (array)($link['tags'] ?? []);
		if ($tags === []) {
			$byTag[$l->t('Without tag')][] = $link;
		}
		foreach ($tags as $tag) {
			$byTag[(string)($tag['name'] ?? $l->t('Without tag'))][] = $link;
		}
	}
	$groups = array_map(static fn (string $name, array $items): array => ['title' => $name, 'links' => $items], array_keys($byTag), array_values($byTag));
}
style('shortlinks', 'public-page');
?>
<main class="link-page link-page--<?php p((string)$page['layout']); ?>" style="--page-accent:<?php p($color); ?>;--page-bg:<?php p($background); ?>;--page-surface:<?php p($surface); ?>;--page-text:<?php p($text); ?>">
	<header class="link-page__hero">
		<?php if (($header['brand'] ?? true) === true): ?><span class="link-page__brand">Nextcloud Shortlinks</span><?php endif; ?>
		<?php if (($header['title'] ?? true) === true): ?><h1><?php p((string)$page['title']); ?></h1><?php endif; ?>
		<?php if (($header['lead'] ?? true) === true && $page['lead'] !== null): ?><p><?php p((string)$page['lead']); ?></p><?php endif; ?>
		<?php if (($header['owner'] ?? true) === true): ?><small><?php p($l->t('Shared by %s', [$_['owner']])); ?></small><?php endif; ?>
	</header>
	<section class="link-page__groups" aria-label="<?php p($l->t('Page content')); ?>">
		<?php if ($links === [] && $files === [] && $contacts === []): ?><p class="link-page__empty"><?php p($l->t('No content is currently available on this Page.')); ?></p><?php endif; ?>
		<?php foreach ($groups as $group): ?><section class="link-page__group">
			<?php if ($group['title'] !== ''): ?><h2><?php p((string)$group['title']); ?></h2><?php endif; ?>
			<div class="link-page__items">
		<?php foreach ($group['links'] as $link): ?>
			<a class="link-page-card" href="<?php p((string)$link['shortUrl']); ?>" style="--link-color:<?php p(preg_match('/^#[0-9a-fA-F]{6}$/D', (string)($link['color'] ?? '')) === 1 ? (string)$link['color'] : $color); ?>">
				<?php if (isset($fields['media']) && $link['mediaUrl'] !== null): ?>
					<?php if (str_starts_with((string)($link['mediaMime'] ?? ''), 'video/')): ?><video src="<?php p((string)$link['mediaUrl']); ?>" muted loop playsinline preload="metadata"></video><?php else: ?><img class="link-page-card__media" src="<?php p((string)$link['mediaUrl']); ?>" alt=""><?php endif; ?>
				<?php elseif (isset($fields['thumbnail']) && ($link['thumbnailMediaUrl'] !== null || $link['thumbnailUrl'] !== null)): ?>
					<img class="link-page-card__media" src="<?php p((string)($link['thumbnailMediaUrl'] ?? $link['thumbnailUrl'])); ?>" alt="">
				<?php endif; ?>
				<span class="link-page-card__body">
					<?php if (isset($fields['title'])): ?><strong><?php p((string)($link['title'] ?: $link['slug'])); ?></strong><?php endif; ?>
					<?php if (isset($fields['description']) && $link['description'] !== null): ?><span><?php p((string)$link['description']); ?></span><?php endif; ?>
					<span class="link-page-card__meta">
						<?php if (isset($fields['domain'])): ?><span><?php p((string)$link['domain']); ?></span><?php endif; ?>
						<?php if (isset($fields['shortUrl'])): ?><span><?php p((string)$link['shortUrl']); ?></span><?php endif; ?>
						<?php if (isset($fields['clicks'])): ?><span><?php p($l->n('%n click', '%n clicks', (int)$link['clickCount'])); ?></span><?php endif; ?>
						<?php if (isset($fields['folder']) && is_array($link['folder'] ?? null)): ?><span><?php p((string)$link['folder']['name']); ?></span><?php endif; ?>
						<?php if (isset($fields['tags']) && (array)($link['tags'] ?? []) !== []): ?><span><?php p(implode(', ', array_map(static fn (array $tag): string => (string)($tag['name'] ?? ''), (array)$link['tags']))); ?></span><?php endif; ?>
					</span>
				</span>
			</a>
		<?php endforeach; ?>
			</div>
		</section><?php endforeach; ?>
		<?php if ($files !== []): ?><section class="link-page__group link-page__content-group">
			<h2><?php p($l->t('Files')); ?></h2><div class="link-page__content-items">
			<?php foreach ($files as $file): ?><article class="page-file-card">
				<a class="page-file-card__main" href="<?php p((string)$file['inlineUrl']); ?>">
					<?php if (($file['isImage'] ?? false) === true): ?><img src="<?php p((string)$file['inlineUrl']); ?>" alt=""><?php else: ?><span class="page-file-card__icon" aria-hidden="true">&#128196;</span><?php endif; ?>
					<span><strong><?php p((string)$file['name']); ?></strong><small><?php p($formatSize((int)$file['size'])); ?> · <?php p((string)$file['mime']); ?></small></span>
				</a><a class="page-file-card__download" href="<?php p((string)$file['downloadUrl']); ?>"><?php p($l->t('Download')); ?></a>
			</article><?php endforeach; ?>
			</div>
		</section><?php endif; ?>
		<?php if ($contacts !== []): ?><section class="link-page__group link-page__content-group">
			<h2><?php p($l->t('Contacts')); ?></h2><div class="link-page__content-items">
			<?php foreach ($contacts as $contact): ?><article class="page-contact-card">
				<span class="page-contact-card__avatar" aria-hidden="true"><?php p(mb_strtoupper(mb_substr((string)($contact['name'] ?? '?'), 0, 1))); ?></span><span class="page-contact-card__body"><strong><?php p((string)($contact['name'] ?? '')); ?></strong>
				<?php if ((string)($contact['organization'] ?? '') !== ''): ?><small><?php p((string)$contact['organization']); ?></small><?php endif; ?>
				<?php foreach (array_slice((array)($contact['emails'] ?? []), 0, 3) as $email): ?><a href="mailto:<?php p((string)$email); ?>"><?php p((string)$email); ?></a><?php endforeach; ?>
				<?php foreach (array_slice((array)($contact['phones'] ?? []), 0, 3) as $phone): ?><a href="tel:<?php p((string)$phone); ?>"><?php p((string)$phone); ?></a><?php endforeach; ?></span>
			</article><?php endforeach; ?>
			</div>
		</section><?php endif; ?>
	</section>
	<?php if (($footer['enabled'] ?? true) === true): ?><footer><?php if (($footer['brand'] ?? true) === true) {
		p($l->t('Shared securely with Nextcloud Shortlinks'));
	} ?><?php if (($footer['updated'] ?? true) === true): ?><span><?php p($l->t('Updated %s', [date('Y-m-d', (int)$page['updatedAt'])])); ?></span><?php endif; ?></footer><?php endif; ?>
</main>
