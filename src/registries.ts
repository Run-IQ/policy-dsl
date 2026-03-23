// ── For policy-engine (optional injection — Mode 2 only) ─────────────────────

/**
 * Lightweight interface for policy-engine.
 * Describes available models to guide the LLM.
 * The host maps from the real ModelRegistry of the Core.
 *
 * OPTIONAL: if absent → Mode 1 (standalone)
 *           if present → Mode 2 (integrated Run-IQ)
 */
export interface PolicyEngineModelRegistry {
  /** Lists all available models with their description. */
  list(): PolicyModelDescriptor[];
}

export interface PolicyModelDescriptor {
  /**
   * Model ID — must match exactly the name registered
   * in the Core's ModelRegistry.
   */
  name: string;

  /** Human-readable description for the LLM. */
  description: string;

  /**
   * Expected params structure.
   * From model.describeParams() of the Core.
   */
  params: Record<string, { type: string; description: string }>;
}

// ── For policy-bridge (mandatory injection — Mode 2) ─────────────────────────

/**
 * Lightweight interface for policy-bridge.
 * Enables deterministic validation of extracted params.
 * The host maps from the real ModelRegistry of the Core.
 *
 * MANDATORY for policy-bridge — it only works in Mode 2.
 */
export interface PolicyBridgeModelRegistry {
  /** Gets a model by its ID. Returns null if not registered. */
  get(modelName: string): PolicyBridgeModel | null;

  /** Lists all available models. */
  getAll(): ReadonlyMap<string, PolicyBridgeModel>;
}

export interface PolicyBridgeModel {
  name: string;

  /**
   * Validates params extracted by the LLM.
   * Corresponds to model.validateParams() of the plugin.
   * Returns { valid, errors } — deterministic.
   */
  validateParams(params: unknown): { valid: boolean; errors?: string[] };
}
