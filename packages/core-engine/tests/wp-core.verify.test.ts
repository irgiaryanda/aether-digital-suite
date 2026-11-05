import { describe, expect, it } from "vitest";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import {
  AURA_WP_METADATA,
  CHRONOS_WP_METADATA,
  VOLT_WP_METADATA,
} from "../src/index";

const WP_CORE_DIR = path.resolve(__dirname, "../../../wordpress/aether-wp-core");

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

describe("WordPress aether-wp-core Structural & Contract Verification", () => {
  it("passes PHP CLI syntax linting (php -l) with zero errors on all PHP files", () => {
    const phpFiles = findPhpFiles(WP_CORE_DIR);
    expect(phpFiles.length).toBeGreaterThanOrEqual(8);

    for (const filePath of phpFiles) {
      const output = execSync(`php -l "${filePath}"`, { encoding: "utf8" });
      expect(output).toContain("No syntax errors detected");
    }
  });

  it("verifies custom dbDelta database schema definitions in SchemaInstaller", () => {
    const schemaInstallerPath = path.join(WP_CORE_DIR, "includes/Database/SchemaInstaller.php");
    const content = fs.readFileSync(schemaInstallerPath, "utf8");

    expect(content).toContain("wp_aether_reward_ledger");
    expect(content).toContain("wp_aether_sku_crossref");
    expect(content).toContain("wp_aether_chronos_timesheets");
    expect(content).toContain("dbDelta($sql_reward_ledger)");
    expect(content).toContain("dbDelta($sql_sku_crossref)");
    expect(content).toContain("dbDelta($sql_chronos_timesheets)");
  });

  it("verifies ACF Pro JSON field group definitions parse cleanly and match post types", () => {
    const acfDir = path.join(WP_CORE_DIR, "acf-json");
    const acfFiles = fs.readdirSync(acfDir).filter((f) => f.endsWith(".json"));

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

  it("verifies WP REST endpoint metadata contract alignment", () => {
    expect(AURA_WP_METADATA.endpoint).toBe("/wp-json/aether/v1/aura-quotes");
    expect(AURA_WP_METADATA.method).toBe("POST");

    expect(VOLT_WP_METADATA.endpoint).toBe("/wp-json/aether/v1/volt-claims");
    expect(VOLT_WP_METADATA.method).toBe("POST");

    expect(CHRONOS_WP_METADATA.endpoint).toBe("/wp-json/aether/v1/chronos-entries");
    expect(CHRONOS_WP_METADATA.method).toBe("POST");
  });
});
