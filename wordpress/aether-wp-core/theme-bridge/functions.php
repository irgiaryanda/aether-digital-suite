<?php
/**
 * AetherDigital Headless Theme Bridge Functions
 *
 * @package AetherDigital
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    // Stub
}

// Add Headless CORS Headers for Local Development & Vercel Preview Deployments
add_action('init', static function (): void {
    if (!headers_sent() && function_exists('header')) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, Accept, Origin, X-Requested-With');

        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
});

// Remove Default WordPress Frontend Bloat for Clean Headless Speed
add_action('after_setup_theme', static function (): void {
    // Remove Gutenberg block library CSS on headless frontend
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);

    // Disable WordPress emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');

    // Remove RSD, WLW, Shortlink, and Generator meta tags
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'wp_generator');
});

// Expose REST Nonce and Endpoints to Frontends
add_action('wp_enqueue_scripts', static function (): void {
    if (function_exists('wp_create_nonce') && function_exists('wp_localize_script')) {
        wp_register_script('aether-bridge', false, [], AETHER_WP_CORE_VERSION ?? '1.0.0', true);
        wp_enqueue_script('aether-bridge');

        wp_localize_script('aether-bridge', 'AetherSettings', [
            'root'     => esc_url_raw(rest_url('aether/v1/')),
            'nonce'    => wp_create_nonce('wp_rest'),
            'homeUrl'  => home_url('/'),
        ]);
    }
});
