import type { PolicyNode, PolicyNodeType } from './nodes.js';
import type { PolicyEdge } from './edges.js';
import type { PolicyVariable } from './variables.js';
import type { DocumentChunk } from './chunks.js';
import type { ConflictReport, CoverageGap } from './reports.js';
import type { DocumentRole } from './multi-doc.js';

export interface PolicyGraph {
  meta: PolicyGraphMeta;
  nodes: PolicyNode[];
  edges: PolicyEdge[];
  variables: PolicyVariable[];
  chunks: DocumentChunk[];
  index: PolicyGraphIndex;
}

export interface PolicyGraphMeta {
  id: string;
  version: string;
  dslVersion: string;
  title: string;
  domain: string;
  language: string;
  /** Mode 1 = standalone, Mode 2 = integrated with Run-IQ. */
  mode: 'standalone' | 'integrated';
  source: {
    filename: string;
    type: 'pdf' | 'docx' | 'text' | 'excel' | 'html';
    hash: string;
    ingestedAt: string;
    pageCount?: number;
  };

  /** Multi-document (v2). Lists sources when multiple documents are ingested together. */
  sources?: Array<{
    id: string;
    filename: string;
    role: DocumentRole;
    hash: string;
  }>;

  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyGraphIndex {
  byType: Record<PolicyNodeType, string[]>;
  bySource: Record<string, string[]>;
  conflicts: ConflictReport[];
  gaps: CoverageGap[];

  /** Multi-document (v2). IDs of cross-document edges. */
  crossDocumentEdges?: string[];
}
