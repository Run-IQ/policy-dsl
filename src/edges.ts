export interface PolicyEdge {
  id: string;
  from: string;
  to: string;
  type: PolicyEdgeType;
  /** true if the two nodes come from different documents. */
  crossDocument?: boolean;
  meta?: Record<string, unknown>;
}

export type PolicyEdgeType =
  | 'REQUIRES'
  | 'OVERRIDES'
  | 'REFINES'
  | 'CONFLICTS_WITH'
  | 'DEPENDS_ON'
  | 'EXCEPTION_OF'
  | 'MODIFIES';
