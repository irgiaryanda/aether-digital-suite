<?php

declare(strict_types=1);

namespace AetherDigital\WP\WooCommerce;

if (!defined('ABSPATH')) {
    // Stub
}

class LoyaltyOrderHook
{
    public static function handle_completed_order(int $order_id): void
    {
        global $wpdb;

        if (!function_exists('wc_get_order')) {
            return;
        }

        $order = \wc_get_order($order_id);
        if (!$order) {
            return;
        }

        $customer_id = $order->get_customer_id();
        if ($customer_id === 0) {
            return;
        }

        $tier = (string) $order->get_meta('_contractor_tier');
        if (empty($tier)) {
            $tier = 'BRONZE';
        }

        $subtotal = floatval($order->get_subtotal());
        if ($subtotal <= 0.0) {
            return;
        }

        $multipliers = [
            'BRONZE'   => 1.0,
            'SILVER'   => 1.25,
            'GOLD'     => 1.5,
            'PLATINUM' => 2.0,
        ];
        $multiplier = $multipliers[$tier] ?? 1.0;
        $points_awarded = intval(floor($subtotal * $multiplier));

        if ($points_awarded <= 0) {
            return;
        }

        $prefix = isset($wpdb->prefix) ? $wpdb->prefix : 'wp_';
        $table = "{$prefix}aether_reward_ledger";

        if (isset($wpdb) && method_exists($wpdb, 'insert')) {
            // Deduplication check
            $existing = $wpdb->get_var($wpdb->prepare(
                "SELECT id FROM {$table} WHERE reference_type = %s AND reference_id = %s LIMIT 1",
                'WOOCOMMERCE_ORDER',
                (string) $order_id
            ));

            if ($existing) {
                return;
            }

            $current_balance = intval($wpdb->get_var($wpdb->prepare(
                "SELECT balance_after FROM {$table} WHERE contractor_id = %d ORDER BY id DESC LIMIT 1",
                $customer_id
            )));

            $new_balance = $current_balance + $points_awarded;

            $wpdb->insert($table, [
                'contractor_id'    => $customer_id,
                'transaction_type' => 'CREDIT',
                'points_delta'     => $points_awarded,
                'balance_after'    => $new_balance,
                'reference_type'   => 'WOOCOMMERCE_ORDER',
                'reference_id'     => (string) $order_id,
                'notes'            => sprintf('Order #%d points accrual ($%.2f ex-GST at %s multiplier)', $order_id, $subtotal, $tier),
                'created_at'       => function_exists('current_time') ? \current_time('mysql') : date('Y-m-d H:i:s'),
            ]);

            $order->update_meta_data('_aether_points_awarded', $points_awarded);
            $order->save();
        }
    }
}
