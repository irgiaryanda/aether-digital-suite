<?php
/**
 * Plugin Name: AetherDigital Headless Suite & WooCommerce Bridge
 * Plugin URI: https://github.com/irgiaryanda/aether-digital-suite
 * Description: Production-grade headless WordPress architecture, custom database schemas, and WooCommerce trade loyalty bridge.
 * Version: 1.0.0
 * Author: Irgi Aryanda
 * Author URI: https://github.com/irgiaryanda
 * Text Domain: aether-wp-core
 * Requires at least: 6.2
 * Requires PHP: 8.2
 * WC tested up to: 9.3
 * License: GPL-2.0-or-later
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('AETHER_WP_CORE_VERSION', '1.0.0');
define('AETHER_WP_CORE_FILE', __FILE__);
define('AETHER_WP_CORE_PATH', plugin_dir_path(__FILE__));
define('AETHER_WP_CORE_URL', plugin_dir_url(__FILE__));

// Require Core Classes
require_once AETHER_WP_CORE_PATH . 'includes/Database/SchemaInstaller.php';
require_once AETHER_WP_CORE_PATH . 'includes/PostTypes/CustomPostTypes.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/AuraQuotesController.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/VoltClaimsController.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/SkuSwitchController.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/ChronosEntriesController.php';
require_once AETHER_WP_CORE_PATH . 'includes/WooCommerce/LoyaltyOrderHook.php';

// Activation Hook: Database Schema Installation
register_activation_hook(__FILE__, static function (): void {
    \AetherDigital\WP\Database\SchemaInstaller::install();
    \AetherDigital\WP\PostTypes\CustomPostTypes::register();
    flush_rewrite_rules();
});

// Deactivation Hook
register_deactivation_hook(__FILE__, static function (): void {
    flush_rewrite_rules();
});

// Initialize Custom Post Types & Taxonomies
add_action('init', static function (): void {
    \AetherDigital\WP\PostTypes\CustomPostTypes::register();
});

// Initialize REST API Routes
add_action('rest_api_init', static function (): void {
    (new \AetherDigital\WP\Rest\AuraQuotesController())->register_routes();
    (new \AetherDigital\WP\Rest\VoltClaimsController())->register_routes();
    (new \AetherDigital\WP\Rest\SkuSwitchController())->register_routes();
    (new \AetherDigital\WP\Rest\ChronosEntriesController())->register_routes();
});

// Declare WooCommerce High-Performance Order Storage (HPOS) Compatibility
add_action('before_woocommerce_init', static function (): void {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

// Hook into WooCommerce Completed Orders for Contractor Points Accrual
add_action('woocommerce_order_status_completed', static function (int $order_id): void {
    \AetherDigital\WP\WooCommerce\LoyaltyOrderHook::handle_completed_order($order_id);
}, 10, 1);
