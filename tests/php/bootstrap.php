<?php
// Minimal stubs so we can load the plugin file without full WordPress.
if (!function_exists('add_action')) { function add_action($h,$c){ /* no-op for tests */ } }
if (!function_exists('register_block_type')) { function register_block_type($a,$b=array()){ /* no-op */ } }
if (!function_exists('plugins_url')) { function plugins_url($p='',$f=''){ return $p; } }
if (!function_exists('wp_register_script')) { function wp_register_script(){ /* no-op */ } }
if (!function_exists('wp_register_style')) { function wp_register_style(){ /* no-op */ } }
if (!function_exists('plugin_basename')) { function plugin_basename($f){ return $f; } }

// Sanitization helpers (very light stand-ins)
if (!function_exists('esc_url')) { function esc_url($s){ return filter_var($s, FILTER_SANITIZE_URL) ?: ''; } }
if (!function_exists('esc_attr')) { function esc_attr($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); } }
if (!function_exists('esc_html')) { function esc_html($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); } }
if (!function_exists('wp_kses_post')) {
  function wp_kses_post($s){
    // Allow a small subset of tags often used in captions.
    return strip_tags($s, '<a><em><strong><br><span><b><i>');
  }
}

// Load the plugin file from the repo root (adjust if needed in your tree)
$pluginFile = __DIR__ . '/../../ipg-lightbox-gallery.php';
if (file_exists($pluginFile)) {
  require_once $pluginFile;
} else {
  // Try alternate names
  $alt = __DIR__ . '/../../ipg-lightbox-gallery/ipg-lightbox-gallery.php';
  if (file_exists($alt)) require_once $alt;
}
