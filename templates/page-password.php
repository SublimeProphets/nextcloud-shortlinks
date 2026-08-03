<?php

declare(strict_types=1);

/** @var array{slug:string,error:?string} $_ */
?>
<form method="post" class="shortlinks-password-form">
	<h2><?php p($l->t('Protected Page')); ?></h2>
	<p><?php p($l->t('Enter the password to view this collection of links.')); ?></p>
	<?php if ($_['error'] !== null): ?>
		<p class="shortlinks-error" role="alert"><?php p($l->t($_['error'])); ?></p>
	<?php endif; ?>
	<label for="shortlinks-page-password"><?php p($l->t('Password')); ?></label>
	<input id="shortlinks-page-password" name="password" type="password" autocomplete="current-password" required autofocus>
	<button type="submit"><?php p($l->t('Open Page')); ?></button>
</form>
