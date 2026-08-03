<?php

declare(strict_types=1);

namespace OCA\Shortlinks\Tests\Unit\Service;

use OCA\Shortlinks\Exception\ValidationException;
use OCA\Shortlinks\Service\ImportExportService;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

final class ImportExportServiceTest extends TestCase {
	#[DataProvider('formats')]
	public function testImportFormatDetection(string $content, string $expected): void {
		self::assertSame($expected, $this->invoke('detectFormat', $content));
	}

	/** @return iterable<string,array{string,string}> */
	public static function formats(): iterable {
		yield 'Shortlinks backup' => ['{"format":"nextcloud-shortlinks-backup","version":2,"links":[]}', 'shortlinks-backup'];
		yield 'Shortlinks JSON' => ['{"version":1,"links":[]}', 'json'];
		yield 'Shortlinks CSV' => ["slug,target_url,title\nwelcome,https://example.com,Welcome", 'csv'];
		yield 'YOURLS CSV' => ["source,target,hits\nhttps://sho.rt/welcome,https://example.com,12", 'yourls-csv'];
		yield 'YOURLS XML' => ['<?xml version="1.0"?><redirection />', 'yourls-xml'];
	}

	public function testYourlsXmlMapsLinkMetadata(): void {
		$xml = <<<'XML'
<?xml version="1.0"?>
<redirection>
  <module>
    <group>
      <item>
        <source>https://sho.rt/welcome</source>
        <title>Welcome page</title>
        <action code="301">https://example.com/start</action>
        <statistic count="42" access="2026-07-31 10:30:00" />
      </item>
    </group>
  </module>
</redirection>
XML;
		$rows = $this->invoke('yourlsXmlRows', $xml);

		self::assertCount(1, $rows);
		self::assertSame('https://sho.rt/welcome', $rows[0]['source']);
		self::assertSame('https://example.com/start', $rows[0]['url']);
		self::assertSame('Welcome page', $rows[0]['title']);
		self::assertSame('42', $rows[0]['clicks']);
		self::assertSame(301, $rows[0]['redirect_status']);
	}

	public function testUnknownFormatRequiresManualSelection(): void {
		$this->expectException(ValidationException::class);
		$this->invoke('detectFormat', 'unrecognised import data');
	}

	private function invoke(string $method, string $content): mixed {
		$reflection = new ReflectionClass(ImportExportService::class);
		$service = $reflection->newInstanceWithoutConstructor();
		return $reflection->getMethod($method)->invoke($service, $content);
	}
}
