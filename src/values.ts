/**
 * A value reference in a PolicyExpression.
 *
 * VAR — references a variable from the evaluation context by path.
 * CONST — a literal value (string, number, or boolean).
 *
 * Convention for dates:
 * Date values MUST be UNIX timestamps in milliseconds (number).
 * Never ISO 8601 strings — JSONLogic compares strings lexicographically,
 * which breaks on non-padded date strings.
 */
export type PolicyValue =
  | { type: 'VAR'; path: string }
  | { type: 'CONST'; value: string | number | boolean };
