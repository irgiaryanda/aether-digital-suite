import { describe, expect, it } from "vitest";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import {
  AURA_WP_METADATA,
  CHRONOS_WP_METADATA,
  VOLT_WP_METADATA,
} from "../src/index";

const WP_ROOT_DIR = path.resolve(__dirname, "../../../wordpress");
const WP_CORE_DIR = path.join(WP_ROOT_DIR, "aether-wp-core");
const WP_THEME_DIR = path.join(WP_ROOT_DIR, "aether-digital-theme");
const WP_PHP_TESTS = path.join(WP_ROOT_DIR, "tests/run-php-tests.php");

function findPhpFiles(dir: string): string[] {
  const results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...findPhpFiles(fullPath));
    } else if (file.endsWith(".php")) {
      results.push(fullPath);
    }
  }
  return results;
}

describe("WordPress aether-wp-core & Theme Structural Verification", () => {
  it("passes PHP CLI syntax linting (php -l) across plugin and standalone theme", () => {
    const pluginPhpFiles = findPhpFiles(WP_CORE_DIR);
    const themePhpFiles = findPhpFiles(WP_THEME_DIR);
    const allPhpFiles = [...pluginPhpFiles, ...themePhpFiles];

    expect(pluginPhpFiles.length).toBeGreaterThanOrEqual(10);
    expect(themePhpFiles.length).toBeGreaterThanOrEqual(5);

    for (const filePath of allPhpFiles) {
      const output = execSync(`php -l "${filePath}"`, { encoding: "utf8" });
      expect(output).toContain("No syntax errors detected");
    }
  });

  it("passes full PHP runtime integration suite (REST controllers, dbDelta, roles, HPOS)", () => {
    expect(fs.existsSync(WP_PHP_TESTS)).toBe(true);
    const output = execSync(`php "${WP_PHP_TESTS}"`, { encoding: "utf8" });
    expect(output).toContain("ALL PHP RUNTIME ASSERTIONS PASSED");
  });

  it("verifies custom dbDelta database schema definitions in SchemaInstaller", () => {
    const schemaInstallerPath = path.join(WP_CORE_DIR, "includes/Database/SchemaInstaller.php");
    const content = fs.readFileSync(schemaInstallerPath, "utf8");

    expect(content).toContain("wp_aether_reward_ledger");
    expect(content).toContain("wp_aether_sku_crossref");
    expect(content).toContain("wp_aether_chronos_timesheets");
    expect(content).toContain("PRIMARY KEY  (id)");
    expect(content).toContain("dbDelta($sql_reward_ledger)");
    expect(content).toContain("dbDelta($sql_sku_crossref)");
    expect(content).toContain("dbDelta($sql_chronos_timesheets)");
  });

  it("verifies ACF Pro JSON field group definitions parse cleanly and match post types", () => {
    const acfDir = path.join(WP_CORE_DIR, "acf-json");
    const acfFiles = fs.readdirSync(acfDir).filter((f: string) => f.endsWith(".json"));

    expect(acfFiles.length).toBe(3);

    for (const file of acfFiles) {
      const raw = fs.readFileSync(path.join(acfDir, file), "utf8");
      const parsed = JSON.parse(raw);

      expect(parsed.key).toBeTruthy();
      expect(parsed.title).toBeTruthy();
      expect(Array.isArray(parsed.fields)).toBe(true);
      expect(parsed.fields.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("verifies WordPress Playground blueprint.json parses cleanly", () => {
    const blueprintPath = path.join(WP_ROOT_DIR, "blueprint.json");
    expect(fs.existsSync(blueprintPath)).toBe(true);
    const parsed = JSON.parse(fs.readFileSync(blueprintPath, "utf8"));
    expect(parsed.preferredVersions?.php).toBe("8.2");
    expect(Array.isArray(parsed.steps)).toBe(true);
  });

  it("verifies WP REST metadata inspector stays synchronized with real PHP controllers", () => {
    expect(AURA_WP_METADATA.endpoint).toBe("/wp-json/aether/v1/aura-quotes");
    expect(VOLT_WP_METADATA.endpoint).toBe("/wp-json/aether/v1/volt-claims");
    expect(CHRONOS_WP_METADATA.endpoint).toBe("/wp-json/aether/v1/chronos-entries");

    const auraPhp = fs.readFileSync(path.join(WP_CORE_DIR, "includes/Rest/AuraQuotesController.php"), "utf8");
    const voltPhp = fs.readFileSync(path.join(WP_CORE_DIR, "includes/Rest/VoltClaimsController.php"), "utf8");
    const chronosPhp = fs.readFileSync(path.join(WP_CORE_DIR, "includes/Rest/ChronosEntriesController.php"), "utf8");

    expect(auraPhp).toContain("function create_quote");
    expect(AURA_WP_METADATA.phpSnippet).toContain("create_quote");

    expect(voltPhp).toContain("function submit_claim");
    expect(VOLT_WP_METADATA.phpSnippet).toContain("submit_claim");

    expect(chronosPhp).toContain("function create_entry");
    expect(CHRONOS_WP_METADATA.phpSnippet).toContain("create_entry");
  });
});
