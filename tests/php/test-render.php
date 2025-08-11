<?php
use PHPUnit\Framework\TestCase;

final class RenderTest extends TestCase {

  public function test_empty_items_renders_wrapper() {
    $out = ipg_lg_render([ 'items' => [] ], '');
    $this->assertStringContainsString('class="ipg"', $out);
    $this->assertStringContainsString('class="img-gallery"', $out);
  }

  public function test_renders_item_with_escaping() {
    $attrs = [
      'items' => [[
        'src' => 'https://example.com/a.jpg?<script>alert(1)</script>',
        'width' => 800,
        'height' => 600,
        'alt' => '"onerror=alert(1)',
        'caption' => 'Nice <strong>photo</strong> <script>x</script>',
        'seo' => '<b>seo text</b><script>x</script>'
      ]]
    ];
    $out = ipg_lg_render($attrs, '');
    $this->assertStringContainsString('<img src="https://example.com/a.jpg?', $out);
    $this->assertStringContainsString('width="800"', $out);
    $this->assertStringContainsString('height="600"', $out);
    $this->assertStringNotContainsString('script', $out);
    $this->assertStringContainsString('&quot;onerror=alert(1)', $out);
    $this->assertStringContainsString('<strong>photo</strong>', $out);
    $this->assertStringContainsString('seo text', $out);
  }
}
