<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!defined('ABSPATH')) {
    exit;
}

class SkuSwitchController extends \WP_REST_Controller
{
    protected $namespace = 'aether/v1';
    protected $rest_base = 'sku-switch';

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

    public function search_skus($request)
    {
        global $wpdb;

        $query = '';
        $brand = '';
        $category = '';

        if (is_object($request) && method_exists($request, 'get_param')) {
            $query = \sanitize_text_field((string) ($request->get_param('query') ?? ''));
            $brand = strtoupper(\sanitize_text_field((string) ($request->get_param('brand') ?? '')));
            $category = strtoupper(\sanitize_text_field((string) ($request->get_param('category') ?? '')));
        }

        if (!isset($wpdb) || !method_exists($wpdb, 'get_results')) {
            return new \WP_REST_Response(['success' => true, 'count' => 0, 'results' => []], 200);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_sku_crossref";

        $clauses = ['1 = 1'];
        $params = [];

        if ($query !== '') {
            $like = '%' . $wpdb->esc_like($query) . '%';
            $clauses[] = '(competitor_sku LIKE %s OR competitor_name LIKE %s OR aether_sku LIKE %s)';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($brand !== '' && $brand !== 'ALL') {
            $clauses[] = 'competitor_brand = %s';
            $params[] = $brand;
        }

        if ($category !== '' && $category !== 'ALL') {
            $clauses[] = 'category = %s';
            $params[] = $category;
        }

        $sql = "SELECT * FROM {$table} WHERE " . implode(' AND ', $clauses) . ' ORDER BY id ASC LIMIT 50';
        $prepared = !empty($params) ? $wpdb->prepare($sql, ...$params) : $sql;
        $results = $wpdb->get_results($prepared, ARRAY_A);

        return new \WP_REST_Response([
            'success' => true,
            'count'   => count($results),
            'results' => $results,
        ], 200);
    }
}
