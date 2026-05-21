import type { Pick } from "./types";

export interface AvailabilityResult {
  available: Pick[];
  unavailable: Pick[];
}

export interface AvailabilityChecker {
  readonly providerName: string;
  verify(picks: Pick[]): Promise<AvailabilityResult>;
}

export class NoopAvailabilityChecker implements AvailabilityChecker {
  readonly providerName = "noop";
  async verify(picks: Pick[]): Promise<AvailabilityResult> {
    return { available: picks, unavailable: [] };
  }
}
