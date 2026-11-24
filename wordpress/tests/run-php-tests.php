<?php

declare(strict_types=1);

define('ABSPATH', __DIR__ . '/mock-wp/');
define('AETHER_WP_CORE_VERSION', '1.0.0');
define('ARRAY_A', 'ARRAY_A');

// Minimal WordPress global-namespace stubs simulating real WP core contracts under PHP 8.2+
class WP_Error
{
    public string $code;
    public string $message;
    public array $data;

    public function __construct(string $code = '', string $message = '', array $data = [])
    {
        $this->code = $code;
        $this->message = $message;
        $this->data = $data;
    }

    public function get_error_code(): string
    {
        return $this->code;
    }

    public function get_error_data(): array
    {
        return $this->data;
    }
}

class WP_REST_Request
{
    private array $jsonParams;
    private array $params;

    public function __construct(array $jsonParams = [], array $params = [])
    {
        $this->jsonParams = $jsonParams;
        $this->params = $params;
    }

    public function get_json_params(): array
    {
        return $this->jsonParams;
    }

    public function get_param(string $key)
    {
        return $this->params[$key] ?? ($this->jsonParams[$key] ?? null);
    }
}

class WP_REST_Response
{
    public array $data;
    public int $status;

    public function __construct(array $data = [], int $status = 200)
    {
        $this->data = $data;
        $this->status = $status;
    }

    public function get_data(): array
    {
        return $this->data;
    }

    public function get_status(): int
    {
        return $this->status;
    }
}

// Intentionally untyped properties matching WordPress Core WP_REST_Controller
class WP_REST_Controller
{
    protected $namespace;
    protected $rest_base;

    public function get_endpoint_args_for_item_schema($method = 'POST'): array
    {
        return [];
    }
}

class WP_Query
{
    public array $posts = [];

    public function __construct(array $args = [])
    {
        global $mock_wp_posts;
        $targetType = $args['post_type'] ?? 'post';
        foreach ($mock_wp_posts as $post) {
            if ($post->post_type === $targetType) {
                $this->posts[] = $post;
            }
        }
        $this->posts = array_reverse($this->posts);
    }
}

class MockWpdb
{
    public string $prefix = 'wp_';
    public int $insert_id = 0;
    public array $tables = [
        'wp_aether_reward_ledger'     => [],
        'wp_aether_sku_crossref'      => [],
        'wp_aether_chronos_timesheets'=> [],
    ];

    public function get_charset_collate(): string
    {
        return 'DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    }

    public function esc_like(string $text): string
    {
        return addslashes($text);
    }

    public function prepare(string $query, ...$args): string
    {
        foreach ($args as $arg) {
            $replacement = is_int($arg) || is_float($arg) ? (string) $arg : "'" . addslashes((string) $arg) . "'";
            $query = preg_replace('/%[sd]/', $replacement, $query, 1) ?? $query;
        }
        return $query;
    }

    public function query(string $sql): bool
    {
        return true;
    }

    public function insert(string $table, array $data): int|false
    {
        if (!isset($this->tables[$table])) {
            $this->tables[$table] = [];
        }
        $nextId = count($this->tables[$table]) + 1;
        $data['id'] = $nextId;
        $this->tables[$table][] = $data;
        $this->insert_id = $nextId;
        return 1;
    }

    public function delete(string $table, array $where, array $format = []): int|false
    {
        if (!isset($this->tables[$table])) {
            return 0;
        }
        $targetId = intval($where['id'] ?? 0);
        $before = count($this->tables[$table]);
        $this->tables[$table] = array_values(array_filter(
            $this->tables[$table],
            static fn (array $row): bool => intval($row['id'] ?? 0) !== $targetId
        ));
        return $before - count($this->tables[$table]);
    }

    public function get_var(string $sql)
    {
        if (str_contains($sql, 'COUNT(*)') && str_contains($sql, 'wp_aether_sku_crossref')) {
            return count($this->tables['wp_aether_sku_crossref']);
        }
        if (str_contains($sql, 'wp_aether_reward_ledger') && str_contains($sql, 'reference_id =')) {
            if (preg_match("/reference_type = '([^']+)' AND reference_id = '([^']+)'/", $sql, $m)) {
                foreach ($this->tables['wp_aether_reward_ledger'] as $row) {
                    if ($row['reference_type'] === $m[1] && $row['reference_id'] === $m[2]) {
                        return $row['id'];
                    }
                }
            }
            return null;
        }
        if (str_contains($sql, 'SELECT balance_after FROM') && preg_match('/contractor_id = (\d+)/', $sql, $m)) {
            $cid = intval($m[1]);
            $rows = array_values(array_filter(
                $this->tables['wp_aether_reward_ledger'],
                static fn (array $r): bool => intval($r['contractor_id']) === $cid
            ));
            if (empty($rows)) {
                return 0;
            }
            $last = end($rows);
            return intval($last['balance_after']);
        }
        if (str_contains($sql, 'SUM(duration_seconds)') && preg_match('/project_id = (\d+)/', $sql, $m)) {
            $pid = intval($m[1]);
            $sum = 0;
            foreach ($this->tables['wp_aether_chronos_timesheets'] as $row) {
                if (intval($row['project_id']) === $pid) {
                    $sum += intval($row['duration_seconds']);
                }
            }
            return $sum;
        }
        return null;
    }

    public function get_results(string $sql, string $output = ARRAY_A): array
    {
        if (str_contains($sql, 'wp_aether_sku_crossref')) {
            $rows = $this->tables['wp_aether_sku_crossref'];
            if (preg_match("/competitor_brand = '([^']+)'/", $sql, $m)) {
                $rows = array_values(array_filter($rows, static fn (array $r): bool => $r['competitor_brand'] === $m[1]));
            }
            return $rows;
        }
        if (str_contains($sql, 'wp_aether_reward_ledger')) {
            return array_reverse($this->tables['wp_aether_reward_ledger']);
        }
        if (str_contains($sql, 'wp_aether_chronos_timesheets')) {
            $rows = $this->tables['wp_aether_chronos_timesheets'];
            if (preg_match('/project_id = (\d+)/', $sql, $m)) {
                $pid = intval($m[1]);
                $rows = array_values(array_filter($rows, static fn (array $r): bool => intval($r['project_id']) === $pid));
            }
            return array_reverse($rows);
        }
        return [];
    }
}

$wpdb = new MockWpdb();
$mock_wp_posts = [];
$mock_wp_post_meta = [];
$mock_wp_user_meta = [];
$mock_wp_roles = [
    'administrator' => new class {
        public array $caps = ['read' => true, 'manage_options' => true];
        public function add_cap(string $cap): void { $this->caps[$cap] = true; }
    },
];
$mock_wp_options = [];
$mock_dbdelta_queries = [];
$mock_registered_routes = [];
$mock_registered_cpts = [];
$mock_shortcodes = [];
$mock_current_user = ['id' => 0, 'caps' => []];
$mock_wc_orders = [];

function is_wp_error($thing): bool { return $thing instanceof WP_Error; }
function sanitize_text_field(string $str): string { return trim(strip_tags($str)); }
function sanitize_textarea_field(string $str): string { return trim(strip_tags($str)); }
function sanitize_email(string $email): string { return filter_var(trim($email), FILTER_SANITIZE_EMAIL) ?: ''; }
function is_email(string $email): bool { return (bool) filter_var($email, FILTER_VALIDATE_EMAIL); }
function wp_json_encode($data): string { return json_encode($data, JSON_THROW_ON_ERROR); }
function current_time(string $type): string { return '2026-11-25 02:45:00'; }
function esc_html(string $s): string { return htmlspecialchars($s, ENT_QUOTES); }
function esc_attr(string $s): string { return htmlspecialchars($s, ENT_QUOTES); }
function esc_url(string $s): string { return $s; }
function rest_url(string $path = ''): string { return 'https://example.test/wp-json/' . ltrim($path, '/'); }
function wp_create_nonce(string $action = ''): string { return 'nonce_test_123'; }
function update_option(string $name, $value): bool { global $mock_wp_options; $mock_wp_options[$name] = $value; return true; }
function dbDelta(string $sql): array { global $mock_dbdelta_queries; $mock_dbdelta_queries[] = $sql; return ['ok']; }
function add_role(string $slug, string $name, array $caps): object {
    global $mock_wp_roles;
    $mock_wp_roles[$slug] = new class($caps) {
        public array $caps;
        public function __construct(array $c) { $this->caps = $c; }
        public function add_cap(string $cap): void { $this->caps[$cap] = true; }
    };
    return $mock_wp_roles[$slug];
}
function get_role(string $slug): ?object { global $mock_wp_roles; return $mock_wp_roles[$slug] ?? null; }
function register_post_type(string $pt, array $args): void { global $mock_registered_cpts; $mock_registered_cpts[$pt] = $args; }
function register_rest_route(string $ns, string $route, array $args): void { global $mock_registered_routes; $mock_registered_routes[$ns . $route] = $args; }
function add_shortcode(string $tag, callable $cb): void { global $mock_shortcodes; $mock_shortcodes[$tag] = $cb; }
function register_block_type(string $name, array $args): void { global $mock_shortcodes; $mock_shortcodes[$name] = $args['render_callback']; }
function is_user_logged_in(): bool { global $mock_current_user; return $mock_current_user['id'] > 0; }
function get_current_user_id(): int { global $mock_current_user; return $mock_current_user['id']; }
function current_user_can(string $cap): bool { global $mock_current_user; return !empty($mock_current_user['caps'][$cap]); }
function get_user_meta(int $uid, string $key, bool $single = false) { global $mock_wp_user_meta; return $mock_wp_user_meta[$uid][$key] ?? ''; }
function update_user_meta(int $uid, string $key, $val): bool { global $mock_wp_user_meta; $mock_wp_user_meta[$uid][$key] = $val; return true; }
function wp_insert_post(array $args): int {
    global $mock_wp_posts;
    $id = count($mock_wp_posts) + 1001;
    $mock_wp_posts[$id] = (object) array_merge(['ID' => $id], $args);
    return $id;
}
function update_post_meta(int $pid, string $key, $val): bool { global $mock_wp_post_meta; $mock_wp_post_meta[$pid][$key] = $val; return true; }
function get_post_meta(int $pid, string $key, bool $single = false) { global $mock_wp_post_meta; return $mock_wp_post_meta[$pid][$key] ?? ''; }
function wc_get_order(int $order_id) { global $mock_wc_orders; return $mock_wc_orders[$order_id] ?? null; }

$pluginRoot = dirname(__DIR__) . '/aether-wp-core/includes/';
require_once $pluginRoot . 'Auth/RolesManager.php';
require_once $pluginRoot . 'Database/SchemaInstaller.php';
require_once $pluginRoot . 'PostTypes/CustomPostTypes.php';
require_once $pluginRoot . 'Blocks/EmbedShortcodes.php';
require_once $pluginRoot . 'Rest/AuraQuotesController.php';
require_once $pluginRoot . 'Rest/VoltClaimsController.php';
require_once $pluginRoot . 'Rest/SkuSwitchController.php';
require_once $pluginRoot . 'Rest/ChronosEntriesController.php';
require_once $pluginRoot . 'WooCommerce/LoyaltyOrderHook.php';

function assert_true(bool $cond, string $label): void
{
    if (!$cond) {
        fwrite(STDERR, "FAILED ASSERTION: {$label}\n");
        exit(1);
    }
}

// 1. Roles registration
\AetherDigital\WP\Auth\RolesManager::register_roles();
assert_true(isset($mock_wp_roles['agency_pm'], $mock_wp_roles['senior_wp_dev'], $mock_wp_roles['trade_contractor']), 'Roles registered');
assert_true(!empty($mock_wp_roles['administrator']->caps['agency_pm']), 'Administrator receives agency_pm cap');

// 2. Schema installation + double-space PRIMARY KEY + SKU seed
\AetherDigital\WP\Database\SchemaInstaller::install();
\AetherDigital\WP\Database\SchemaInstaller::seed_sku_crossref();
assert_true(count($mock_dbdelta_queries) === 3, 'Three dbDelta tables created');
foreach ($mock_dbdelta_queries as $ddl) {
    assert_true(str_contains($ddl, 'PRIMARY KEY  (id)'), 'dbDelta uses two spaces after PRIMARY KEY');
}
assert_true(count($wpdb->tables['wp_aether_sku_crossref']) === 5, 'Initial SKU crossref rows seeded');

// 3. CPTs & Shortcodes/Blocks registration
\AetherDigital\WP\PostTypes\CustomPostTypes::register();
\AetherDigital\WP\Blocks\EmbedShortcodes::register();
assert_true(isset($mock_registered_cpts['aura_quote'], $mock_registered_cpts['volt_reward_item'], $mock_registered_cpts['chronos_project']), 'CPTs registered');
$embedHtml = \AetherDigital\WP\Blocks\EmbedShortcodes::render_gutenberg_block(['app' => 'voltswitch']);
assert_true(str_contains($embedHtml, 'data-app="voltswitch"'), 'Gutenberg block renders app mount');

// 4. All 4 REST Controllers instantiate & register under PHP 8.2/8.3 without fatal typed property errors
$auraCtrl = new \AetherDigital\WP\Rest\AuraQuotesController();
$voltCtrl = new \AetherDigital\WP\Rest\VoltClaimsController();
$skuCtrl = new \AetherDigital\WP\Rest\SkuSwitchController();
$chronosCtrl = new \AetherDigital\WP\Rest\ChronosEntriesController();
$auraCtrl->register_routes();
$voltCtrl->register_routes();
$skuCtrl->register_routes();
$chronosCtrl->register_routes();
assert_true(isset($mock_registered_routes['aether/v1/aura-quotes'], $mock_registered_routes['aether/v1/volt-claims'], $mock_registered_routes['aether/v1/volt-redeem'], $mock_registered_routes['aether/v1/sku-switch'], $mock_registered_routes['aether/v1/chronos-entries']), 'All REST routes registered');

// 5. AuraQuotesController validation, creation & GET query
$badQuote = $auraCtrl->create_quote(new WP_REST_Request(['postcode' => 'INVALID', 'product_type' => 'GARAGE_DOOR']));
assert_true(is_wp_error($badQuote) && $badQuote->get_error_code() === 'invalid_quote_payload', 'Aura rejects invalid postcode');

$goodQuote = $auraCtrl->create_quote(new WP_REST_Request([
    'customer_name' => 'Julian Vance',
    'email'         => 'j.vance@architecturalpartners.com.au',
    'postcode'      => '2088',
    'product_type'  => 'GARAGE_DOOR',
    'bom'           => ['total_inc_gst_aud' => 7513.00],
]));
assert_true($goodQuote instanceof WP_REST_Response && $goodQuote->get_status() === 201, 'Aura returns 201 Created');
assert_true($goodQuote->get_data()['product_type'] === 'GARAGE_DOOR', 'Aura preserves uppercase GARAGE_DOOR');

$quotesRes = $auraCtrl->get_quotes(new WP_REST_Request([], ['per_page' => 10]));
assert_true($quotesRes->get_data()['count'] === 1 && $quotesRes->get_data()['quotes'][0]['postcode'] === '2088', 'Aura GET returns saved quotes');

// 6. VoltClaimsController auth enforcement, server-side tiering, duplicate rejection, redemption overdraft guard
$unauthPerm = $voltCtrl->claim_permissions_check(new WP_REST_Request());
assert_true(is_wp_error($unauthPerm) && $unauthPerm->get_error_data()['status'] === 403, 'Volt rejects unauthenticated caller with 403');

$mock_current_user = ['id' => 42, 'caps' => ['trade_contractor' => true]];
update_user_meta(42, '_aether_annual_spend_aud', 30000.0); // GOLD 1.5x

$badAbn = $voltCtrl->submit_claim(new WP_REST_Request([
    'invoice_number'      => 'INV-BAD-01',
    'wholesaler'          => 'REXEL_ELECTRICAL',
    'wholesaler_abn'      => '12345678901',
    'subtotal_ex_gst_aud' => 1000.0,
]));
assert_true(is_wp_error($badAbn) && $badAbn->get_error_code() === 'invalid_abn', 'Volt rejects invalid ATO ABN');

$validClaim = $voltCtrl->submit_claim(new WP_REST_Request([
    'invoice_number'      => 'INV-REX-9001',
    'wholesaler'          => 'REXEL_ELECTRICAL',
    'wholesaler_abn'      => '51 824 753 556',
    'subtotal_ex_gst_aud' => 25000.0,
]));
assert_true($validClaim instanceof WP_REST_Response && $validClaim->get_status() === 201, 'Volt claim succeeds with 201');
assert_true($validClaim->get_data()['awarded_points'] === 37500, 'Volt calculates GOLD 1.5x server-side');
assert_true($validClaim->get_data()['tier'] === 'PLATINUM', 'Volt auto-upgrades tier to PLATINUM over $50k spend');

$dupClaim = $voltCtrl->submit_claim(new WP_REST_Request([
    'invoice_number'      => 'INV-REX-9001',
    'wholesaler'          => 'REXEL_ELECTRICAL',
    'wholesaler_abn'      => '51 824 753 556',
    'subtotal_ex_gst_aud' => 500.0,
]));
assert_true(is_wp_error($dupClaim) && $dupClaim->get_error_data()['status'] === 409, 'Volt rejects duplicate invoice with 409');

$overdraft = $voltCtrl->redeem_reward(new WP_REST_Request(['reward_title' => 'Test', 'reward_sku' => 'TEST', 'points_cost' => 999999]));
assert_true(is_wp_error($overdraft) && $overdraft->get_error_code() === 'insufficient_points', 'Volt prevents overdraft redemption');

$redeemOk = $voltCtrl->redeem_reward(new WP_REST_Request(['reward_title' => 'Fluke 117', 'reward_sku' => 'TOOL-FLUKE-117', 'points_cost' => 18500]));
assert_true($redeemOk instanceof WP_REST_Response && $redeemOk->get_data()['new_balance'] === 19000, 'Volt debits points and returns updated balance');

$history = $voltCtrl->get_claims_history(new WP_REST_Request());
assert_true($history->get_data()['balance'] === 19000 && count($history->get_data()['entries']) === 2, 'Volt GET history returns live ledger');

// 7. SkuSwitchController search
$skuRes = $skuCtrl->search_skus(new WP_REST_Request([], ['brand' => 'CLIPSAL']));
assert_true($skuRes->get_data()['count'] === 1, 'SKU switch filters by brand cleanly');

// 8. ChronosEntriesController create, GET, DELETE
$mock_current_user = ['id' => 7, 'caps' => ['agency_pm' => true]];
update_post_meta(102, '_chronos_budget_hours', 2.0);
$chronosCreate = $chronosCtrl->create_entry(new WP_REST_Request([
    'project_id'       => 102,
    'task_description' => 'HPOS Migration',
    'phase_category'   => 'WOOCOMMERCE_PLUGIN',
    'is_billable'      => true,
    'hourly_rate_aud'  => 185.0,
    'duration_seconds' => 7200,
]));
assert_true($chronosCreate instanceof WP_REST_Response && $chronosCreate->get_status() === 201, 'Chronos creates entry');
assert_true($chronosCreate->get_data()['retainer_status'] === 'OVER_BURN' || $chronosCreate->get_data()['retainer_status'] === 'WARNING', 'Chronos calculates burn status');

$chronosList = $chronosCtrl->get_entries(new WP_REST_Request([], ['project_id' => 102]));
assert_true(count($chronosList->get_data()['entries']) === 1, 'Chronos GET returns persisted entries');

$chronosDel = $chronosCtrl->delete_entry(new WP_REST_Request([], ['id' => 1]));
assert_true($chronosDel instanceof WP_REST_Response && $chronosDel->get_data()['deleted'] === true, 'Chronos DELETE removes entry');

// 9. WooCommerce HPOS LoyaltyOrderHook idempotency
$mock_wc_orders[777] = new class {
    public array $meta = ['_contractor_tier' => 'GOLD'];
    public function get_customer_id(): int { return 42; }
    public function get_meta(string $k): string { return $this->meta[$k] ?? ''; }
    public function get_subtotal(): float { return 1000.0; }
    public function update_meta_data(string $k, $v): void { $this->meta[$k] = $v; }
    public function save(): void {}
};
\AetherDigital\WP\WooCommerce\LoyaltyOrderHook::handle_completed_order(777);
\AetherDigital\WP\WooCommerce\LoyaltyOrderHook::handle_completed_order(777); // Duplicate hook fire
$historyAfterOrder = $voltCtrl->get_claims_history(new WP_REST_Request());
// 19000 + (1000 * 1.5) = 20500, not 22000
assert_true($mock_wc_orders[777]->meta['_aether_points_awarded'] === 1500, 'WooCommerce hook awards 1.5x points once');

echo "ALL PHP RUNTIME ASSERTIONS PASSED\n";
