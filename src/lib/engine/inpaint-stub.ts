/**
 * Plan-1 stub: pretends to inpaint each pick into the user's photo, but
 * actually just returns the original photo URL for every pick. Plan 3
 * replaces this with a real Gemini 2.5 Flash image call behind the same
 * input/output contract.
 *
 * The stub introduces a small synthetic delay so the mobile app's
 * "streaming in" UX (Plan 2) can be developed against realistic timing.
 */
export async function runInpaintStubs(
  photoUrl: string,
  skus: string[],
  options: { syntheticDelayMs?: number } = {}
): Promise<Record<string, string>> {
  const delay = options.syntheticDelayMs ?? 0;
  if (delay > 0) await new Promise(r => setTimeout(r, delay));
  return Object.fromEntries(skus.map(s => [s, photoUrl]));
}
