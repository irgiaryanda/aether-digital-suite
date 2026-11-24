export type TransportMode = "WORDPRESS_REST" | "OFFLINE_LOCAL_CACHE";

export interface WpSyncTelemetry {
  appKey: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  mode: TransportMode;
  status: number;
  latencyMs: number;
  timestamp: string;
  fallbackReason?: string;
}

export interface WpDispatchResult<TResponse> {
  mode: TransportMode;
  status: number;
  latencyMs: number;
  endpoint: string;
  data: TResponse;
  fallbackReason?: string;
}

export interface WpDispatchOptions {
  apiBaseUrl?: string;
  nonce?: string;
  timeoutMs?: number;
  appKey?: string;
}

interface AetherWindowSettings {
  root?: string;
  nonce?: string;
}

export class WpRestClient {
  private lastByApp = new Map<string, WpSyncTelemetry>();
  private history: WpSyncTelemetry[] = [];

  private resolveWpSettings(options?: WpDispatchOptions): { root: string | null; nonce: string | null } {
    if (options?.apiBaseUrl) {
      return {
        root: options.apiBaseUrl.replace(/\/+$/, ""),
        nonce: options.nonce ?? null,
      };
    }

    if (typeof window !== "undefined") {
      const settings = (window as unknown as { AetherSettings?: AetherWindowSettings }).AetherSettings;
      if (settings?.root) {
        return {
          root: settings.root.replace(/\/+$/, ""),
          nonce: options?.nonce ?? settings.nonce ?? null,
        };
      }
    }

    return { root: null, nonce: null };
  }

  private buildUrl(root: string, endpoint: string): string {
    if (endpoint.startsWith("/wp-json/aether/v1") && root.endsWith("/wp-json/aether/v1")) {
      const suffix = endpoint.slice("/wp-json/aether/v1".length);
      return `${root}${suffix}`;
    }
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    if (root.includes("/wp-json/") && cleanEndpoint.startsWith("/wp-json/")) {
      return `${new URL(root).origin}${cleanEndpoint}`;
    }
    return `${root}${cleanEndpoint}`;
  }

  private recordTelemetry(telemetry: WpSyncTelemetry): void {
    this.lastByApp.set(telemetry.appKey, telemetry);
    this.history = [telemetry, ...this.history].slice(0, 20);
  }

  public getLastSyncTelemetry(appKey?: string): WpSyncTelemetry | null {
    if (appKey) {
      return this.lastByApp.get(appKey) ?? null;
    }
    return this.history[0] ?? null;
  }

  public getSyncHistory(): WpSyncTelemetry[] {
    return [...this.history];
  }

  public async dispatchWithFallback<TRequest, TResponse>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    payload: TRequest | null,
    offlineResult: TResponse,
    options?: WpDispatchOptions
  ): Promise<WpDispatchResult<TResponse>> {
    const startMs = Date.now();
    const appKey = options?.appKey ?? "default";
    const { root, nonce } = this.resolveWpSettings(options);

    if (!root || typeof fetch !== "function") {
      const latencyMs = Math.max(1, Date.now() - startMs);
      const telemetry: WpSyncTelemetry = {
        appKey,
        endpoint,
        method,
        mode: "OFFLINE_LOCAL_CACHE",
        status: 200,
        latencyMs,
        timestamp: new Date().toISOString(),
        fallbackReason: "Standalone edge runtime without live WordPress host",
      };
      this.recordTelemetry(telemetry);
      return {
        mode: telemetry.mode,
        status: telemetry.status,
        latencyMs,
        endpoint,
        data: offlineResult,
        fallbackReason: telemetry.fallbackReason,
      };
    }

    const timeoutMs = options?.timeoutMs ?? 800;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      const targetUrl = this.buildUrl(root, endpoint);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (nonce) {
        headers["X-WP-Nonce"] = nonce;
      }

      const response = await fetch(targetUrl, {
        method,
        headers,
        body: method === "GET" || payload === null ? undefined : JSON.stringify(payload),
        signal: controller?.signal,
      });

      if (timer) clearTimeout(timer);

      const latencyMs = Math.max(1, Date.now() - startMs);
      if (!response.ok) {
        const telemetry: WpSyncTelemetry = {
          appKey,
          endpoint,
          method,
          mode: "OFFLINE_LOCAL_CACHE",
          status: response.status,
          latencyMs,
          timestamp: new Date().toISOString(),
          fallbackReason: `HTTP ${response.status} fallback to local storage`,
        };
        this.recordTelemetry(telemetry);
        return {
          mode: "OFFLINE_LOCAL_CACHE",
          status: response.status,
          latencyMs,
          endpoint,
          data: offlineResult,
          fallbackReason: telemetry.fallbackReason,
        };
      }

      const parsed = (await response.json()) as TResponse;
      const telemetry: WpSyncTelemetry = {
        appKey,
        endpoint,
        method,
        mode: "WORDPRESS_REST",
        status: response.status,
        latencyMs,
        timestamp: new Date().toISOString(),
      };
      this.recordTelemetry(telemetry);

      return {
        mode: "WORDPRESS_REST",
        status: response.status,
        latencyMs,
        endpoint,
        data: parsed,
      };
    } catch (err) {
      if (timer) clearTimeout(timer);
      const latencyMs = Math.max(1, Date.now() - startMs);
      const reason = err instanceof Error ? err.message : "Network timeout";
      const telemetry: WpSyncTelemetry = {
        appKey,
        endpoint,
        method,
        mode: "OFFLINE_LOCAL_CACHE",
        status: 200,
        latencyMs,
        timestamp: new Date().toISOString(),
        fallbackReason: reason,
      };
      this.recordTelemetry(telemetry);

      return {
        mode: "OFFLINE_LOCAL_CACHE",
        status: 200,
        latencyMs,
        endpoint,
        data: offlineResult,
        fallbackReason: reason,
      };
    }
  }
}

export const wpRestClient = new WpRestClient();
