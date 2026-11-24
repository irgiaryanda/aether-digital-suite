<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!defined('ABSPATH')) {
    exit;
}

class AuraQuotesController extends \WP_REST_Controller
{
    protected $namespace = 'aether/v1';
    protected $rest_base = 'aura-quotes';

    private const ALLOWED_PRODUCT_TYPES = ['GARAGE_DOOR', 'LUXURY_POOL'];

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

    public function get_item_schema(): array
    {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'aura_quote',
            'type'       => 'object',
            'properties' => [
                'customer_name'             => ['type' => 'string', 'required' => false],
                'email'                     => ['type' => 'string', 'format' => 'email', 'required' => false],
                'phone'                     => ['type' => 'string', 'required' => false],
                'postcode'                  => ['type' => 'string', 'required' => true],
                'product_type'              => ['type' => 'string', 'enum' => self::ALLOWED_PRODUCT_TYPES, 'required' => true],
                'installation_access_notes' => ['type' => 'string', 'required' => false],
                'engineering_summary'       => ['type' => 'object', 'required' => false],
                'bom'                       => ['type' => 'object', 'required' => false],
            ],
        ];
    }

    public function create_quote_permissions_check($request): bool
    {
        return true;
    }

    public function get_quotes_permissions_check($request)
    {
        if (function_exists('current_user_can')) {
            if (!\current_user_can('edit_posts')) {
                return new \WP_Error('rest_forbidden', 'Insufficient permissions to inspect architectural quotes.', ['status' => 403]);
            }
            return true;
        }
        return false;
    }

    public function create_quote($request)
    {
        $params = is_object($request) && method_exists($request, 'get_json_params')
            ? ($request->get_json_params() ?? [])
            : (array) $request;

        $customer_name = \sanitize_text_field((string) ($params['customer_name'] ?? 'Private Client'));
        $email_raw = trim((string) ($params['email'] ?? ''));
        $email = \sanitize_email($email_raw);
        $phone = \sanitize_text_field((string) ($params['phone'] ?? ''));
        $postcode = \sanitize_text_field((string) ($params['postcode'] ?? '2000'));
        $product_type = strtoupper(\sanitize_text_field((string) ($params['product_type'] ?? 'GARAGE_DOOR')));
        $notes = \sanitize_textarea_field((string) ($params['installation_access_notes'] ?? ''));

        if (!in_array($product_type, self::ALLOWED_PRODUCT_TYPES, true)) {
            return new \WP_Error('invalid_quote_payload', 'Unsupported product_type value.', ['status' => 400]);
        }

        if (!preg_match('/^\d{4}$/', $postcode)) {
            return new \WP_Error('invalid_quote_payload', 'Australian postcode must be exactly 4 digits.', ['status' => 400]);
        }

        if ($email_raw !== '' && function_exists('is_email') && !\is_email($email_raw)) {
            return new \WP_Error('invalid_quote_payload', 'Invalid customer email format.', ['status' => 400]);
        }

        $engineering = $params['engineering_summary'] ?? [];
        $bom = $params['bom'] ?? [];
        $total_aud = floatval($bom['total_inc_gst_aud'] ?? ($bom['totalIncGstAud'] ?? 0.0));

        if (function_exists('wp_insert_post')) {
            $post_id = \wp_insert_post([
                'post_type'   => 'aura_quote',
                'post_title'  => sprintf('%s - %s (%s)', $customer_name, $postcode, $product_type),
                'post_status' => 'publish',
            ]);

            if (\is_wp_error($post_id)) {
                return $post_id;
            }

            \update_post_meta($post_id, '_aura_email', $email);
            \update_post_meta($post_id, '_aura_phone', $phone);
            \update_post_meta($post_id, '_aura_postcode', $postcode);
            \update_post_meta($post_id, '_aura_product_type', $product_type);
            \update_post_meta($post_id, '_aura_engineering', \wp_json_encode($engineering));
            \update_post_meta($post_id, '_aura_bom', \wp_json_encode($bom));
            \update_post_meta($post_id, '_aura_total_aud', $total_aud);
            \update_post_meta($post_id, '_aura_notes', $notes);
            \update_post_meta($post_id, '_aura_status', 'PENDING_SITE_MEASURE');

            $reference = sprintf('AURA-%s-%04d', substr($product_type, 0, 4), $post_id);

            return new \WP_REST_Response([
                'success'         => true,
                'quote_id'        => $post_id,
                'quote_reference' => $reference,
                'product_type'    => $product_type,
                'total_aud'       => $total_aud,
                'status'          => 'PENDING_SITE_MEASURE',
            ], 201);
        }

        return new \WP_Error('wp_unavailable', 'WordPress post storage is unavailable.', ['status' => 500]);
    }

    public function get_quotes($request)
    {
        if (!class_exists('WP_Query')) {
            return new \WP_REST_Response(['success' => true, 'quotes' => []], 200);
        }

        $per_page_param = is_object($request) && method_exists($request, 'get_param')
            ? $request->get_param('per_page')
            : 20;
        $per_page = min(50, max(1, intval($per_page_param ?: 20)));

        $query = new \WP_Query([
            'post_type'      => 'aura_quote',
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'orderby'        => 'ID',
            'order'          => 'DESC',
        ]);

        $quotes = [];
        foreach ($query->posts as $post) {
            $post_id = intval($post->ID);
            $product_type = (string) \get_post_meta($post_id, '_aura_product_type', true);
            $engineering_raw = (string) \get_post_meta($post_id, '_aura_engineering', true);
            $bom_raw = (string) \get_post_meta($post_id, '_aura_bom', true);

            $quotes[] = [
                'quote_id'                  => $post_id,
                'quote_reference'           => sprintf('AURA-%s-%04d', substr($product_type ?: 'GARA', 0, 4), $post_id),
                'title'                     => $post->post_title,
                'email'                     => (string) \get_post_meta($post_id, '_aura_email', true),
                'phone'                     => (string) \get_post_meta($post_id, '_aura_phone', true),
                'postcode'                  => (string) \get_post_meta($post_id, '_aura_postcode', true),
                'product_type'              => $product_type,
                'total_aud'                 => floatval(\get_post_meta($post_id, '_aura_total_aud', true)),
                'status'                    => (string) \get_post_meta($post_id, '_aura_status', true),
                'installation_access_notes' => (string) \get_post_meta($post_id, '_aura_notes', true),
                'engineering_summary'       => json_decode($engineering_raw, true) ?: [],
                'bom'                       => json_decode($bom_raw, true) ?: [],
            ];
        }

        return new \WP_REST_Response([
            'success' => true,
            'count'   => count($quotes),
            'quotes'  => $quotes,
        ], 200);
    }
}
