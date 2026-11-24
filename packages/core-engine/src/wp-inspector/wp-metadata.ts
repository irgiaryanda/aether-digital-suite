export interface WpInspectorRecord {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  cptOrTable: string;
  phpSourceFile: string;
  phpSnippet: string;
  sqlSchemaSnippet: string;
  sampleRequestPayload: Record<string, unknown>;
  sampleResponsePayload: Record<string, unknown>;
  acfFieldGroupId?: string;
  wpCapabilitiesRequired: string[];
}

export const AURA_WP_METADATA: WpInspectorRecord = {
  endpoint: "/wp-json/aether/v1/aura-quotes",
  method: "POST",
  cptOrTable: "post_type: aura_quote",
  phpSourceFile: "wordpress/aether-wp-core/includes/Rest/AuraQuotesController.php",
  phpSnippet: `public function create_quote($request)
{
    $params = $request->get_json_params() ?? [];
    $postcode = \\sanitize_text_field((string) ($params['postcode'] ?? '2000'));
    $product_type = strtoupper(\\sanitize_text_field((string) ($params['product_type'] ?? 'GARAGE_DOOR')));

    if (!preg_match('/^\\d{4}$/', $postcode)) {
        return new \\WP_Error('invalid_quote_payload', 'Australian postcode must be exactly 4 digits.', ['status' => 400]);
    }

    $post_id = \\wp_insert_post([
        'post_type'   => 'aura_quote',
        'post_title'  => sprintf('%s - %s (%s)', $customer_name, $postcode, $product_type),
        'post_status' => 'publish',
    ]);

    \\update_post_meta($post_id, '_aura_engineering', \\wp_json_encode($engineering));
    \\update_post_meta($post_id, '_aura_total_aud', $total_aud);

    return new \\WP_REST_Response([
        'success'         => true,
        'quote_id'        => $post_id,
        'quote_reference' => sprintf('AURA-%s-%04d', substr($product_type, 0, 4), $post_id),
        'total_aud'       => $total_aud,
        'status'          => 'PENDING_SITE_MEASURE',
    ], 201);
}`,
  sqlSchemaSnippet: `SELECT p.ID, p.post_title, m1.meta_value AS engineering, m2.meta_value AS total_aud
FROM wp_posts p
LEFT JOIN wp_postmeta m1 ON (p.ID = m1.post_id AND m1.meta_key = '_aura_engineering')
LEFT JOIN wp_postmeta m2 ON (p.ID = m2.post_id AND m2.meta_key = '_aura_total_aud')
WHERE p.post_type = 'aura_quote' AND p.post_status = 'publish';`,
  sampleRequestPayload: {
    customer_name: "Julian Vance",
    email: "j.vance@architecturalpartners.com.au",
    site_address: "14 Raglan Street",
    postcode: "2088",
    product_type: "GARAGE_DOOR",
    engineering_summary: {
      wind_region: "A",
      uls_pressure_kpa: 0.92,
      total_mass_kg: 198.4,
      min_torque_nm: 114.4,
    },
    bom: {
      subtotal_ex_gst_aud: 6830.0,
      gst_aud: 683.0,
      total_inc_gst_aud: 7513.0,
    },
  },
  sampleResponsePayload: {
    success: true,
    quote_id: 1042,
    quote_reference: "AURA-GARA-1042",
    product_type: "GARAGE_DOOR",
    total_aud: 7513.0,
    status: "PENDING_SITE_MEASURE",
  },
  acfFieldGroupId: "group_aura_configurator",
  wpCapabilitiesRequired: ["read", "edit_posts"],
};

export const VOLT_WP_METADATA: WpInspectorRecord = {
  endpoint: "/wp-json/aether/v1/volt-claims",
  method: "POST",
  cptOrTable: "table: wp_aether_reward_ledger",
  phpSourceFile: "wordpress/aether-wp-core/includes/Rest/VoltClaimsController.php",
  phpSnippet: `public function submit_claim($request)
{
    global $wpdb;
    $params = $request->get_json_params() ?? [];
    if (!self::validate_ato_abn($wholesaler_abn)) {
        return new \\WP_Error('invalid_abn', 'Wholesaler ABN failed ATO Modulus 89 validation.', ['status' => 400]);
    }

    $current_spend = floatval(\\get_user_meta($contractor_id, '_aether_annual_spend_aud', true));
    $tier = self::resolve_tier_from_spend($current_spend);
    $awarded_points = intval(floor(max(0, intval(floor($subtotal_ex_gst))) * (self::TIER_MULTIPLIERS[$tier] ?? 1.0)));

    $wpdb->query('START TRANSACTION');
    $current_balance = intval($wpdb->get_var($wpdb->prepare(
        "SELECT balance_after FROM {$table} WHERE contractor_id = %d ORDER BY id DESC LIMIT 1 FOR UPDATE",
        $contractor_id
    )));
    $wpdb->insert($table, [
        'contractor_id'    => $contractor_id,
        'transaction_type' => 'CREDIT',
        'points_delta'     => $awarded_points,
        'balance_after'    => $current_balance + $awarded_points,
        'reference_type'   => 'INVOICE_CLAIM',
        'reference_id'     => $invoice_number,
    ]);
    $wpdb->query('COMMIT');
}`,
  sqlSchemaSnippet: `CREATE TABLE wp_aether_reward_ledger (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  sampleRequestPayload: {
    invoice_number: "INV-REX-98124",
    wholesaler: "REXEL_ELECTRICAL",
    wholesaler_abn: "51 824 753 556",
    subtotal_ex_gst_aud: 8333.33,
    tier: "GOLD",
  },
  sampleResponsePayload: {
    success: true,
    claim_id: "CLAIM-2026-0001",
    invoice_number: "INV-REX-98124",
    awarded_points: 12500,
    new_balance: 55300,
    tier: "GOLD",
    annual_spend_aud: 42583.33,
  },
  wpCapabilitiesRequired: ["trade_contractor", "manage_options"],
};

export const CHRONOS_WP_METADATA: WpInspectorRecord = {
  endpoint: "/wp-json/aether/v1/chronos-entries",
  method: "POST",
  cptOrTable: "table: wp_aether_chronos_timesheets",
  phpSourceFile: "wordpress/aether-wp-core/includes/Rest/ChronosEntriesController.php",
  phpSnippet: `public function create_entry($request)
{
    global $wpdb;
    $params = $request->get_json_params() ?? [];
    $phase = strtoupper(\\sanitize_text_field((string) ($params['phase_category'] ?? 'CUSTOM_WP_THEME')));
    $duration_seconds = intval($params['duration_seconds'] ?? 0);

    $wpdb->insert("{$wpdb->prefix}aether_chronos_timesheets", [
        'user_id'          => \\get_current_user_id(),
        'project_id'       => intval($params['project_id'] ?? 1),
        'task_description' => \\sanitize_textarea_field((string) ($params['task_description'] ?? '')),
        'phase_category'   => $phase,
        'is_billable'      => !empty($params['is_billable']) ? 1 : 0,
        'hourly_rate_aud'  => floatval($params['hourly_rate_aud'] ?? 185.0),
        'duration_seconds' => $duration_seconds,
    ]);

    return new \\WP_REST_Response([
        'success'               => true,
        'entry_id'              => intval($wpdb->insert_id),
        'retainer_burn_percent' => $burn_percent,
        'retainer_status'       => $status,
    ], 201);
}`,
  sqlSchemaSnippet: `CREATE TABLE wp_aether_chronos_timesheets (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  sampleRequestPayload: {
    project_id: 102,
    task_description: "HPOS Double-Entry Points Ledger Hook",
    phase_category: "WOOCOMMERCE_PLUGIN",
    is_billable: true,
    hourly_rate_aud: 185.0,
    duration_seconds: 5740,
    started_at: "2026-11-04 08:00:00",
    ended_at: "2026-11-04 09:35:40",
  },
  sampleResponsePayload: {
    success: true,
    entry_id: 8841,
    project_id: 102,
    phase_category: "WOOCOMMERCE_PLUGIN",
    retainer_burn_percent: 90.0,
    retainer_status: "WARNING",
  },
  acfFieldGroupId: "group_chronos_retainer",
  wpCapabilitiesRequired: ["agency_pm", "senior_wp_dev", "manage_options"],
};
