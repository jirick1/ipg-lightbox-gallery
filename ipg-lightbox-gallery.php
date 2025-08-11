<?php
/**
 * Plugin Name: IPG Lightbox Gallery (Scoped)
 * Description: Self-contained lazy gallery + lightbox (prev/next) Gutenberg block with per-item alt, caption, and SEO text. Scoped CSS/JS to avoid theme conflicts.
 * Version: 1.0.4
 * Author: IPG Gallery Contributors
 * License: MIT
 * Requires at least: 6.2         // WordPress version
 * Tested up to: 6.8.2            // WordPress version
 * Requires PHP: 8.4.3            // Minimum PHP version
 */

if ( ! defined( 'ABSPATH' ) ) exit;

add_action('init', function () {
  // Editor script (depends on WP block editor libs)
  wp_register_script(
    'ipg-gallery-editor',
    plugins_url('index.js', __FILE__),
    array('wp-blocks','wp-element','wp-editor','wp-block-editor','wp-components','wp-i18n','wp-data'),
    '1.0.3',
    true
  );

  // Front + editor styles
  wp_register_style(
    'ipg-gallery-style',
    plugins_url('style.css', __FILE__),
    array(),
    '1.0.3'
  );

  // Front-end lightbox + lazy loader
  wp_register_script(
    'ipg-gallery-frontend',
    plugins_url('frontend.js', __FILE__),
    array(),
    '1.0.3',
    true
  );

  register_block_type( __DIR__ . '/block.json', array(
    'editor_script'   => 'ipg-gallery-editor',
    'style'           => 'ipg-gallery-style',
    'script'          => 'ipg-gallery-frontend',
    'render_callback' => 'ipg_lg_render',
  ));
});

function ipg_lg_render( $attributes = [], $content = '' ) {
  $items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : [];
  ob_start(); ?>
  <div class="ipg" data-ipg>
    <div class="page-container">
      <div class="img-gallery">
        <?php foreach ( $items as $it ) :
          $src   = isset($it['src'])      ? esc_url($it['src'])      : '';
          $w     = isset($it['width'])    ? intval($it['width'])     : 0;
          $h     = isset($it['height'])   ? intval($it['height'])    : 0;
          $alt   = isset($it['alt'])      ? esc_attr($it['alt'])     : '';
          $cap   = isset($it['caption'])  ? wp_kses_post($it['caption']) : '';
          $seo   = isset($it['seo'])      ? esc_html($it['seo'])     : '';
          if (!$src) continue; ?>
          <div class="img-gallery__item">
            <figure>
              <img src="<?php echo $src; ?>" <?php if($w) echo 'width="'. $w .'"'; ?> <?php if($h) echo 'height="'. $h .'"'; ?> alt="<?php echo $alt; ?>" />
              <?php if ($cap) : ?><figcaption><?php echo $cap; ?></figcaption><?php endif; ?>
              <?php if ($seo) : ?><span class="ipg__sr"><?php echo $seo; ?></span><?php endif; ?>
            </figure>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
  <?php
  return ob_get_clean();
}
