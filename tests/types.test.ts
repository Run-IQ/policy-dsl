import { describe, it, expect } from 'vitest';
import type {
  PolicyExpression,
  PolicyValue,
  PolicyAction,
  PolicyNode,
  PolicyNodeType,
  FlagReason,
  PolicyEdge,
  PolicyEdgeType,
  PolicyVariable,
  DocumentChunk,
  PolicyGraph,
  PolicyGraphMeta,
  PolicyGraphIndex,
  ConflictReport,
  CoverageGap,
  PolicyValidationResult,
  PolicyValidationError,
  PolicyValidationWarning,
  FlaggedNode,
  PolicyEngineModelRegistry,
  PolicyModelDescriptor,
  PolicyBridgeModelRegistry,
  PolicyBridgeModel,
  DocumentRole,
  MultiDocumentEntry,
  MultiDocumentResult,
  CrossDocumentConflict,
} from '../src/index.js';

describe('PolicyValue', () => {
  it('supports VAR variant', () => {
    const v: PolicyValue = { type: 'VAR', path: 'income' };
    expect(v.type).toBe('VAR');
  });

  it('supports CONST variant', () => {
    const v: PolicyValue = { type: 'CONST', value: 42 };
    expect(v.type).toBe('CONST');
  });
});

describe('PolicyExpression — 15 variants', () => {
  const left: PolicyValue = { type: 'VAR', path: 'x' };
  const right: PolicyValue = { type: 'CONST', value: 10 };

  it('AND', () => {
    const e: PolicyExpression = {
      type: 'AND',
      left: { type: 'GT', left, right },
      right: { type: 'LT', left, right },
    };
    expect(e.type).toBe('AND');
  });

  it('OR', () => {
    const e: PolicyExpression = {
      type: 'OR',
      left: { type: 'GT', left, right },
      right: { type: 'LT', left, right },
    };
    expect(e.type).toBe('OR');
  });

  it('NOT', () => {
    const e: PolicyExpression = { type: 'NOT', expr: { type: 'GT', left, right } };
    expect(e.type).toBe('NOT');
  });

  it('GT', () => {
    const e: PolicyExpression = { type: 'GT', left, right };
    expect(e.type).toBe('GT');
  });

  it('GTE', () => {
    const e: PolicyExpression = { type: 'GTE', left, right };
    expect(e.type).toBe('GTE');
  });

  it('LT', () => {
    const e: PolicyExpression = { type: 'LT', left, right };
    expect(e.type).toBe('LT');
  });

  it('LTE', () => {
    const e: PolicyExpression = { type: 'LTE', left, right };
    expect(e.type).toBe('LTE');
  });

  it('EQ', () => {
    const e: PolicyExpression = { type: 'EQ', left, right };
    expect(e.type).toBe('EQ');
  });

  it('NEQ', () => {
    const e: PolicyExpression = { type: 'NEQ', left, right };
    expect(e.type).toBe('NEQ');
  });

  it('BETWEEN', () => {
    const e: PolicyExpression = {
      type: 'BETWEEN',
      value: left,
      min: { type: 'CONST', value: 0 },
      max: { type: 'CONST', value: 100 },
    };
    expect(e.type).toBe('BETWEEN');
  });

  it('IN', () => {
    const e: PolicyExpression = {
      type: 'IN',
      value: left,
      set: [
        { type: 'CONST', value: 'A' },
        { type: 'CONST', value: 'B' },
      ],
    };
    expect(e.type).toBe('IN');
  });

  it('NOT_IN', () => {
    const e: PolicyExpression = {
      type: 'NOT_IN',
      value: left,
      set: [{ type: 'CONST', value: 'X' }],
    };
    expect(e.type).toBe('NOT_IN');
  });

  it('BEFORE', () => {
    const e: PolicyExpression = {
      type: 'BEFORE',
      value: { type: 'VAR', path: 'date' },
      date: { type: 'CONST', value: 1706745600000 },
    };
    expect(e.type).toBe('BEFORE');
  });

  it('AFTER', () => {
    const e: PolicyExpression = {
      type: 'AFTER',
      value: { type: 'VAR', path: 'date' },
      date: { type: 'CONST', value: 1706745600000 },
    };
    expect(e.type).toBe('AFTER');
  });

  it('EXISTS', () => {
    const e: PolicyExpression = { type: 'EXISTS', variable: 'income' };
    expect(e.type).toBe('EXISTS');
  });

  it('MISSING', () => {
    const e: PolicyExpression = { type: 'MISSING', variable: 'income' };
    expect(e.type).toBe('MISSING');
  });

  it('RULE_REF', () => {
    const e: PolicyExpression = { type: 'RULE_REF', ruleId: 'rule_42' };
    expect(e.type).toBe('RULE_REF');
  });
});

describe('PolicyAction — 4 variants', () => {
  it('SET', () => {
    const a: PolicyAction = {
      type: 'SET',
      output: 'taxRate',
      value: { type: 'CONST', value: 0.18 },
    };
    expect(a.type).toBe('SET');
  });

  it('COMPUTE', () => {
    const a: PolicyAction = {
      type: 'COMPUTE',
      output: 'tax',
      value: { type: 'VAR', path: 'income' },
    };
    expect(a.type).toBe('COMPUTE');
  });

  it('QUALIFY', () => {
    const a: PolicyAction = {
      type: 'QUALIFY',
      output: 'status',
      value: { type: 'CONST', value: 'exempt' },
    };
    expect(a.type).toBe('QUALIFY');
  });

  it('REJECT', () => {
    const a: PolicyAction = {
      type: 'REJECT',
      output: 'application',
      reason: 'income below threshold',
    };
    expect(a.type).toBe('REJECT');
  });
});

describe('PolicyNode', () => {
  const baseNode: PolicyNode = {
    id: 'node_1',
    type: 'Rule',
    label: 'IRPP base rate',
    condition: {
      type: 'GT',
      left: { type: 'VAR', path: 'income' },
      right: { type: 'CONST', value: 0 },
    },
    action: { type: 'COMPUTE', output: 'tax', value: { type: 'VAR', path: 'income' } },
    sourceRef: 'art_47_segment_1',
    confidence: 0.95,
    extractedBy: 'llm-v1',
  };

  it('Mode 1 — without model/params', () => {
    expect(baseNode.model).toBeUndefined();
    expect(baseNode.params).toBeUndefined();
  });

  it('Mode 2 — with model/params', () => {
    const mode2: PolicyNode = {
      ...baseNode,
      model: 'PROGRESSIVE_BRACKET',
      params: { base: 'income', brackets: [{ from: 0, to: 900000, rate: 0 }] },
    };
    expect(mode2.model).toBe('PROGRESSIVE_BRACKET');
    expect(mode2.params).toBeDefined();
  });

  it('supports flagged nodes', () => {
    const flagged: PolicyNode = {
      ...baseNode,
      flagged: true,
      flagReason: 'LOW_CONFIDENCE',
      confidence: 0.6,
    };
    expect(flagged.flagged).toBe(true);
    expect(flagged.flagReason).toBe('LOW_CONFIDENCE');
  });
});

describe('PolicyNodeType — 5 variants', () => {
  it('covers all variants', () => {
    const types: PolicyNodeType[] = ['Rule', 'Exception', 'Definition', 'Reference', 'Threshold'];
    expect(types).toHaveLength(5);
  });
});

describe('FlagReason — 9 variants', () => {
  it('covers all variants', () => {
    const reasons: FlagReason[] = [
      'LOW_CONFIDENCE',
      'UNSUPPORTED_OPERATOR',
      'UNDECLARED_VARIABLE',
      'INVALID_SCHEMA',
      'UNRESOLVABLE_REFERENCE',
      'POTENTIAL_CYCLE',
      'AMBIGUOUS_CONDITION',
      'NO_MODEL_FOUND',
      'INVALID_PARAMS',
    ];
    expect(reasons).toHaveLength(9);
  });
});

describe('PolicyEdge', () => {
  it('satisfies the type', () => {
    const edge: PolicyEdge = {
      id: 'edge_1',
      from: 'node_1',
      to: 'node_2',
      type: 'REQUIRES',
    };
    expect(edge.type).toBe('REQUIRES');
  });

  it('supports crossDocument flag', () => {
    const edge: PolicyEdge = {
      id: 'edge_2',
      from: 'node_1',
      to: 'node_3',
      type: 'MODIFIES',
      crossDocument: true,
    };
    expect(edge.crossDocument).toBe(true);
  });
});

describe('PolicyEdgeType — 7 variants', () => {
  it('covers all variants', () => {
    const types: PolicyEdgeType[] = [
      'REQUIRES',
      'OVERRIDES',
      'REFINES',
      'CONFLICTS_WITH',
      'DEPENDS_ON',
      'EXCEPTION_OF',
      'MODIFIES',
    ];
    expect(types).toHaveLength(7);
  });
});

describe('PolicyVariable', () => {
  it('satisfies the type', () => {
    const v: PolicyVariable = {
      name: 'income',
      type: 'number',
      unit: 'XOF',
      description: 'Annual taxable income',
      sourceRef: 'art_1_segment_1',
      required: true,
    };
    expect(v.name).toBe('income');
  });

  it('supports enum variant', () => {
    const v: PolicyVariable = {
      name: 'status',
      type: 'enum',
      enumValues: ['single', 'married'],
      description: 'Marital status',
      sourceRef: 'art_2_segment_1',
      required: true,
    };
    expect(v.enumValues).toHaveLength(2);
  });
});

describe('DocumentChunk', () => {
  it('satisfies the type', () => {
    const c: DocumentChunk = {
      id: 'art_47_segment_1',
      text: 'Article 47 — Original text',
      cleanedText: 'Article 47 cleaned',
    };
    expect(c.id).toBe('art_47_segment_1');
  });
});

describe('PolicyGraphMeta', () => {
  it('satisfies the type with integrated mode', () => {
    const meta: PolicyGraphMeta = {
      id: 'graph_2',
      version: '1.0.0',
      dslVersion: '1.0.0',
      title: 'Test Document',
      domain: 'fiscal',
      language: 'fr',
      mode: 'integrated',
      source: {
        filename: 'test.pdf',
        type: 'pdf',
        hash: 'def456',
        ingestedAt: '2025-06-01T00:00:00Z',
      },
      confidence: 0.88,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z',
    };
    expect(meta.mode).toBe('integrated');
  });
});

describe('PolicyGraphIndex', () => {
  it('satisfies the type', () => {
    const index: PolicyGraphIndex = {
      byType: { Rule: ['n1'], Exception: [], Definition: [], Reference: [], Threshold: [] },
      bySource: { art_1: ['n1'] },
      conflicts: [],
      gaps: [],
      crossDocumentEdges: ['edge_1'],
    };
    expect(index.byType.Rule).toHaveLength(1);
    expect(index.crossDocumentEdges).toHaveLength(1);
  });
});

describe('PolicyGraph', () => {
  it('satisfies the full type', () => {
    const graph: PolicyGraph = {
      meta: {
        id: 'graph_1',
        version: '1.0.0',
        dslVersion: '1.0.0',
        title: 'CGI Togo 2025',
        domain: 'fiscal',
        language: 'fr',
        mode: 'standalone',
        source: {
          filename: 'cgi-togo-2025.pdf',
          type: 'pdf',
          hash: 'abc123',
          ingestedAt: '2025-01-01T00:00:00Z',
          pageCount: 200,
        },
        confidence: 0.92,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      nodes: [],
      edges: [],
      variables: [],
      chunks: [],
      index: {
        byType: { Rule: [], Exception: [], Definition: [], Reference: [], Threshold: [] },
        bySource: {},
        conflicts: [],
        gaps: [],
      },
    };
    expect(graph.meta.mode).toBe('standalone');
    expect(graph.nodes).toHaveLength(0);
  });
});

describe('ConflictReport', () => {
  it('satisfies the type', () => {
    const r: ConflictReport = {
      nodeId1: 'n1',
      nodeId2: 'n2',
      type: 'contradictory_conditions',
      description: 'Two rules conflict',
      severity: 'critical',
    };
    expect(r.severity).toBe('critical');
  });
});

describe('CoverageGap', () => {
  it('satisfies the type', () => {
    const g: CoverageGap = {
      description: 'No rule covers income between 0-500000',
      affectedNodes: ['n1'],
      severity: 'warning',
    };
    expect(g.affectedNodes).toHaveLength(1);
  });
});

describe('PolicyValidationResult', () => {
  it('satisfies the type', () => {
    const r: PolicyValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      flagged: [],
    };
    expect(r.valid).toBe(true);
  });

  it('with errors', () => {
    const err: PolicyValidationError = {
      nodeId: 'n1',
      field: 'condition',
      message: 'Invalid expression',
      code: 'INVALID_EXPR',
    };
    const warn: PolicyValidationWarning = {
      nodeId: 'n1',
      field: 'confidence',
      message: 'Low confidence',
      code: 'LOW_CONF',
    };
    const flagged: FlaggedNode = {
      nodeId: 'n1',
      reason: 'LOW_CONFIDENCE',
      confidence: 0.5,
      sourceRef: 'art_1_segment_1',
    };
    const r: PolicyValidationResult = {
      valid: false,
      errors: [err],
      warnings: [warn],
      flagged: [flagged],
    };
    expect(r.errors).toHaveLength(1);
    expect(r.warnings).toHaveLength(1);
    expect(r.flagged).toHaveLength(1);
  });
});

describe('PolicyEngineModelRegistry', () => {
  it('list() returns descriptors', () => {
    const registry: PolicyEngineModelRegistry = {
      list: () => [
        {
          name: 'FLAT_RATE',
          description: 'Flat rate calculation',
          params: {
            rate: { type: 'number', description: 'The tax rate' },
            base: { type: 'string', description: 'Input field name' },
          },
        } satisfies PolicyModelDescriptor,
      ],
    };
    expect(registry.list()).toHaveLength(1);
    expect(registry.list()[0]?.name).toBe('FLAT_RATE');
  });
});

describe('PolicyBridgeModelRegistry', () => {
  it('get() and getAll()', () => {
    const model: PolicyBridgeModel = {
      name: 'FLAT_RATE',
      validateParams: (_params: unknown) => ({ valid: true }),
    };
    const registry: PolicyBridgeModelRegistry = {
      get: (name: string) => (name === 'FLAT_RATE' ? model : null),
      getAll: () => new Map([['FLAT_RATE', model]]),
    };
    expect(registry.get('FLAT_RATE')).not.toBeNull();
    expect(registry.get('UNKNOWN')).toBeNull();
    expect(registry.getAll().size).toBe(1);
  });
});

describe('Multi-document types', () => {
  it('DocumentRole covers 4 variants', () => {
    const roles: DocumentRole[] = ['primary', 'amendment', 'override', 'supplement'];
    expect(roles).toHaveLength(4);
  });

  it('MultiDocumentEntry satisfies the type', () => {
    const entry: MultiDocumentEntry = {
      id: 'doc_1',
      filename: 'cgi.pdf',
      type: 'pdf',
      content: 'raw content',
      role: 'primary',
    };
    expect(entry.role).toBe('primary');
  });

  it('MultiDocumentResult satisfies the type', () => {
    const result: MultiDocumentResult = {
      graph: {
        meta: {
          id: 'g1',
          version: '1.0.0',
          dslVersion: '1.0.0',
          title: 'Merged',
          domain: 'fiscal',
          language: 'fr',
          mode: 'standalone',
          source: {
            filename: 'a.pdf',
            type: 'pdf',
            hash: 'h1',
            ingestedAt: '2025-01-01T00:00:00Z',
          },
          confidence: 0.9,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        nodes: [],
        edges: [],
        variables: [],
        chunks: [],
        index: {
          byType: { Rule: [], Exception: [], Definition: [], Reference: [], Threshold: [] },
          bySource: {},
          conflicts: [],
          gaps: [],
        },
      },
      perDoc: [],
      conflicts: [],
    };
    expect(result.perDoc).toHaveLength(0);
  });

  it('CrossDocumentConflict satisfies the type', () => {
    const conflict: CrossDocumentConflict = {
      nodeId1: 'n1',
      docId1: 'doc1',
      nodeId2: 'n2',
      docId2: 'doc2',
      resolution: 'overridden',
      description: 'Amendment overrides primary',
    };
    expect(conflict.resolution).toBe('overridden');
  });
});
