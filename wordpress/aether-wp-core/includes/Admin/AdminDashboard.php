<?php

declare(strict_types=1);

namespace AetherDigital\WP\Admin;

if (!defined('ABSPATH')) {
    exit;
}

class AdminDashboard
{
    public static function register(): void
    {
        if (!function_exists('add_filter') || !function_exists('add_action')) {
            return;
        }

        \add_filter('manage_aura_quote_posts_columns', [self::class, 'filter_quote_columns']);
        \add_action('manage_aura_quote_posts_custom_column', [self::class, 'render_quote_column'], 10, 2);
        \add_action('admin_menu', [self::class, 'register_menus']);
    }

    public static function filter_quote_columns(array $columns): array
    {
        return [
            'cb'                => $columns['cb'] ?? '<input type="checkbox" />',
            'title'             => 'Client & Reference',
            'aura_product_type' => 'Product Line',
            'aura_postcode'     => 'Postcode',
            'aura_total_aud'    => 'Total Inc-GST',
            'aura_status'       => 'Status',
            'date'              => $columns['date'] ?? 'Date',
        ];
    }

    public static function render_quote_column(string $column, int $post_id): void
    {
        if (!function_exists('get_post_meta')) {
            return;
        }

        switch ($column) {
            case 'aura_product_type':
                echo \esc_html((string) \get_post_meta($post_id, '_aura_product_type', true));
                break;
            case 'aura_postcode':
                echo \esc_html((string) \get_post_meta($post_id, '_aura_postcode', true));
                break;
            case 'aura_total_aud':
                $total = floatval(\get_post_meta($post_id, '_aura_total_aud', true));
                echo '$' . \esc_html(number_format($total, 2)) . ' AUD';
                break;
            case 'aura_status':
                echo \esc_html((string) \get_post_meta($post_id, '_aura_status', true));
                break;
        }
    }

    public static function register_menus(): void
    {
        if (!function_exists('add_menu_page') || !function_exists('add_submenu_page')) {
            return;
        }

        \add_menu_page(
            'AetherDigital Suite',
            'AetherDigital',
            'manage_options',
            'aether-digital-suite',
            [self::class, 'render_overview_page'],
            'dashicons-layout',
            26
        );

        \add_submenu_page(
            'aether-digital-suite',
            'Contractor Reward Ledger',
            'Reward Ledger',
            'manage_options',
            'aether-reward-ledger',
            [self::class, 'render_ledger_page']
        );
    }

    public static function render_overview_page(): void
    {
        echo '<div class="wrap"><h1>AetherDigital Headless Architecture</h1>';
        echo '<p>Active REST Namespace: <code>/wp-json/aether/v1/</code></p>';
        echo '<ul>';
        echo '<li><code>POST/GET /wp-json/aether/v1/aura-quotes</code></li>';
        echo '<li><code>GET /wp-json/aether/v1/sku-switch</code></li>';
        echo '<li><code>POST/GET /wp-json/aether/v1/volt-claims</code> &amp; <code>POST /wp-json/aether/v1/volt-redeem</code></li>';
        echo '<li><code>POST/GET/DELETE /wp-json/aether/v1/chronos-entries</code></li>';
        echo '</ul></div>';
    }

    public static function render_ledger_page(): void
    {
        global $wpdb;

        echo '<div class="wrap"><h1>Contractor Reward Ledger</h1>';

        if (!isset($wpdb) || !method_exists($wpdb, 'get_results')) {
            echo '<p>Database handle unavailable.</p></div>';
            return;
        }

        $prefix = isset($wpdb->prefix) ? $wpdb->prefix : 'wp_';
        $table = "{$prefix}aether_reward_ledger";
        $rows = $wpdb->get_results("SELECT * FROM {$table} ORDER BY id DESC LIMIT 50", ARRAY_A);

        echo '<table class="widefat fixed striped"><thead><tr>';
        echo '<th>ID</th><th>Contractor ID</th><th>Type</th><th>Points Delta</th><th>Balance After</th><th>Reference</th><th>Notes</th><th>Created</th>';
        echo '</tr></thead><tbody>';

        if (empty($rows)) {
            echo '<tr><td colspan="8">No ledger entries recorded yet.</td></tr>';
        } else {
            foreach ($rows as $row) {
                echo '<tr>';
                echo '<td>' . \esc_html((string) ($row['id'] ?? '')) . '</td>';
                echo '<td>' . \esc_html((string) ($row['contractor_id'] ?? '')) . '</td>';
                echo '<td>' . \esc_html((string) ($row['transaction_type'] ?? '')) . '</td>';
                echo '<td>' . \esc_html(number_format(intval($row['points_delta'] ?? 0))) . '</td>';
                echo '<td>' . \esc_html(number_format(intval($row['balance_after'] ?? 0))) . '</td>';
                echo '<td>' . \esc_html((string) ($row['reference_type'] ?? '')) . ': ' . \esc_html((string) ($row['reference_id'] ?? '')) . '</td>';
                echo '<td>' . \esc_html((string) ($row['notes'] ?? '')) . '</td>';
                echo '<td>' . \esc_html((string) ($row['created_at'] ?? '')) . '</td>';
                echo '</tr>';
            }
        }

        echo '</tbody></table></div>';
    }
}
