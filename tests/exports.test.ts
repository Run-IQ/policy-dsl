import { describe, it, expect } from 'vitest';
import * as PolicyDSL from '../src/index.js';

describe('exports', () => {
  it('exports POLICY_DSL_VERSION', () => {
    expect(PolicyDSL.POLICY_DSL_VERSION).toBeDefined();
    expect(typeof PolicyDSL.POLICY_DSL_VERSION).toBe('string');
  });

  it('all type exports are accessible (compile-time check)', () => {
    // This test verifies that all types compile correctly.
    // If any type export is missing, this file will not compile.
    const _typeChecks: {
      value?: import('../src/index.js').PolicyValue;
      expr?: import('../src/index.js').PolicyExpression;
      action?: import('../src/index.js').PolicyAction;
      node?: import('../src/index.js').PolicyNode;
      nodeType?: import('../src/index.js').PolicyNodeType;
      flagReason?: import('../src/index.js').FlagReason;
      edge?: import('../src/index.js').PolicyEdge;
      edgeType?: import('../src/index.js').PolicyEdgeType;
      variable?: import('../src/index.js').PolicyVariable;
      chunk?: import('../src/index.js').DocumentChunk;
      graph?: import('../src/index.js').PolicyGraph;
      graphMeta?: import('../src/index.js').PolicyGraphMeta;
      graphIndex?: import('../src/index.js').PolicyGraphIndex;
      conflict?: import('../src/index.js').ConflictReport;
      gap?: import('../src/index.js').CoverageGap;
      validationResult?: import('../src/index.js').PolicyValidationResult;
      validationError?: import('../src/index.js').PolicyValidationError;
      validationWarning?: import('../src/index.js').PolicyValidationWarning;
      flaggedNode?: import('../src/index.js').FlaggedNode;
      engineRegistry?: import('../src/index.js').PolicyEngineModelRegistry;
      modelDescriptor?: import('../src/index.js').PolicyModelDescriptor;
      bridgeRegistry?: import('../src/index.js').PolicyBridgeModelRegistry;
      bridgeModel?: import('../src/index.js').PolicyBridgeModel;
      docRole?: import('../src/index.js').DocumentRole;
      multiDocEntry?: import('../src/index.js').MultiDocumentEntry;
      multiDocResult?: import('../src/index.js').MultiDocumentResult;
      crossDocConflict?: import('../src/index.js').CrossDocumentConflict;
    } = {};

    // If we reach here, all types are importable
    expect(_typeChecks).toBeDefined();
  });
});
