import type { PolicyValue } from './values.js';

/**
 * PolicyExpression — the core AST of the PolicyDSL.
 *
 * v1 operators are chosen for 100% compilability to JSONLogic without ambiguity.
 * 15 variants covering logic, comparisons, membership, temporal, existence,
 * and linear rule references.
 */
export type PolicyExpression =
  // Logic
  | { type: 'AND'; left: PolicyExpression; right: PolicyExpression }
  | { type: 'OR'; left: PolicyExpression; right: PolicyExpression }
  | { type: 'NOT'; expr: PolicyExpression }

  // Comparisons
  | { type: 'GT'; left: PolicyValue; right: PolicyValue }
  | { type: 'GTE'; left: PolicyValue; right: PolicyValue }
  | { type: 'LT'; left: PolicyValue; right: PolicyValue }
  | { type: 'LTE'; left: PolicyValue; right: PolicyValue }
  | { type: 'EQ'; left: PolicyValue; right: PolicyValue }
  | { type: 'NEQ'; left: PolicyValue; right: PolicyValue }

  // Membership
  | { type: 'BETWEEN'; value: PolicyValue; min: PolicyValue; max: PolicyValue }
  | { type: 'IN'; value: PolicyValue; set: PolicyValue[] }
  | { type: 'NOT_IN'; value: PolicyValue; set: PolicyValue[] }

  // Temporal (UNIX timestamps in ms)
  | { type: 'BEFORE'; value: PolicyValue; date: PolicyValue }
  | { type: 'AFTER'; value: PolicyValue; date: PolicyValue }

  // Existence
  | { type: 'EXISTS'; variable: string }
  | { type: 'MISSING'; variable: string }

  // Linear rule reference (cycles detected at compilation by policy-bridge)
  | { type: 'RULE_REF'; ruleId: string };
