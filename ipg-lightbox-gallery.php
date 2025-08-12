<?php
/**
 * Plugin Name: IPG Lightbox Gallery (Scoped)
 * Description: Self-contained lazy gallery + lightbox (prev/next) Gutenberg block with per-item alt, caption, and SEO text. Scoped CSS/JS to avoid theme conflicts.
 * Version: 1.3.0
 * Author: IPG Gallery Contributors
 * Author URI: https://github.com/jirick1/ipg-lightbox-gallery/
 * License: MIT-NC
 * License URI: https://github.com/jirick1/ipg-lightbox-gallery/blob/main/LICENSE.txt
 * Requires at least: 6.2
 * Tested up to: 6.8.2
 * Requires PHP: 8.4.3
 *
 * @package IPG_Lightbox_Gallery
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'init',
	function () {
		$base = __DIR__;

		// Read version from the plugin header so assets always match releases.
		if ( function_exists( 'get_file_data' ) ) {
			$data = get_file_data( __FILE__, array( 'Version' => 'Version' ), 'plugin' );
			$ver  = ! empty( $data['Version'] ) ? $data['Version'] : '1.0.0';
		} else {
			$ver = '1.0.0';
		}

		// Prefer minified assets if present.
		$editor_js   = file_exists( "$base/index.min.js" ) ? 'index.min.js' : 'index.js';
		$frontend_js = file_exists( "$base/frontend.min.js" ) ? 'frontend.min.js' : 'frontend.js';
		$style_css   = file_exists( "$base/style.min.css" ) ? 'style.min.css' : 'style.css';

		// Editor script (depends on WP block editor libs).
		wp_register_script(
			'ipg-gallery-editor',
			plugins_url( $editor_js, __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data' ),
			$ver,
			true
		);

		// Front + editor styles.
		wp_register_style(
			'ipg-gallery-style',
			plugins_url( $style_css, __FILE__ ),
			array(),
			$ver
		);

		// Front-end lightbox + lazy loader.
		wp_register_script(
			'ipg-gallery-frontend',
			plugins_url( $frontend_js, __FILE__ ),
			array(),
			$ver,
			true
		);

		register_block_type(
			__DIR__ . '/block.json',
			array(
				'editor_script'   => 'ipg-gallery-editor',
				'style'           => 'ipg-gallery-style',
				'script'          => 'ipg-gallery-frontend',
				'render_callback' => 'ipg_lg_render',
			)
		);
	}
);

/**
 * Server-side renderer for the IPG Lightbox Gallery block.
 *
 * @param array  $attributes Block attributes (expects 'items' array with keys: src, width, height, alt, caption, seo).
 * @param string $content    Block content (unused).
 * @return string Rendered HTML.
 */
function ipg_lg_render( $attributes = array(), $content = '' ) {
 // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found

	// This block does not use $content; keep the signature for WP while avoiding warnings.
	unset( $content );

	$items = ( isset( $attributes['items'] ) && is_array( $attributes['items'] ) ) ? $attributes['items'] : array();

	ob_start();
	?>
	<div class="ipg" data-ipg>
	<div class="page-container">
		<div class="img-gallery">
		<?php
		foreach ( $items as $it ) :
			$src = isset( $it['src'] ) ? (string) $it['src'] : '';
			if ( '' === $src ) {
				continue;
			}
			$w   = isset( $it['width'] ) ? (int) $it['width'] : 0;
			$h   = isset( $it['height'] ) ? (int) $it['height'] : 0;
			$alt = isset( $it['alt'] ) ? (string) $it['alt'] : '';
			$cap = isset( $it['caption'] ) ? (string) $it['caption'] : '';
			$seo = isset( $it['seo'] ) ? (string) $it['seo'] : '';
			?>
			<div class="img-gallery__item">
			<figure>
				<img
				<?php
				printf( ' src="%s"', esc_url( $src ) );
				if ( $w > 0 ) {
					printf( ' width="%s"', esc_attr( $w ) );
				}
				if ( $h > 0 ) {
					printf( ' height="%s"', esc_attr( $h ) );
				}
				printf( ' alt="%s"', esc_attr( $alt ) );
				?>
				/>
				<?php if ( '' !== $cap ) : ?>
				<figcaption><?php echo wp_kses_post( $cap ); ?></figcaption>
				<?php endif; ?>
				<?php if ( '' !== $seo ) : ?>
				<span class="ipg__sr"><?php echo esc_html( $seo ); ?></span>
				<?php endif; ?>
			</figure>
			</div>
		<?php endforeach; ?>
		</div>
	</div>
	</div>
	<?php
	return ob_get_clean();
}
