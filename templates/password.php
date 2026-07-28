<?php

declare(strict_types=1);

/** @var array{slug:string,error:?string} $_ */
?>
<form method="post" class="shortlinks-password-form">
	<h2><?php p($l->t('Protected short link')); ?></h2>
	<?php if ($_['error'] !== null): ?>
		<p class="shortlinks-error" role="alert"><?php p($_['error']); ?></p>
	<?php endif; ?>
	<label for="shortlinks-password"><?php p($l->t('Password')); ?></label>
	<input id="shortlinks-password" name="password" type="password" autocomplete="current-password" required autofocus>
	<button type="submit"><?php p($l->t('Continue')); ?></button>
</form>
