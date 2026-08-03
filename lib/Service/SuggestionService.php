<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCP\IUserSession;
use OCP\Mail\IMailer;

final class SuggestionService {
	private const KINDS = ['import-compatibility', 'general', 'bug', 'development'];

	public function __construct(
		private readonly IMailer $mailer,
		private readonly IUserSession $userSession,
		private readonly SettingsService $settings,
	) {
	}

	/** @param array<string, mixed> $data */
	public function submit(array $data): void {
		$kind = trim((string)($data['kind'] ?? 'general'));
		$name = trim((string)($data['name'] ?? ''));
		$details = trim((string)($data['details'] ?? ''));
		$email = trim((string)($data['email'] ?? ''));
		$anonymous = (bool)($data['anonymous'] ?? false);
		if (!in_array($kind, self::KINDS, true)) {
			throw new ValidationException('Unknown request type', ['kind' => 'invalid']);
		}
		if ($kind === 'import-compatibility' && !$this->settings->bool('allow_import_suggestions')) {
			throw new ValidationException('Import compatibility suggestions are disabled by the administrator', ['kind' => 'disabled']);
		}
		if ($name === '' || mb_strlen($name) > 160 || preg_match('/[\r\n\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/', $name) === 1) {
			throw new ValidationException('Enter a name or short subject', ['name' => 'required']);
		}
		if ($details === '' || mb_strlen($details) > 10000 || str_contains($details, "\0")) {
			throw new ValidationException('Enter details of your request (maximum 10000 characters)', ['details' => 'required']);
		}
		if (!$anonymous && (filter_var($email, FILTER_VALIDATE_EMAIL) === false || strlen($email) > 254)) {
			throw new ValidationException('Enter a valid email address or submit anonymously', ['email' => 'invalid']);
		}
		$labels = [
			'import-compatibility' => 'Import compatibility request',
			'general' => 'Shortlinks suggestion',
			'bug' => 'Shortlinks bug report',
			'development' => 'Shortlinks development help',
		];
		$identity = $anonymous ? 'Anonymous submission' : "Contact: {$email}\nUser: " . ($this->userSession->getUser()?->getUID() ?? 'unknown');
		$message = $this->mailer->createMessage()
			->setTo([$this->settings->string('suggestion_recipient') => 'Shortlinks feedback'])
			->setSubject('[' . $labels[$kind] . '] ' . $name)
			->setPlainBody($labels[$kind] . "\n\n{$identity}\n\nSubject / format:\n{$name}\n\nDetails:\n{$details}");
		if (!$anonymous) {
			$message->setReplyTo([$email]);
		}
		if ($this->mailer->send($message) !== []) {
			throw new \RuntimeException('The feedback email could not be delivered');
		}
	}
}
