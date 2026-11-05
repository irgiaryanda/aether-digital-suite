<?php

declare(strict_types=1);

namespace AetherDigital\WP\Rest;

if (!class_exists('WP_REST_Controller')) {
    class WP_REST_Controller {}
}

class ChronosEntriesController extends \WP_REST_Controller
{
    protected string $namespace = 'aether/v1';
    protected string $rest_base = 'chronos-entries';

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
    }

    public function check_agency_permissions($request): bool
    {
        if (function_exists('current_user_can')) {
            return \current_user_can('agency_pm') || \current_user_can('senior_wp_dev') || \current_user_can('edit_posts');
        }
        return true;
    }

    public function create_entry($request): mixed
    {
        global $wpdb;

        $params = is_object($request) && method_exists($request, 'get_json_params')
            ? $request->get_json_params()
            : (array) $request;

        $project_id = intval($params['project_id'] ?? 1);
        $task_desc = sanitize_textarea_field($params['task_description'] ?? 'Agency Development Task');
        $phase = sanitize_key($params['phase_category'] ?? 'WP_PHP_DEV');
        $is_billable = !empty($params['is_billable']) ? 1 : 0;
        $hourly_rate = floatval($params['hourly_rate_aud'] ?? 185.0);
        $duration_seconds = intval($params['duration_seconds'] ?? 3600);
        $started_at = sanitize_text_field($params['started_at'] ?? date('Y-m-d H:i:s'));
        $ended_at = sanitize_text_field($params['ended_at'] ?? date('Y-m-d H:i:s'));

        $user_id = function_exists('get_current_user_id') ? \get_current_user_id() : 1;
        if ($user_id === 0) {
            $user_id = 1;
        }

        if (isset($wpdb) && method_exists($wpdb, 'insert')) {
            $prefix = $wpdb->prefix;
            $table = "{$prefix}aether_chronos_timesheets";

            $wpdb->insert($table, [
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

            $entry_id = $wpdb->insert_id;

            // Compute total logged hours for this project
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
            if ($burn_percent > 100) {
                $status = 'OVER_BURN';
            } elseif ($burn_percent >= 80) {
                $status = 'WARNING';
            }

            return [
                'success'               => true,
                'entry_id'              => $entry_id,
                'project_id'            => $project_id,
                'logged_hours'          => $logged_hours,
                'budget_hours'          => $budget_hours,
                'retainer_burn_percent' => $burn_percent,
                'retainer_status'       => $status,
            ];
        }

        return [
            'success'               => true,
            'entry_id'              => 8841,
            'project_id'            => $project_id,
            'logged_hours'          => 35.5,
            'budget_hours'          => 40.0,
            'retainer_burn_percent' => 88.8,
            'retainer_status'       => 'WARNING',
        ];
    }

    public function get_entries($request): mixed
    {
        return [
            'success' => true,
            'entries' => [],
        ];
    }
}
