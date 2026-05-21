import { WalmartCatalogSource } from "./sources/walmart";
import { EbayCatalogSource } from "./sources/ebay";
import { NoopAvailabilityChecker } from "./availability";
import type { AvailabilityChecker, AvailabilityResult } from "./availability";
import type { Pick } from "./types";

interface Config {
  walmartConsumerId?: string;
  walmartPrivateKey?: string;
  ebayClientId?: string;
  ebayClientSecret?: string;
}

export class LiveAvailabilityChecker implements AvailabilityChecker {
  readonly providerName = "live";
  private readonly walmart: WalmartCatalogSource | null;
  private readonly ebay: EbayCatalogSource | null;

  constructor(cfg: Config) {
    this.walmart = cfg.walmartConsumerId && cfg.walmartPrivateKey
      ? new WalmartCatalogSource({ consumerId: cfg.walmartConsumerId, privateKey: cfg.walmartPrivateKey })
      : null;
    this.ebay = cfg.ebayClientId && cfg.ebayClientSecret
      ? new EbayCatalogSource({ clientId: cfg.ebayClientId, clientSecret: cfg.ebayClientSecret })
      : null;
  }

  async verify(picks: Pick[]): Promise<AvailabilityResult> {
    const checks = await Promise.all(picks.map(async (p) => {
      const sku = p.sku;
      if (sku.startsWith("walmart-") && this.walmart) {
        return { pick: p, available: await this.walmart.isAvailable(sku).catch(() => true) };
      }
      if (sku.startsWith("ebay-") && this.ebay) {
        return { pick: p, available: await this.ebay.isAvailable(sku).catch(() => true) };
      }
      return { pick: p, available: true };
    }));
    return {
      available: checks.filter((c) => c.available).map((c) => c.pick),
      unavailable: checks.filter((c) => !c.available).map((c) => c.pick),
    };
  }
}

let cached: AvailabilityChecker | null = null;

export function getAvailabilityChecker(): AvailabilityChecker {
  if (cached) return cached;
  const hasWalmart = !!(process.env.WALMART_CONSUMER_ID && process.env.WALMART_PRIVATE_KEY);
  const hasEbay = !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
  if (hasWalmart || hasEbay) {
    cached = new LiveAvailabilityChecker({
      walmartConsumerId: process.env.WALMART_CONSUMER_ID,
      walmartPrivateKey: process.env.WALMART_PRIVATE_KEY,
      ebayClientId: process.env.EBAY_CLIENT_ID,
      ebayClientSecret: process.env.EBAY_CLIENT_SECRET,
    });
  } else {
    cached = new NoopAvailabilityChecker();
  }
  return cached;
}

export function _resetAvailabilityCache(): void {
  cached = null;
}
