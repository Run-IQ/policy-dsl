export interface ConflictReport {
  nodeId1: string;
  nodeId2: string;
  type: 'contradictory_conditions' | 'overlapping_coverage' | 'duplicate';
  description: string;
  severity: 'warning' | 'critical';
  crossDocument?: boolean;
}

export interface CoverageGap {
  description: string;
  affectedNodes: string[];
  severity: 'warning' | 'critical';
}
