<?php

declare(strict_types=1);

namespace AetherDigital\WP\Database;

if (!defined('ABSPATH')) {
    // Stubs for offline linting and unit testing outside WordPress
}

class SchemaInstaller
{
    public static function install(): void
    {
        global $wpdb;

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
            PRIMARY KEY (id),
            KEY contractor_idx (contractor_id),
            KEY reference_idx (reference_type, reference_id)
        ) {$charset_collate};";

        $sql_sku_crossref = "CREATE TABLE {$table_sku_crossref} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            competitor_brand VARCHAR(50) NOT NULL,
            competitor_sku VARCHAR(100) NOT NULL,
            competitor_name VARCHAR(255) NOT NULL,
            aether_sku VARCHAR(100) NOT NULL,
            wattage_delta_percent DECIMAL(5,2) NOT NULL,
            lumen_delta_percent DECIMAL(5,2) NOT NULL,
            efficacy_delta_percent DECIMAL(5,2) NOT NULL,
            compliance_notes VARCHAR(255) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY comp_sku_unique (competitor_brand, competitor_sku),
            KEY aether_sku_idx (aether_sku)
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
            PRIMARY KEY (id),
            KEY user_idx (user_id),
            KEY project_idx (project_id),
            KEY date_idx (started_at)
        ) {$charset_collate};";

        if (function_exists('dbDelta')) {
            \dbDelta($sql_reward_ledger);
            \dbDelta($sql_sku_crossref);
            \dbDelta($sql_chronos_timesheets);
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
