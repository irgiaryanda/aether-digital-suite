<?php
/**
 * AetherDigital Custom Theme Functions
 *
 * @package AetherDigitalTheme
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('AETHER_THEME_VERSION', '1.0.0');

function aether_theme_get_allowed_origins(): array
{
    $defaults = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
    ];

    if (function_exists('apply_filters')) {
        return (array) \apply_filters('aether_allowed_origins', $defaults);
    }

    return $defaults;
}

function aether_theme_emit_cors_headers(): void
{
    if (headers_sent() || !function_exists('header')) {
        return;
    }

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim((string) $_SERVER['HTTP_ORIGIN']) : '';
    if ($origin === '') {
        return;
    }

    $allowed = aether_theme_get_allowed_origins();
    if (!in_array($origin, $allowed, true)) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, Accept, Origin, X-Requested-With');

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        if (function_exists('status_header')) {
            \status_header(200);
        }
        exit;
    }
}

add_action('init', 'aether_theme_emit_cors_headers');

add_action('after_setup_theme', static function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);

    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'wp_generator');
});

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style('aether-theme-style', get_stylesheet_uri(), [], AETHER_THEME_VERSION);

    wp_register_script('aether-bridge', '', [], AETHER_THEME_VERSION, true);
    wp_enqueue_script('aether-bridge');

    wp_localize_script('aether-bridge', 'AetherSettings', [
        'root'    => esc_url_raw(rest_url('aether/v1/')),
        'nonce'   => wp_create_nonce('wp_rest'),
        'homeUrl' => esc_url_raw(home_url('/')),
    ]);
});

add_filter('acf/settings/load_json', static function (array $paths): array {
    $themeAcfPath = get_stylesheet_directory() . '/acf-json';
    if (is_dir($themeAcfPath)) {
        $paths[] = $themeAcfPath;
    }
    return $paths;
});
