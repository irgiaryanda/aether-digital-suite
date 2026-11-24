<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!defined('ABSPATH')) {
    exit;
}

class VoltClaimsController extends \WP_REST_Controller
{
    protected $namespace = 'aether/v1';
    protected $rest_base = 'volt-claims';

    private const TIER_MULTIPLIERS = [
        'BRONZE'   => 1.0,
        'SILVER'   => 1.25,
        'GOLD'     => 1.5,
        'PLATINUM' => 2.0,
    ];

    public function register_routes(): void
    {
        if (!function_exists('register_rest_route')) {
            return;
        }

        \register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'submit_claim'],
                'permission_callback' => [$this, 'claim_permissions_check'],
            ],
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_claims_history'],
                'permission_callback' => [$this, 'claim_permissions_check'],
            ],
        ]);

        \register_rest_route($this->namespace, '/volt-redeem', [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'redeem_reward'],
                'permission_callback' => [$this, 'claim_permissions_check'],
            ],
        ]);
    }

    public function claim_permissions_check($request)
    {
        if (!function_exists('is_user_logged_in') || !\is_user_logged_in()) {
            return new \WP_Error('rest_forbidden', 'Contractor authentication required.', ['status' => 403]);
        }

        if (function_exists('current_user_can') && (\current_user_can('trade_contractor') || \current_user_can('manage_options'))) {
            return true;
        }

        return new \WP_Error('rest_forbidden', 'Contractor role capability required.', ['status' => 403]);
    }

    public static function validate_ato_abn(string $abn_raw): bool
    {
        $digits = preg_replace('/\D/', '', $abn_raw) ?? '';
        if (strlen($digits) !== 11) {
            return false;
        }

        $weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        $first_digit_adjusted = intval($digits[0]) - 1;
        $sum = $first_digit_adjusted * $weights[0];

        for ($i = 1; $i < 11; $i++) {
            $sum += intval($digits[$i]) * $weights[$i];
        }

        return ($sum % 89 === 0);
    }

    public static function resolve_tier_from_spend(float $annual_spend_aud): string
    {
        if ($annual_spend_aud >= 50000.0) {
            return 'PLATINUM';
        }
        if ($annual_spend_aud >= 25000.0) {
            return 'GOLD';
        }
        if ($annual_spend_aud >= 10000.0) {
            return 'SILVER';
        }
        return 'BRONZE';
    }

    public function submit_claim($request)
    {
        global $wpdb;

        $params = is_object($request) && method_exists($request, 'get_json_params')
            ? ($request->get_json_params() ?? [])
            : (array) $request;

        $invoice_number = \sanitize_text_field((string) ($params['invoice_number'] ?? ''));
        $wholesaler = \sanitize_text_field((string) ($params['wholesaler'] ?? ''));
        $wholesaler_abn = \sanitize_text_field((string) ($params['wholesaler_abn'] ?? ''));
        $subtotal_ex_gst = floatval($params['subtotal_ex_gst_aud'] ?? 0.0);

        if ($invoice_number === '' || $subtotal_ex_gst <= 0.0) {
            return new \WP_Error('invalid_claim_payload', 'Invoice number and positive subtotal are required.', ['status' => 400]);
        }

        if (!self::validate_ato_abn($wholesaler_abn)) {
            return new \WP_Error('invalid_abn', 'Wholesaler ABN failed ATO Modulus 89 validation.', ['status' => 400]);
        }

        $contractor_id = function_exists('get_current_user_id') ? \get_current_user_id() : 0;
        if ($contractor_id <= 0) {
            return new \WP_Error('rest_forbidden', 'Authenticated contractor ID required.', ['status' => 403]);
        }

        $current_spend = function_exists('get_user_meta')
            ? floatval(\get_user_meta($contractor_id, '_aether_annual_spend_aud', true))
            : 0.0;
        $tier = self::resolve_tier_from_spend($current_spend);
        $multiplier = self::TIER_MULTIPLIERS[$tier] ?? 1.0;

        $base_points = max(0, intval(floor($subtotal_ex_gst)));
        $awarded_points = intval(floor($base_points * $multiplier));

        if (!isset($wpdb) || !method_exists($wpdb, 'insert')) {
            return new \WP_Error('db_unavailable', 'WordPress database connection unavailable.', ['status' => 500]);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_reward_ledger";

        $wpdb->query('START TRANSACTION');

        $existing = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table} WHERE reference_type = %s AND reference_id = %s LIMIT 1",
            'INVOICE_CLAIM',
            $invoice_number
        ));

        if ($existing) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('duplicate_invoice', 'Invoice number already claimed.', ['status' => 409]);
        }

        $current_balance = intval($wpdb->get_var($wpdb->prepare(
            "SELECT balance_after FROM {$table} WHERE contractor_id = %d ORDER BY id DESC LIMIT 1 FOR UPDATE",
            $contractor_id
        )));

        $new_balance = $current_balance + $awarded_points;
        $inserted = $wpdb->insert($table, [
            'contractor_id'    => $contractor_id,
            'transaction_type' => 'CREDIT',
            'points_delta'     => $awarded_points,
            'balance_after'    => $new_balance,
            'reference_type'   => 'INVOICE_CLAIM',
            'reference_id'     => $invoice_number,
            'notes'            => sprintf('Claimed invoice %s from %s ($%.2f ex-GST, %s Tier)', $invoice_number, $wholesaler, $subtotal_ex_gst, $tier),
            'created_at'       => function_exists('current_time') ? \current_time('mysql') : date('Y-m-d H:i:s'),
        ]);

        if ($inserted === false) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('ledger_write_failed', 'Failed to persist reward ledger credit.', ['status' => 500]);
        }

        $wpdb->query('COMMIT');

        $updated_spend = round($current_spend + $subtotal_ex_gst, 2);
        $updated_tier = self::resolve_tier_from_spend($updated_spend);
        if (function_exists('update_user_meta')) {
            \update_user_meta($contractor_id, '_aether_annual_spend_aud', $updated_spend);
            \update_user_meta($contractor_id, '_aether_contractor_tier', $updated_tier);
        }

        $claim_id = sprintf('CLAIM-%s-%04d', date('Y'), intval($wpdb->insert_id));

        return new \WP_REST_Response([
            'success'          => true,
            'claim_id'         => $claim_id,
            'invoice_number'   => $invoice_number,
            'awarded_points'   => $awarded_points,
            'new_balance'      => $new_balance,
            'tier'             => $updated_tier,
            'tier_at_claim'    => $tier,
            'annual_spend_aud' => $updated_spend,
        ], 201);
    }

    public function redeem_reward($request)
    {
        global $wpdb;

        $params = is_object($request) && method_exists($request, 'get_json_params')
            ? ($request->get_json_params() ?? [])
            : (array) $request;

        $points_cost = intval($params['points_cost'] ?? 0);
        $reward_title = \sanitize_text_field((string) ($params['reward_title'] ?? ''));
        $reward_sku = \sanitize_text_field((string) ($params['reward_sku'] ?? 'REWARD'));

        if ($points_cost <= 0 || $reward_title === '') {
            return new \WP_Error('invalid_redemption', 'Reward title and positive points_cost are required.', ['status' => 400]);
        }

        $contractor_id = function_exists('get_current_user_id') ? \get_current_user_id() : 0;
        if ($contractor_id <= 0) {
            return new \WP_Error('rest_forbidden', 'Authenticated contractor ID required.', ['status' => 403]);
        }

        if (!isset($wpdb) || !method_exists($wpdb, 'insert')) {
            return new \WP_Error('db_unavailable', 'WordPress database connection unavailable.', ['status' => 500]);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_reward_ledger";

        $wpdb->query('START TRANSACTION');

        $current_balance = intval($wpdb->get_var($wpdb->prepare(
            "SELECT balance_after FROM {$table} WHERE contractor_id = %d ORDER BY id DESC LIMIT 1 FOR UPDATE",
            $contractor_id
        )));

        if ($current_balance < $points_cost) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('insufficient_points', 'Contractor points balance is insufficient for redemption.', ['status' => 400]);
        }

        $new_balance = $current_balance - $points_cost;
        $voucher_code = sprintf('VCH-%s-%04d', strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $reward_sku) ?: 'RWD', 0, 4)), random_int(1000, 9999));

        $inserted = $wpdb->insert($table, [
            'contractor_id'    => $contractor_id,
            'transaction_type' => 'DEBIT',
            'points_delta'     => -$points_cost,
            'balance_after'    => $new_balance,
            'reference_type'   => 'REWARD_REDEMPTION',
            'reference_id'     => $voucher_code,
            'notes'            => sprintf('Redeemed %s (%s)', $reward_title, $reward_sku),
            'created_at'       => function_exists('current_time') ? \current_time('mysql') : date('Y-m-d H:i:s'),
        ]);

        if ($inserted === false) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('ledger_write_failed', 'Failed to persist reward redemption debit.', ['status' => 500]);
        }

        $wpdb->query('COMMIT');

        return new \WP_REST_Response([
            'success'      => true,
            'voucher_code' => $voucher_code,
            'points_spent' => $points_cost,
            'new_balance'  => $new_balance,
        ], 201);
    }

    public function get_claims_history($request)
    {
        global $wpdb;

        $contractor_id = function_exists('get_current_user_id') ? \get_current_user_id() : 0;
        if (!isset($wpdb) || !method_exists($wpdb, 'get_results')) {
            return new \WP_REST_Response(['success' => true, 'balance' => 0, 'tier' => 'BRONZE', 'entries' => []], 200);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_reward_ledger";

        $entries = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table} WHERE contractor_id = %d ORDER BY id DESC LIMIT 100",
            $contractor_id
        ), ARRAY_A);

        $balance = !empty($entries) ? intval($entries[0]['balance_after']) : 0;
        $annual_spend = function_exists('get_user_meta')
            ? floatval(\get_user_meta($contractor_id, '_aether_annual_spend_aud', true))
            : 0.0;
        $tier = self::resolve_tier_from_spend($annual_spend);

        return new \WP_REST_Response([
            'success'          => true,
            'contractor_id'    => $contractor_id,
            'balance'          => $balance,
            'tier'             => $tier,
            'annual_spend_aud' => $annual_spend,
            'entries'          => $entries,
        ], 200);
    }
}
