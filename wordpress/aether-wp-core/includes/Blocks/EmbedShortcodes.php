<?php

declare(strict_types=1);

namespace AetherDigital\WP\Blocks;

if (!defined('ABSPATH')) {
    exit;
}

class EmbedShortcodes
{
    private const ALLOWED_APPS = ['aurabuild', 'voltswitch', 'chronosflow'];

    public static function register(): void
    {
        if (function_exists('add_shortcode')) {
            \add_shortcode('aether_aurabuild', static fn (array $atts = []): string => self::render_mount('aurabuild', $atts));
            \add_shortcode('aether_voltswitch', static fn (array $atts = []): string => self::render_mount('voltswitch', $atts));
            \add_shortcode('aether_chronosflow', static fn (array $atts = []): string => self::render_mount('chronosflow', $atts));
        }

        if (function_exists('register_block_type')) {
            \register_block_type('aether/app-embed', [
                'attributes' => [
                    'app' => [
                        'type'    => 'string',
                        'default' => 'aurabuild',
                    ],
                ],
                'render_callback' => [self::class, 'render_gutenberg_block'],
            ]);
        }
    }

    public static function render_gutenberg_block(array $attributes = []): string
    {
        $app = strtolower(\sanitize_text_field((string) ($attributes['app'] ?? 'aurabuild')));
        if (!in_array($app, self::ALLOWED_APPS, true)) {
            $app = 'aurabuild';
        }

        return self::render_mount($app, $attributes);
    }

    public static function render_mount(string $app, array $atts = []): string
    {
        $safeApp = in_array($app, self::ALLOWED_APPS, true) ? $app : 'aurabuild';
        $restRoot = function_exists('rest_url') ? \esc_url(\rest_url('aether/v1/')) : '/wp-json/aether/v1/';
        $nonce = function_exists('wp_create_nonce') ? \esc_attr(\wp_create_nonce('wp_rest')) : '';
        $minHeight = \esc_attr((string) ($atts['min_height'] ?? '720px'));

        return sprintf(
            '<div class="aether-app-mount" data-app="%s" data-rest-root="%s" data-wp-nonce="%s" style="min-height:%s;"></div>',
            \esc_attr($safeApp),
            $restRoot,
            $nonce,
            $minHeight
        );
    }
}
