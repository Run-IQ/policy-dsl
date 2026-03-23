// ── Version ──────────────────────────────────────────────────────────────────
export { POLICY_DSL_VERSION } from './version.js';

// ── Values & Expressions ─────────────────────────────────────────────────────
export type { PolicyValue } from './values.js';
export type { PolicyExpression } from './expressions.js';

// ── Actions ──────────────────────────────────────────────────────────────────
export type { PolicyAction } from './actions.js';

// ── Nodes ────────────────────────────────────────────────────────────────────
export type { PolicyNode, PolicyNodeType, FlagReason } from './nodes.js';

// ── Edges ────────────────────────────────────────────────────────────────────
export type { PolicyEdge, PolicyEdgeType } from './edges.js';

// ── Variables ────────────────────────────────────────────────────────────────
export type { PolicyVariable } from './variables.js';

// ── Chunks ───────────────────────────────────────────────────────────────────
export type { DocumentChunk } from './chunks.js';

// ── Graph ────────────────────────────────────────────────────────────────────
export type { PolicyGraph, PolicyGraphMeta, PolicyGraphIndex } from './graph.js';

// ── Reports ──────────────────────────────────────────────────────────────────
export type { ConflictReport, CoverageGap } from './reports.js';

// ── Validation ───────────────────────────────────────────────────────────────
export type {
  PolicyValidationResult,
  PolicyValidationError,
  PolicyValidationWarning,
  FlaggedNode,
} from './validation.js';

// ── Registries ───────────────────────────────────────────────────────────────
export type {
  PolicyEngineModelRegistry,
  PolicyModelDescriptor,
  PolicyBridgeModelRegistry,
  PolicyBridgeModel,
} from './registries.js';

// ── Multi-document (v2) ──────────────────────────────────────────────────────
export type {
  DocumentRole,
  MultiDocumentEntry,
  MultiDocumentResult,
  CrossDocumentConflict,
} from './multi-doc.js';
