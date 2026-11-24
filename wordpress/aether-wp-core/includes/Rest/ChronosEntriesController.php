<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!defined('ABSPATH')) {
    exit;
}

class ChronosEntriesController extends \WP_REST_Controller
{
    protected $namespace = 'aether/v1';
    protected $rest_base = 'chronos-entries';

    private const ALLOWED_PHASES = [
        'DISCOVERY_UX',
        'CUSTOM_WP_THEME',
        'WOOCOMMERCE_PLUGIN',
        'QA_STAGING',
        'DEPLOYMENT_MAINTENANCE',
    ];

    public function register_routes(): void
    {
        if (!function_exists('register_rest_route')) {
            return;
        }

        \register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'create_entry'],
                'permission_callback' => [$this, 'check_agency_permissions'],
            ],
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_entries'],
                'permission_callback' => [$this, 'check_agency_permissions'],
            ],
        ]);

        \register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>\d+)', [
            [
                'methods'             => 'DELETE',
                'callback'            => [$this, 'delete_entry'],
                'permission_callback' => [$this, 'check_agency_permissions'],
            ],
        ]);
    }

    public function check_agency_permissions($request)
    {
        if (!function_exists('is_user_logged_in') || !\is_user_logged_in()) {
            return new \WP_Error('rest_forbidden', 'Agency authentication required.', ['status' => 403]);
        }

        if (function_exists('current_user_can') && (\current_user_can('agency_pm') || \current_user_can('senior_wp_dev') || \current_user_can('manage_options'))) {
            return true;
        }

        return new \WP_Error('rest_forbidden', 'Agency PM or Senior WP Dev capability required.', ['status' => 403]);
    }

    public function create_entry($request)
    {
        global $wpdb;

        $params = is_object($request) && method_exists($request, 'get_json_params')
            ? ($request->get_json_params() ?? [])
            : (array) $request;

        $project_id = intval($params['project_id'] ?? 1);
        $task_desc = \sanitize_textarea_field((string) ($params['task_description'] ?? 'Agency Development Task'));
        $phase = strtoupper(\sanitize_text_field((string) ($params['phase_category'] ?? 'CUSTOM_WP_THEME')));
        $is_billable = !empty($params['is_billable']) ? 1 : 0;
        $hourly_rate = floatval($params['hourly_rate_aud'] ?? 185.0);
        $duration_seconds = intval($params['duration_seconds'] ?? 0);
        $started_at = \sanitize_text_field((string) ($params['started_at'] ?? date('Y-m-d H:i:s')));
        $ended_at = \sanitize_text_field((string) ($params['ended_at'] ?? date('Y-m-d H:i:s')));

        if (!in_array($phase, self::ALLOWED_PHASES, true)) {
            return new \WP_Error('invalid_phase', 'Unsupported agency project phase_category.', ['status' => 400]);
        }

        if ($duration_seconds < 5) {
            return new \WP_Error('invalid_duration', 'Timesheet duration_seconds must be at least 5 seconds.', ['status' => 400]);
        }

        $user_id = function_exists('get_current_user_id') ? \get_current_user_id() : 0;
        if ($user_id <= 0) {
            return new \WP_Error('rest_forbidden', 'Authenticated agency user required.', ['status' => 403]);
        }

        if (!isset($wpdb) || !method_exists($wpdb, 'insert')) {
            return new \WP_Error('db_unavailable', 'WordPress database connection unavailable.', ['status' => 500]);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_chronos_timesheets";

        $inserted = $wpdb->insert($table, [
            'user_id'          => $user_id,
            'project_id'       => $project_id,
            'task_description' => $task_desc,
            'phase_category'   => $phase,
            'is_billable'      => $is_billable,
            'hourly_rate_aud'  => $hourly_rate,
            'duration_seconds' => $duration_seconds,
            'started_at'       => $started_at,
            'ended_at'         => $ended_at,
            'created_at'       => function_exists('current_time') ? \current_time('mysql') : date('Y-m-d H:i:s'),
        ]);

        if ($inserted === false) {
            return new \WP_Error('db_insert_failed', 'Failed to persist timesheet entry.', ['status' => 500]);
        }

        $entry_id = intval($wpdb->insert_id);

        $total_seconds = intval($wpdb->get_var($wpdb->prepare(
            "SELECT SUM(duration_seconds) FROM {$table} WHERE project_id = %d",
            $project_id
        )));
        $logged_hours = round($total_seconds / 3600, 1);

        $budget_hours = 40.0;
        if (function_exists('get_post_meta')) {
            $meta_budget = floatval(\get_post_meta($project_id, '_chronos_budget_hours', true));
            if ($meta_budget > 0) {
                $budget_hours = $meta_budget;
            }
        }

        $burn_percent = round(($logged_hours / max(1.0, $budget_hours)) * 100, 1);
        $status = 'HEALTHY';
        if ($burn_percent > 100.0) {
            $status = 'OVER_BURN';
        } elseif ($burn_percent >= 80.0) {
            $status = 'WARNING';
        }

        return new \WP_REST_Response([
            'success'               => true,
            'entry_id'              => $entry_id,
            'project_id'            => $project_id,
            'phase_category'        => $phase,
            'logged_hours'          => $logged_hours,
            'budget_hours'          => $budget_hours,
            'retainer_burn_percent' => $burn_percent,
            'retainer_status'       => $status,
        ], 201);
    }

    public function get_entries($request)
    {
        global $wpdb;

        if (!isset($wpdb) || !method_exists($wpdb, 'get_results')) {
            return new \WP_REST_Response(['success' => true, 'entries' => [], 'summary' => ['total_seconds' => 0, 'billable_seconds' => 0, 'logged_hours' => 0.0]], 200);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_chronos_timesheets";

        $project_id = 0;
        if (is_object($request) && method_exists($request, 'get_param')) {
            $project_id = intval($request->get_param('project_id') ?? 0);
        }

        if ($project_id > 0) {
            $entries = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table} WHERE project_id = %d ORDER BY id DESC LIMIT 100",
                $project_id
            ), ARRAY_A);
        } else {
            $entries = $wpdb->get_results("SELECT * FROM {$table} ORDER BY id DESC LIMIT 100", ARRAY_A);
        }

        $total_seconds = 0;
        $billable_seconds = 0;
        foreach ($entries as $entry) {
            $secs = intval($entry['duration_seconds'] ?? 0);
            $total_seconds += $secs;
            if (!empty($entry['is_billable'])) {
                $billable_seconds += $secs;
            }
        }

        return new \WP_REST_Response([
            'success' => true,
            'entries' => $entries,
            'summary' => [
                'total_seconds'    => $total_seconds,
                'billable_seconds' => $billable_seconds,
                'logged_hours'     => round($total_seconds / 3600, 1),
            ],
        ], 200);
    }

    public function delete_entry($request)
    {
        global $wpdb;

        $entry_id = 0;
        if (is_object($request) && method_exists($request, 'get_param')) {
            $entry_id = intval($request->get_param('id') ?? 0);
        }

        if ($entry_id <= 0) {
            return new \WP_Error('invalid_entry_id', 'Valid numeric entry ID required.', ['status' => 400]);
        }

        if (!isset($wpdb) || !method_exists($wpdb, 'delete')) {
            return new \WP_Error('db_unavailable', 'WordPress database connection unavailable.', ['status' => 500]);
        }

        $prefix = $wpdb->prefix;
        $table = "{$prefix}aether_chronos_timesheets";
        $deleted = $wpdb->delete($table, ['id' => $entry_id], ['%d']);

        if (!$deleted) {
            return new \WP_Error('entry_not_found', 'Timesheet entry not found.', ['status' => 404]);
        }

        return new \WP_REST_Response([
            'success'  => true,
            'deleted'  => true,
            'entry_id' => $entry_id,
        ], 200);
    }
}
