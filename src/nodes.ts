import type { PolicyExpression } from './expressions.js';
import type { PolicyAction } from './actions.js';
import type { PolicyVariable } from './variables.js';

export interface PolicyNode {
  id: string;
  type: PolicyNodeType;
  label: string;

  /** Condition in PolicyDSL AST. Required for Rule nodes. */
  condition?: PolicyExpression;

  /** Action produced. Required for Rule nodes. */
  action?: PolicyAction;

  // ── Mode 2 only ──────────────────────────────────────────────────────────
  // Present only if ModelRegistry injected into policy-engine.
  // Absent in Mode 1 (standalone).

  /**
   * Run-IQ model ID (e.g. 'PROGRESSIVE_BRACKET', 'FLAT_RATE').
   * Chosen by the LLM from available models.
   * 'UNKNOWN' if the LLM could not identify the model.
   * Absent in Mode 1.
   */
  model?: string;

  /**
   * Model parameters — corresponds to rule.params in @run-iq/core.
   * Structure defined by describeParams() of the target model.
   * Absent in Mode 1.
   */
  params?: unknown;

  // ── Always present ───────────────────────────────────────────────────────

  variables?: PolicyVariable[];
  exceptions?: string[];
  priority?: number;

  /**
   * Reference to the source chunk.
   * Format: '<sectionId>_segment_<N>'
   * CRITICAL for UI: enables O(1) lookup of original text.
   */
  sourceRef: string;

  /** LLM confidence score: 0.0 → 1.0. < 0.80 → flag for human validation. */
  confidence: number;

  extractedBy: 'llm-v1' | 'manual' | 'hybrid';

  /** In Mode 2: if the LLM flagged this node as needing an unsupported v2/v3 operator. */
  flagged?: boolean;
  flagReason?: FlagReason;

  /** Cross-document relations (v2). IDs of nodes in other documents. */
  overrides?: string[];
  /** IDs of nodes that this node amends. */
  modifies?: string[];

  meta?: Record<string, unknown>;
}

export type PolicyNodeType = 'Rule' | 'Exception' | 'Definition' | 'Reference' | 'Threshold';

export type FlagReason =
  | 'LOW_CONFIDENCE'
  | 'UNSUPPORTED_OPERATOR'
  | 'UNDECLARED_VARIABLE'
  | 'INVALID_SCHEMA'
  | 'UNRESOLVABLE_REFERENCE'
  | 'POTENTIAL_CYCLE'
  | 'AMBIGUOUS_CONDITION'
  | 'NO_MODEL_FOUND'
  | 'INVALID_PARAMS';
