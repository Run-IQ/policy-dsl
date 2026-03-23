import { describe, it, expect } from 'vitest';
import { POLICY_DSL_VERSION } from '../src/index.js';

describe('POLICY_DSL_VERSION', () => {
  it('should be 1.0.0', () => {
    expect(POLICY_DSL_VERSION).toBe('1.0.0');
  });

  it('should be a string', () => {
    expect(typeof POLICY_DSL_VERSION).toBe('string');
  });
});
