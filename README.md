# @run-iq/policy-dsl

The shared types of the Run-IQ policy layer. It defines `PolicyGraph`, the structured form of a policy document: rule nodes with a condition and an action, the edges between them, the variables they use, and the source text each node came from.

The package contains TypeScript types and one constant, `POLICY_DSL_VERSION`. It has no runtime logic and no dependencies.

The other policy packages all speak this format. [`policy-engine`](https://github.com/Run-IQ/policy-engine) builds a `PolicyGraph` from a document, [`policy-graph`](https://github.com/Run-IQ/policy-graph) stores and inspects it, and [`policy-bridge`](https://github.com/Run-IQ/policy-bridge) compiles it into rules for [`core`](https://github.com/Run-IQ/core) and a graph for [`decision-graph`](https://github.com/Run-IQ/decision-graph).

## Install

The package is not on the public npm registry yet. Build it from source:

```bash
git clone https://github.com/Run-IQ/policy-dsl
cd policy-dsl && npm install && npm run build
```

Then add it to your project with `npm install ../policy-dsl`. Requires Node.js 20 or later.

## Example

```ts
import type { PolicyNode } from '@run-iq/policy-dsl';

// "Orders above 500 shipped to FR or BE get free shipping."
const node: PolicyNode = {
  id: 'free_shipping',
  type: 'Rule',
  label: 'Free shipping above 500 for FR and BE',
  condition: {
    type: 'AND',
    left: { type: 'GT', left: { type: 'VAR', path: 'order_total' }, right: { type: 'CONST', value: 500 } },
    right: {
      type: 'IN',
      value: { type: 'VAR', path: 'country' },
      set: [{ type: 'CONST', value: 'FR' }, { type: 'CONST', value: 'BE' }],
    },
  },
  action: { type: 'SET', output: 'shipping_fee', value: { type: 'CONST', value: 0 } },
  sourceRef: 'segment_4',
  confidence: 0.95,
  extractedBy: 'manual',
};
```

## Expressions

A condition is a `PolicyExpression` tree. Values are either `{ type: 'VAR', path }` or `{ type: 'CONST', value }`.

| Group | Operators |
|---|---|
| Logic | `AND`, `OR` (binary: `left`, `right`), `NOT` |
| Comparison | `GT`, `GTE`, `LT`, `LTE`, `EQ`, `NEQ` |
| Membership | `BETWEEN`, `IN`, `NOT_IN` |
| Dates | `BEFORE`, `AFTER`, on Unix timestamps in milliseconds |
| Existence | `EXISTS`, `MISSING` |
| Reference | `RULE_REF`, reuses another rule's condition |

`policy-bridge` compiles all of them to JSONLogic. Actions are `SET`, `COMPUTE`, `QUALIFY` or `REJECT`, each writing to a named `output`.

## Concepts

- **Node**: a `Rule`, `Exception`, `Definition`, `Reference` or `Threshold`. Rule nodes need a condition and an action. Every node has a `sourceRef` pointing to the chunk of text it came from, and a `confidence` between 0 and 1.
- **Edge**: `REQUIRES`, `OVERRIDES`, `REFINES`, `CONFLICTS_WITH`, `DEPENDS_ON`, `EXCEPTION_OF` or `MODIFIES`.
- **Mode**: a graph is `standalone` (conditions and actions only) or `integrated`, where each rule node also names a Run-IQ calculation `model` and its `params`. Only integrated graphs can be compiled.
- **Model registries**: `PolicyEngineModelRegistry` describes the available models to the LLM, and `PolicyBridgeModelRegistry` validates params at compile time. The host implements both from its plugins, so the policy packages do not depend on `@run-iq/core`.

The multi-document types (`DocumentRole`, `MultiDocumentEntry`, `MultiDocumentResult`) are defined, but no package implements them yet.

## License

MIT License. See [LICENSE](LICENSE).
