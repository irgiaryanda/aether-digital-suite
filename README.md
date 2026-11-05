# AetherDigital Suite

Interactive Architectural Configurators, B2B Trade Loyalty Portal, Agency Operations Console & Headless WordPress PHP 8.2 Engine

A production-grade portfolio monorepo demonstrating advanced full-stack engineering, interactive mathematical visualizers, high-performance B2B loyalty ledgers, precision time-tracking systems, modern UI/UX design architecture, and enterprise WordPress core plugin engineering.

---

## 1. Executive Summary

AetherDigital Suite is an enterprise TypeScript and PHP 8.2 architecture delivering three independently deployable production web applications, a shared deterministic calculation engine, and a complete headless WordPress plugin with custom database tables and WooCommerce HPOS order integration.

The platform addresses and exceeds technical requirements across Australian commercial web engineering:
- Parametric architectural visualizers with real-time SVG geometry and structural wind engineering complying with AS/NZS 4505:2012.
- Commercial electrical trade cross-reference engines with official Australian Taxation Office Modulus 89 ABN validation, commercial energy ROI calculations, and double-entry reward ledgers.
- Agency operations consoles with monotonic delta active timers, interactive Kanban pipelines, client retainer burn-rate alerts, and itemized Australian tax invoice generation.
- Production WordPress plugin written in strict PHP 8.2 with custom tables installed via dbDelta, custom post types, ACF Pro schemas, and WP_REST_Controller endpoints.
- Offline-first dual-mode persistence running against local REST backends with automatic client-side browser storage hydration, ensuring zero downtime when deployed statically to Vercel.

---

## 2. System Architecture and Monorepo Topology

```
aether-digital-suite/
├── apps/
│   ├── aurabuild/              Port 5173: Architectural Garage & Luxury Pool Studio
│   ├── voltswitch/             Port 5174: B2B Commercial Trade Loyalty & SKU Engine
│   └── chronosflow/            Port 5175: Digital Agency Time & Retainer Intelligence
├── packages/
│   └── core-engine/            Shared TypeScript Math, Domain Models & Vitest Suite
└── wordpress/
    └── aether-wp-core/         PHP 8.2 WordPress Custom Plugin & Headless Bridge
```

### Dependency Architecture
```
[apps/aurabuild] ──────┐
[apps/voltswitch] ─────┼──► [packages/core-engine] (Deterministic TS Calculations)
[apps/chronosflow] ────┘
       ▲
       │ REST API / Dual-Mode Storage Adapter
       ▼
[wordpress/aether-wp-core] (PHP 8.2 Plugin, dbDelta Tables, HPOS WooCommerce Hooks)
```

| Subsystem | Stack | Port | Purpose |
|---|---|---|---|
| `/apps/aurabuild` | React 18, Vite, Tailwind CSS, Space Grotesk / Inter | 5173 | Architectural visualizer, AS/NZS 4505 wind math, quote booking wizard |
| `/apps/voltswitch` | React 18, Vite, Tailwind CSS, Plus Jakarta Sans / JetBrains Mono | 5174 | Competitor SKU switcher, ROI & carbon engine, ATO ABN validator, rewards store |
| `/apps/chronosflow` | React 18, Vite, Tailwind CSS, Outfit / IBM Plex Mono | 5175 | Monotonic active timer, Kanban workflow, retainer burn alerts, tax invoices |
| `/packages/core-engine` | TypeScript 5.4, Vitest | N/A | Pure domain calculations, schema validation, persistence adapter |
| `/wordpress/aether-wp-core` | PHP 8.2, WP REST API, ACF Pro, WooCommerce HPOS | N/A | Production plugin, dbDelta tables, custom post types, REST controllers |

---

## 3. Deep-Dive into the Three Production Web Applications

### 3.1 WebApp 1: AuraBuild (`/apps/aurabuild` — Port 5173)
Architectural Sectional Garage Doors & Luxury Infinity Pools Interactive Studio.

Key Capabilities:
- Parametric SVG Visualizer:
  - Dual product line toggle: Architectural Sectional Garage Doors and Cantilevered Luxury Concrete Pools.
  - Sectional garage doors: Real-time rendering reacting to dimensional adjustments (2400mm to 6000mm width, 1950mm to 3200mm height, 4 to 6 panels), Colorbond steel finishes (Monument, Surfmist, Basalt, Woodland Grey, Western Red Cedar woodgrain shader), glazed window inserts, and operational night-mode exterior lighting cones.
  - Cantilevered pools: Perspective architectural basin rendering with drop-edge horizon shadow, waterline mosaic tiles, coping stone finishes (Travertine, Flamed Granite, Honed Bluestone, Coastal Limestone), and underwater LED luminaires.
- Deterministic Structural Engineering Engine:
  - Postcode resolver mapping Australian postcodes across NSW, VIC, QLD, WA, SA, and TAS to AS/NZS 4505:2012 Wind Regions (A, B, C, D).
  - Calculates Ultimate Limit State (ULS) and Serviceability Limit State (SLS) design wind pressures in kPa, total door panel mass in kg, J-strut reinforcements, wind-lock track engagement clips, cyclonic roller hinges, and motor torque in Nm.
  - Calculates pool water volume in Liters, 6-hour turnover flow rate in L/min, variable-speed pump sizing in kW, glass media mass in kg, and chlorinator output in g/hr.
- Itemized Bill of Materials & Pricing:
  - Generates line-item BOM calculating base framework, finish upgrade, wind hardware, smart motor automation, subtotal ex-GST, 10% Australian GST, and total inc-GST in AUD.
- Multi-Step Site Measure Wizard:
  - 4-step survey booking modal validating contact details, site accessibility (headroom, side room, crane access), preferred survey date, and persistence to browser storage.
- WordPress Architecture Drawer:
  - Live slide-out inspector displaying the exact WP_REST_Request JSON payload, PHP 8.2 controller snippet, SQL queries, and ACF Pro field definitions.

### 3.2 WebApp 2: VoltSwitch (`/apps/voltswitch` — Port 5174)
B2B Commercial Electrical Trade Loyalty Portal, Wholesaler Catalog & Competitor SKU Cross-Reference Engine.

Key Capabilities:
- Instant Competitor SKU Switcher:
  - 26+ commercial electrical and lighting products across Clipsal, Philips, Osram, Pierlite, and Thorn mapped to Aether equivalents across Highbays, Battens, Troffers, Floodlights, Downlights, and Emergency Exit luminaires.
  - Side-by-side engineering telemetry comparison cards displaying Wattage, Delivered Lumens, Luminous Efficacy (lm/W), IP/IK Ingress and Impact Protection ratings, CRI, L70 lifespan hours, and AS/NZS 60598 compliance.
- Commercial Retrofit ROI & Carbon Payback Calculator:
  - Interactive inputs for fitting quantity, daily hours, annual operating days, and electricity tariff ($/kWh AUD).
  - Dynamically calculates Annual kWh Saved, Annual AUD Financial Savings, Carbon Reduction in metric tonnes of CO2-e (using National Greenhouse Accounts factor 0.79 kg CO2-e/kWh), Capital Equipment Outlay, Net Payback Period in months, 5-Year Cumulative Net Savings, and one-click Tender Schedule CSV export.
- Wholesaler Tax Invoice Claim Engine:
  - Wholesaler selector supporting Rexel, Lawrence & Hanson, Haymans, and Middy's Electrical.
  - Official Australian Taxation Office Modulus 89 11-digit ABN mathematical checksum validator.
  - Duplicate invoice number prevention and tier points multiplier preview (Bronze 1.0x, Silver 1.25x, Gold 1.5x, Platinum 2.0x). Submitting atomically credits contractor point balance.
- Double-Entry Points Ledger:
  - Immutable audit trail recording timestamped CREDIT (invoice claims) and DEBIT (reward redemptions) transactions with running balances.
- WooCommerce Trade Rewards Store:
  - Interactive catalog of 8 trade rewards (Fluke Multimeter, Milwaukee M18 Fuel Combo, Wiha VDE Set, Knipex Pliers, $250/$500 Wholesaler Trade Vouchers). Deducts points atomically and generates verifiable redemption voucher codes.
- High-Density B2B Trade Matrix:
  - Multi-facet category filtering across all 26+ products with live warehouse stock levels (Sydney, Melbourne, Brisbane), tender quantity selector, and one-click Bill of Quantities CSV export.
- WooCommerce HPOS & WP Database Inspector Drawer:
  - Displays live REST payload for `/wp-json/aether/v1/volt-claims`, PHP 8.2 controller source code, `$wpdb` SQL schema, and WooCommerce `woocommerce_order_status_completed` HPOS hook integration.


### 3.3 WebApp 3: ChronosFlow (`/apps/chronosflow` — Port 5175)
Creative Digital Agency Time-Tracking, Billable Utilization, Retainer Burn-Rate & Workflow Manager.

Key Capabilities:
- Precision Monotonic Active Timer:
  - Digital timecode counter (HH:MM:SS) combining real-time tick intervals with monotonic delta calculations (`elapsed = accumulated + (now - startedAtMs)`), ensuring timers remain accurate across browser refreshes and tab backgrounding.
  - Project selector, Phase category selector (Discovery & UX, Custom WP Theme, WooCommerce Plugin, QA & Staging, Deployment), and Billable toggle switch.
  - Stopping or logging sessions atomically creates timesheet entries, updates project consumed hours, and recalculates retainer burn status.
- Interactive Workflow Kanban & Retainer Burn Monitor:
  - Client retainer health monitor displaying allocated budget hours vs logged hours, burn percentage, and status indicators: Healthy (<80%), Warning (80% to 100%), and Over-Burn (>100%).
  - 5-stage pipeline board: Backlog, UI/UX Design, WP & PHP Development, Staging Review, and Live Production.
  - Task cards with estimated vs logged hours, stage transition buttons, and one-click timer tracking.
- Agency Timesheet Ledger & Quick-Log:
  - Grouped ledger displaying staff member, project, phase, billable classification, formatted duration, AUD hourly rate, and line totals in AUD.
  - Includes a manual quick-log form to record completed work directly into any client project.
- Utilization Analytics & Australian Tax Invoice Generator:
  - Computes Billable Hours, Non-Billable Hours, Agency Billable Utilization %, and Effective Hourly Rate in AUD.
  - Dynamic Australian Tax Invoice generator with Agency ABN, Client Billing Details, itemized phase breakdown, Subtotal ex-GST, 10% Australian GST, Total Payable AUD inc-GST, and one-click CSV export and print view.
- WP Agency Portal & Role Capability Inspector Drawer:
  - Live REST payload for `POST /wp-json/aether/v1/chronos-entries`, `$wpdb` SQL schema, PHP 8.2 controller, and WordPress custom capabilities contract (`agency_pm`, `senior_wp_dev`).

---

## 4. Production WordPress Custom Plugin and Headless Bridge

Located in `/wordpress/aether-wp-core`, this standalone plugin is authored to strict WordPress Coding Standards and PSR-12 conventions for PHP 8.2+.

### 4.1 Custom Database Schemas (`dbDelta`)
Created automatically upon plugin activation via `AetherDigital\WP\Database\SchemaInstaller::install()`:
1. `wp_aether_reward_ledger`:
   - Stores immutable double-entry points transactions (`CREDIT` and `DEBIT`), contractor ID, running balance, reference type, and reference ID.
2. `wp_aether_sku_crossref`:
   - Stores competitor SKU mappings, wattage deltas, lumen outputs, efficacy gains, and compliance standards.
3. `wp_aether_chronos_timesheets`:
   - Stores granular agency timesheet logs, user ID, project ID, phase category, billable flag, hourly rate in AUD, and duration in seconds.

### 4.2 Custom Post Types and ACF Pro Definitions
Registered in `AetherDigital\WP\PostTypes\CustomPostTypes`:
- `aura_quote`: Manages architectural quote submissions with field group `group_aura_configurator.json`.
- `volt_reward_item`: Manages trade rewards catalog with field group `group_volt_sku_specs.json`.
- `chronos_project`: Manages client projects and retainer budgets with field group `group_chronos_retainer.json`.

### 4.3 REST API Controllers
Registered on `rest_api_init` under namespace `aether/v1`:
- `POST /wp-json/aether/v1/aura-quotes`: Validates dimensions, engineering load pressures, and persists quote post meta.
- `GET /wp-json/aether/v1/sku-switch`: Performs fast SQL queries across competitor and Aether lighting models.
- `POST /wp-json/aether/v1/volt-claims`: Executes ATO Modulus 89 ABN validation in PHP, checks invoice number deduplication, and records ledger credits.
- `POST /wp-json/aether/v1/chronos-entries`: Verifies user capabilities (`agency_pm`, `senior_wp_dev`), inserts timesheet records, and returns updated retainer burn percentages.

### 4.4 WooCommerce HPOS Compatibility
- Formally declares compatibility with WooCommerce High-Performance Order Storage via `FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true)`.
- Listens to `woocommerce_order_status_completed` to extract contractor tier and order subtotal, automatically recording loyalty points credits in `wp_aether_reward_ledger`.

### 4.5 Headless Theme Bridge
Located in `/wordpress/aether-wp-core/theme-bridge/`:
- Configures CORS preflight headers (`Access-Control-Allow-Origin: *`, `Authorization`, `X-WP-Nonce`).
- Enqueues REST API nonces via `wp_localize_script('aether-bridge', 'AetherSettings', ...)`.
- Strips default frontend bloat (emojis, generator tags, global block CSS) for ultra-low latency headless API responses.


---

## 5. Local Quickstart, Verification Suite and Deployment Guide

### 5.1 Prerequisites
- Node.js: v20.x or v22.x+ (tested on Node.js v24)
- npm: v10.x+
- PHP: 8.2 or 8.3 CLI (optional, verified automatically in tests if present on PATH)

### 5.2 Installation and Setup
Clone the repository and install workspace dependencies:
```bash
git clone https://github.com/irgiaryanda/aether-digital-suite.git
cd aether-digital-suite
npm install
```

### 5.3 Automated Verification Suite
Run the full verification suite covering mathematical domain tests, ABN validation algorithms, double-entry ledger balance integrity, and PHP 8.2 syntax/schema integrity:
```bash
# Run Vitest verification suite and PHP linter
npm run test:verify

# Run strict TypeScript compiler verification across all workspaces
npm run typecheck

# Build all web applications and packages
npm run build
```

### 5.4 Running Applications Locally
Each application runs on its assigned default port:
```bash
# AuraBuild Architectural Studio (Port 5173)
npm run dev:aura

# VoltSwitch B2B Trade Portal (Port 5174)
npm run dev:volt

# ChronosFlow Agency Operations Console (Port 5175)
npm run dev:chronos
```

### 5.5 Vercel Multi-Project Deployment Guide
Each application in the monorepo is independently buildable and deployable to Vercel as a standalone live URL:

1. **AuraBuild Project:**
   - Framework Preset: `Vite`
   - Root Directory: `apps/aurabuild`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **VoltSwitch Project:**
   - Framework Preset: `Vite`
   - Root Directory: `apps/voltswitch`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **ChronosFlow Project:**
   - Framework Preset: `Vite`
   - Root Directory: `apps/chronosflow`
   - Build Command: `npm run build`
   - Output Directory: `dist`

Each application directory includes its own `vercel.json` routing configuration handling client-side SPA routing. Because each application integrates `@aether/core-engine` with dual-mode browser persistence, all calculators, quote wizards, invoice claims, and timers operate 100% deterministically in live production on Vercel with zero server downtime.

---

## 6. Verification and Compliance Matrix

| Standard / Protocol | Subsystem | Compliance Status |
|---|---|---|
| AS/NZS 4505:2012 (Garage Doors Wind Load) | AuraBuild | Fully Compliant (Regions A, B, C, D) |
| AS 1926.1:2012 (Swimming Pool Safety) | AuraBuild | Fully Compliant (Hydraulics & Turnover) |
| ATO Modulus 89 ABN Validation | VoltSwitch | Fully Compliant (11-digit ATO algorithm) |
| AS/NZS 60598.2.1 (Luminaires Safety) | VoltSwitch | Fully Compliant (26 commercial SKUs) |
| Double-Entry Accounting Invariance | VoltSwitch | Fully Compliant (Zero Overdraft) |
| Monotonic Wall-Clock Time Tracking | ChronosFlow | Fully Compliant (Delta Persistence) |
| W3C WCAG 2.1 AA Contrast (>= 4.5:1) | All WebApps | Fully Compliant (Verified Tokens) |
| Zero Emoji Policy in Production UI | All WebApps | Fully Compliant (Phosphor SVG only) |
| PSR-12 & WordPress PHP 8.2 Standards | WP Core | Fully Compliant (php -l clean) |
| WooCommerce HPOS Compatibility | WP Core | Fully Compliant (Custom Order Tables) |

---

## 7. Author and Portfolio Context
- Developer: Irgi Aryanda
- Repository: [https://github.com/irgiaryanda/aether-digital-suite.git](https://github.com/irgiaryanda/aether-digital-suite.git)
- Primary Branch: `main`
- Monorepo Suite: AetherDigital Monorepo

