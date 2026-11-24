<?php

declare(strict_types=1);

namespace AetherDigital\WP\Auth;

if (!defined('ABSPATH')) {
    exit;
}

class RolesManager
{
    public static function register_roles(): void
    {
        if (!function_exists('add_role') || !function_exists('get_role')) {
            return;
        }

        $agencyPmCaps = [
            'read'                      => true,
            'edit_posts'                => true,
            'agency_pm'                 => true,
            'senior_wp_dev'             => true,
            'edit_chronos_projects'     => true,
            'publish_chronos_projects'  => true,
            'manage_aether_retainers'   => true,
            'log_chronos_timesheets'    => true,
        ];
        self::sync_role('agency_pm', 'Agency Project Manager', $agencyPmCaps);

        $seniorDevCaps = [
            'read'                   => true,
            'edit_posts'             => true,
            'senior_wp_dev'          => true,
            'log_chronos_timesheets' => true,
        ];
        self::sync_role('senior_wp_dev', 'Senior WordPress Developer', $seniorDevCaps);

        $contractorCaps = [
            'read'                => true,
            'trade_contractor'    => true,
            'submit_volt_claims'  => true,
            'redeem_volt_rewards' => true,
        ];
        self::sync_role('trade_contractor', 'Trade Electrical Contractor', $contractorCaps);

        $admin = \get_role('administrator');
        if ($admin) {
            $allCustomCaps = [
                'agency_pm',
                'senior_wp_dev',
                'trade_contractor',
                'edit_chronos_projects',
                'publish_chronos_projects',
                'manage_aether_retainers',
                'log_chronos_timesheets',
                'submit_volt_claims',
                'redeem_volt_rewards',
            ];
            foreach ($allCustomCaps as $cap) {
                $admin->add_cap($cap);
            }
        }
    }

    private static function sync_role(string $slug, string $displayName, array $caps): void
    {
        $existing = \get_role($slug);
        if (!$existing) {
            \add_role($slug, $displayName, $caps);
            return;
        }

        foreach ($caps as $cap => $grant) {
            if ($grant) {
                $existing->add_cap($cap);
            }
        }
    }
}
