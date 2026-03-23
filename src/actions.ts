import type { PolicyValue } from './values.js';

/**
 * PolicyAction — what a rule produces (graph-side).
 *
 * IMPORTANT: PolicyAction is NOT stored in Rule (@run-iq/core).
 * Rule = { id, model, params, condition? } — no outputs or explicit action.
 * model.calculate(params, input) produces the results.
 *
 * PolicyAction is used for:
 *   1. Edge construction in PolicyGraphBuilder
 *   2. Visualization in the platform
 *   3. DGGraph port construction in policy-bridge
 */
export type PolicyAction =
  | { type: 'SET'; output: string; value: PolicyValue }
  | { type: 'COMPUTE'; output: string; value: PolicyValue }
  | { type: 'QUALIFY'; output: string; value: PolicyValue }
  | { type: 'REJECT'; output: string; reason: string };
