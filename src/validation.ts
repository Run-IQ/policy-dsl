import type { PolicyNode } from './nodes.js';
import type { FlagReason } from './nodes.js';

export interface PolicyValidationResult {
  valid: boolean;
  errors: PolicyValidationError[];
  warnings: PolicyValidationWarning[];
  flagged: FlaggedNode[];
  skipped?: boolean;
  node?: PolicyNode;
}

export interface PolicyValidationError {
  nodeId: string;
  field: string;
  message: string;
  code: string;
}

export interface PolicyValidationWarning {
  nodeId: string;
  field: string;
  message: string;
  code: string;
}

export interface FlaggedNode {
  nodeId: string;
  reason: FlagReason;
  confidence: number;
  sourceRef: string;
}
