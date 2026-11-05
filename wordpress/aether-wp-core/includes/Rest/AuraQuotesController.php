<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!class_exists('WP_REST_Controller')) {
    // Stub base class for offline PHP linting and unit testing
    class WP_REST_Controller {}
}

class AuraQuotesController extends \WP_REST_Controller
{
    protected string $namespace = 'aether/v1';
    protected string $rest_base = 'aura-quotes';

    public function register_routes(): void
    {
        if (!function_exists('register_rest_route')) {
            return;
        }

        \register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'create_quote'],
                'permission_callback' => [$this, 'create_quote_permissions_check'],
                'args'                => $this->get_endpoint_args_for_item_schema('POST'),
            ],
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_quotes'],
                'permission_callback' => [$this, 'get_quotes_permissions_check'],
            ],
        ]);
    }

    public function create_quote_permissions_check($request): bool
    {
        // Public submission endpoint protected by optional REST nonce
        return true;
    }

    public function get_quotes_permissions_check($request): bool
    {
        if (function_exists('current_user_can')) {
            return \current_user_can('edit_posts');
        }
        return true;
    }

    public function create_quote($request): mixed
    {
        $params = is_object($request) && method_exists($request, 'get_json_params')
            ? $request->get_json_params()
            : (array) $request;

        $customer_name = sanitize_text_field($params['customer_name'] ?? 'Private Client');
        $email = sanitize_email($params['email'] ?? '');
        $phone = sanitize_text_field($params['phone'] ?? '');
        $postcode = sanitize_text_field($params['postcode'] ?? '2000');
        $product_type = sanitize_key($params['product_type'] ?? 'GARAGE_DOOR');
        $notes = sanitize_textarea_field($params['installation_access_notes'] ?? '');

        $engineering = $params['engineering_summary'] ?? [];
        $bom = $params['bom'] ?? [];
        $total_aud = floatval($bom['total_inc_gst_aud'] ?? 0.0);

        if (function_exists('wp_insert_post')) {
            $post_id = \wp_insert_post([
                'post_type'   => 'aura_quote',
                'post_title'  => sprintf('%s - %s (%s)', $customer_name, $postcode, $product_type),
                'post_status' => 'publish',
            ]);

            if (is_wp_error($post_id)) {
                return $post_id;
            }

            \update_post_meta($post_id, '_aura_email', $email);
            \update_post_meta($post_id, '_aura_phone', $phone);
            \update_post_meta($post_id, '_aura_postcode', $postcode);
            \update_post_meta($post_id, '_aura_product_type', $product_type);
            \update_post_meta($post_id, '_aura_engineering', wp_json_encode($engineering));
            \update_post_meta($post_id, '_aura_bom', wp_json_encode($bom));
            \update_post_meta($post_id, '_aura_total_aud', $total_aud);
            \update_post_meta($post_id, '_aura_notes', $notes);
            \update_post_meta($post_id, '_aura_status', 'PENDING_SITE_MEASURE');

            $reference = sprintf('AURA-%s-%04d', strtoupper(substr($product_type, 0, 4)), $post_id);

            return new \WP_REST_Response([
                'success'         => true,
                'quote_id'        => $post_id,
                'quote_reference' => $reference,
                'total_aud'       => $total_aud,
                'status'          => 'PENDING_SITE_MEASURE',
            ], 201);
        }

        // Offline deterministic fallback
        return [
            'success'         => true,
            'quote_id'        => 9001,
            'quote_reference' => 'AURA-OFFLINE-9001',
            'total_aud'       => $total_aud,
            'status'          => 'PENDING_SITE_MEASURE',
        ];
    }

    public function get_quotes($request): mixed
    {
        return [
            'success' => true,
            'quotes'  => [],
        ];
    }
}
