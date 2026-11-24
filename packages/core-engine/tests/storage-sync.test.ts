import { afterEach, describe, expect, it } from "vitest";
import { WpRestClient } from "../src/storage/wp-rest-client";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("Dual-Mode WordPress REST Client & Offline Fallback", () => {
  it("falls back cleanly to OFFLINE_LOCAL_CACHE when no WordPress host is configured", async () => {
    const client = new WpRestClient();
    const offlinePayload = { quote_id: 9001, status: "PENDING_SITE_MEASURE" };

    const res = await client.dispatchWithFallback(
      "/wp-json/aether/v1/aura-quotes",
      "POST",
      { postcode: "2088" },
      offlinePayload,
      { appKey: "aurabuild" }
    );

    expect(res.mode).toBe("OFFLINE_LOCAL_CACHE");
    expect(res.data).toEqual(offlinePayload);
    expect(client.getLastSyncTelemetry("aurabuild")?.mode).toBe("OFFLINE_LOCAL_CACHE");
  });

  it("dispatches live WORDPRESS_REST request when apiBaseUrl succeeds", async () => {
    const client = new WpRestClient();
    const livePayload = { success: true, quote_id: 1042, quote_reference: "AURA-GARA-1042" };

    globalThis.fetch = (async (_input: unknown, init?: { headers?: Record<string, string> }) => {
      expect(init?.headers?.["X-WP-Nonce"]).toBe("nonce_abc");
      return {
        ok: true,
        status: 201,
        json: async () => livePayload,
      } as unknown as Response;
    }) as typeof fetch;

    const res = await client.dispatchWithFallback(
      "/wp-json/aether/v1/aura-quotes",
      "POST",
      { postcode: "2088" },
      { success: true, quote_id: 0 },
      {
        appKey: "aurabuild",
        apiBaseUrl: "https://staging.aetherdigital.com.au/wp-json/aether/v1",
        nonce: "nonce_abc",
      }
    );

    expect(res.mode).toBe("WORDPRESS_REST");
    expect(res.status).toBe(201);
    expect(res.data).toEqual(livePayload);
    expect(client.getLastSyncTelemetry("aurabuild")?.status).toBe(201);
  });

  it("gracefully falls back to OFFLINE_LOCAL_CACHE when live fetch rejects", async () => {
    const client = new WpRestClient();
    const fallbackData = { success: true, entry_id: 8841 };

    globalThis.fetch = (async () => {
      throw new Error("Connection refused");
    }) as typeof fetch;

    const res = await client.dispatchWithFallback(
      "/wp-json/aether/v1/chronos-entries",
      "POST",
      { project_id: 102 },
      fallbackData,
      {
        appKey: "chronosflow",
        apiBaseUrl: "http://127.0.0.1:9999/wp-json/aether/v1",
        timeoutMs: 200,
      }
    );

    expect(res.mode).toBe("OFFLINE_LOCAL_CACHE");
    expect(res.data).toEqual(fallbackData);
    expect(res.fallbackReason).toContain("Connection refused");
  });
});
