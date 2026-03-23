import type { PolicyGraph } from './graph.js';

/**
 * Role of a document in a multi-document session.
 * Determines priority during conflict resolution.
 *
 * Priority hierarchy (highest to lowest):
 *   override > amendment > supplement > primary
 */
export type DocumentRole = 'primary' | 'amendment' | 'override' | 'supplement';

/** A document in a multi-document session. */
export interface MultiDocumentEntry {
  id: string;
  filename: string;
  type: 'pdf' | 'docx' | 'text' | 'excel' | 'html';
  content: string | Buffer;
  role: DocumentRole;

  /**
   * Explicit priority — if absent, computed from the role.
   * override: 100, amendment: 10, supplement: 5, primary: 0
   */
  priority?: number;
}

/** Result of a multi-document session. */
export interface MultiDocumentResult {
  /** Unified graph with cross-document relations. */
  graph: PolicyGraph;
  /** Individual graphs before merge. */
  perDoc: PolicyGraph[];
  conflicts: CrossDocumentConflict[];
}

export interface CrossDocumentConflict {
  nodeId1: string;
  docId1: string;
  nodeId2: string;
  docId2: string;
  resolution: 'overridden' | 'merged' | 'flagged';
  description: string;
}
