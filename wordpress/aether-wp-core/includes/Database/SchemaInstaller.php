<?php

declare(strict_types=1);

namespace AetherDigital\WP\Database;

if (!defined('ABSPATH')) {
    exit;
}

class SchemaInstaller
{
    public static function install(): void
    {
        global $wpdb;

        if (!function_exists('dbDelta') && defined('ABSPATH') && file_exists(ABSPATH . 'wp-admin/includes/upgrade.php')) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        $charset_collate = '';
        if (isset($wpdb) && method_exists($wpdb, 'get_charset_collate')) {
            $charset_collate = $wpdb->get_charset_collate();
        } else {
            $charset_collate = 'DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
        }

        $prefix = isset($wpdb->prefix) ? $wpdb->prefix : 'wp_';

        $table_reward_ledger = "{$prefix}aether_reward_ledger";
        $table_sku_crossref = "{$prefix}aether_sku_crossref";
        $table_chronos_timesheets = "{$prefix}aether_chronos_timesheets";

        $sql_reward_ledger = "CREATE TABLE {$table_reward_ledger} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            contractor_id BIGINT(20) UNSIGNED NOT NULL,
            transaction_type VARCHAR(20) NOT NULL,
            points_delta INT(11) NOT NULL,
            balance_after INT(11) NOT NULL,
            reference_type VARCHAR(50) NOT NULL,
            reference_id VARCHAR(100) NOT NULL,
            notes TEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY contractor_idx (contractor_id),
            KEY reference_idx (reference_type, reference_id)
        ) {$charset_collate};";

        $sql_sku_crossref = "CREATE TABLE {$table_sku_crossref} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            competitor_brand VARCHAR(50) NOT NULL,
            competitor_sku VARCHAR(100) NOT NULL,
            competitor_name VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL DEFAULT 'HIGHBAY',
            aether_sku VARCHAR(100) NOT NULL,
            wattage_delta_percent DECIMAL(5,2) NOT NULL,
            lumen_delta_percent DECIMAL(5,2) NOT NULL,
            efficacy_delta_percent DECIMAL(5,2) NOT NULL,
            compliance_notes VARCHAR(255) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY comp_sku_unique (competitor_brand, competitor_sku),
            KEY aether_sku_idx (aether_sku),
            KEY category_idx (category)
        ) {$charset_collate};";

        $sql_chronos_timesheets = "CREATE TABLE {$table_chronos_timesheets} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT(20) UNSIGNED NOT NULL,
            project_id BIGINT(20) UNSIGNED NOT NULL,
            task_description TEXT NOT NULL,
            phase_category VARCHAR(50) NOT NULL,
            is_billable TINYINT(1) NOT NULL DEFAULT 1,
            hourly_rate_aud DECIMAL(10,2) NOT NULL,
            duration_seconds INT(11) NOT NULL,
            started_at DATETIME NOT NULL,
            ended_at DATETIME NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY user_idx (user_id),
            KEY project_idx (project_id),
            KEY date_idx (started_at)
        ) {$charset_collate};";

        if (function_exists('dbDelta')) {
            \dbDelta($sql_reward_ledger);
            \dbDelta($sql_sku_crossref);
            \dbDelta($sql_chronos_timesheets);
        }

        if (function_exists('update_option')) {
            $version = defined('AETHER_WP_CORE_VERSION') ? AETHER_WP_CORE_VERSION : '1.0.0';
            \update_option('aether_wp_core_db_version', $version);
        }
    }

    public static function seed_sku_crossref(): void
    {
        global $wpdb;

        if (!isset($wpdb) || !method_exists($wpdb, 'get_var') || !method_exists($wpdb, 'insert')) {
            return;
        }

        $prefix = isset($wpdb->prefix) ? $wpdb->prefix : 'wp_';
        $table = "{$prefix}aether_sku_crossref";

        $count = intval($wpdb->get_var("SELECT COUNT(*) FROM {$table}"));
        if ($count > 0) {
            return;
        }

        $seeds = [
            [
                'competitor_brand'       => 'CLIPSAL',
                'competitor_sku'         => 'TPHB150W',
                'competitor_name'        => 'Clipsal TradePak Highbay 150W',
                'category'               => 'HIGHBAY',
                'aether_sku'             => 'AETH-HB-TITAN-120',
                'wattage_delta_percent'  => -20.00,
                'lumen_delta_percent'    => 12.50,
                'efficacy_delta_percent' => 33.33,
                'compliance_notes'       => 'AS/NZS 60598.2.1',
            ],
            [
                'competitor_brand'       => 'PHILIPS',
                'competitor_sku'         => 'BY239P-200W',
                'competitor_name'        => 'Philips SmartBright Highbay 200W',
                'category'               => 'HIGHBAY',
                'aether_sku'             => 'AETH-HB-TITAN-160',
                'wattage_delta_percent'  => -20.00,
                'lumen_delta_percent'    => 10.00,
                'efficacy_delta_percent' => 28.00,
                'compliance_notes'       => 'AS/NZS 60598.2.1',
            ],
            [
                'competitor_brand'       => 'PIERLITE',
                'competitor_sku'         => 'ECOHB100W',
                'competitor_name'        => 'Pierlite Eco Highbay 100W',
                'category'               => 'HIGHBAY',
                'aether_sku'             => 'AETH-HB-TITAN-080',
                'wattage_delta_percent'  => -20.00,
                'lumen_delta_percent'    => 10.00,
                'efficacy_delta_percent' => 32.00,
                'compliance_notes'       => 'AS/NZS 60598.2.1',
            ],
            [
                'competitor_brand'       => 'OSRAM',
                'competitor_sku'         => 'DP-1200-44W',
                'competitor_name'        => 'Osram Damp Proof Batten 44W',
                'category'               => 'BATTEN',
                'aether_sku'             => 'AETH-BT-WP-36',
                'wattage_delta_percent'  => -18.18,
                'lumen_delta_percent'    => 8.00,
                'efficacy_delta_percent' => 24.50,
                'compliance_notes'       => 'AS/NZS 60598.2.1',
            ],
            [
                'competitor_brand'       => 'THORN',
                'competitor_sku'         => 'CHALICE-36W',
                'competitor_name'        => 'Thorn Recessed Troffer 36W',
                'category'               => 'TROFFER',
                'aether_sku'             => 'AETH-TR-EDGE-28',
                'wattage_delta_percent'  => -22.22,
                'lumen_delta_percent'    => 6.50,
                'efficacy_delta_percent' => 29.00,
                'compliance_notes'       => 'AS/NZS 60598.2.2',
            ],
        ];

        $now = function_exists('current_time') ? \current_time('mysql') : date('Y-m-d H:i:s');
        foreach ($seeds as $row) {
            $row['created_at'] = $now;
            $wpdb->insert($table, $row);
        }
    }

    public static function get_table_names(): array
    {
        return [
            'wp_aether_reward_ledger',
            'wp_aether_sku_crossref',
            'wp_aether_chronos_timesheets',
        ];
    }
}
