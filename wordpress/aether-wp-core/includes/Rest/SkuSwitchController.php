<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!class_exists('WP_REST_Controller')) {
    class WP_REST_Controller {}
}

class SkuSwitchController extends \WP_REST_Controller
{
    protected string $namespace = 'aether/v1';
    protected string $rest_base = 'sku-switch';

    public function register_routes(): void
    {
        if (!function_exists('register_rest_route')) {
            return;
        }

        \register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'search_skus'],
                'permission_callback' => '__return_true',
            ],
        ]);
    }

    public function search_skus($request): mixed
    {
        global $wpdb;

        $query = '';
        if (is_object($request) && method_exists($request, 'get_param')) {
            $query = sanitize_text_field($request->get_param('query') ?? '');
        }

        if (isset($wpdb) && method_exists($wpdb, 'get_results')) {
            $prefix = $wpdb->prefix;
            $table = "{$prefix}aether_sku_crossref";

            if (!empty($query)) {
                $like = '%' . $wpdb->esc_like($query) . '%';
                $results = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM {$table} WHERE competitor_sku LIKE %s OR competitor_name LIKE %s OR aether_sku LIKE %s LIMIT 20",
                    $like,
                    $like,
                    $like
                ), ARRAY_A);
            } else {
                $results = $wpdb->get_results("SELECT * FROM {$table} ORDER BY id ASC LIMIT 25", ARRAY_A);
            }

            return [
                'success' => true,
                'count'   => count($results),
                'results' => $results,
            ];
        }

        return [
            'success' => true,
            'count'   => 0,
            'results' => [],
        ];
    }
}
