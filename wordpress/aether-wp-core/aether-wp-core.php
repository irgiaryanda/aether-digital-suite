<?php
/**
 * Plugin Name: AetherDigital Headless Suite & WooCommerce Bridge
 * Plugin URI: https://github.com/irgiaryanda/aether-digital-suite
 * Description: Production-grade headless WordPress architecture, custom database schemas, Gutenberg embeds, and WooCommerce trade loyalty bridge.
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

require_once AETHER_WP_CORE_PATH . 'includes/Auth/RolesManager.php';
require_once AETHER_WP_CORE_PATH . 'includes/Database/SchemaInstaller.php';
require_once AETHER_WP_CORE_PATH . 'includes/PostTypes/CustomPostTypes.php';
require_once AETHER_WP_CORE_PATH . 'includes/Admin/AdminDashboard.php';
require_once AETHER_WP_CORE_PATH . 'includes/Blocks/EmbedShortcodes.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/AuraQuotesController.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/VoltClaimsController.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/SkuSwitchController.php';
require_once AETHER_WP_CORE_PATH . 'includes/Rest/ChronosEntriesController.php';
require_once AETHER_WP_CORE_PATH . 'includes/WooCommerce/LoyaltyOrderHook.php';

register_activation_hook(__FILE__, static function (): void {
    \AetherDigital\WP\Auth\RolesManager::register_roles();
    \AetherDigital\WP\Database\SchemaInstaller::install();
    \AetherDigital\WP\Database\SchemaInstaller::seed_sku_crossref();
    \AetherDigital\WP\PostTypes\CustomPostTypes::register();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, static function (): void {
    flush_rewrite_rules();
});

add_action('init', static function (): void {
    \AetherDigital\WP\PostTypes\CustomPostTypes::register();
    \AetherDigital\WP\Blocks\EmbedShortcodes::register();
});

add_action('plugins_loaded', static function (): void {
    \AetherDigital\WP\Admin\AdminDashboard::register();
});

add_filter('acf/settings/load_json', static function (array $paths): array {
    $paths[] = AETHER_WP_CORE_PATH . 'acf-json';
    return $paths;
});

add_action('rest_api_init', static function (): void {
    (new \AetherDigital\WP\Rest\AuraQuotesController())->register_routes();
    (new \AetherDigital\WP\Rest\VoltClaimsController())->register_routes();
    (new \AetherDigital\WP\Rest\SkuSwitchController())->register_routes();
    (new \AetherDigital\WP\Rest\ChronosEntriesController())->register_routes();
});

add_action('before_woocommerce_init', static function (): void {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

add_action('woocommerce_order_status_completed', static function (int $order_id): void {
    \AetherDigital\WP\WooCommerce\LoyaltyOrderHook::handle_completed_order($order_id);
}, 10, 1);
