<?php

declare(strict_types=1);

/** @var array{message:string} $_ */
?>
<main class="shortlinks-public-error">
	<h2><?php p($l->t('Link unavailable')); ?></h2>
	<p><?php p($_['message']); ?></p>
</main>
