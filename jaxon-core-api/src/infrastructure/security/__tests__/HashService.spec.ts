import { describe, it, expect } from 'vitest';
import { HashService } from '../HashService.js';

describe('HashService', () => {
  it('should produce deterministic hash for same payload with different key order', () => {
    const prevHash = 'a'.repeat(64);
    const actionType = 'UPDATE';
    const actorId = 'user-1';

    const payloadA = { b: 2, a: 1, nested: { z: 3, y: 2 } };
    const payloadB = { a: 1, nested: { y: 2, z: 3 }, b: 2 };

    const hashA = HashService.chain(prevHash, actionType, actorId, payloadA);
    const hashB = HashService.chain(prevHash, actionType, actorId, payloadB);

    expect(hashA).toBe(hashB);
  });

  it('should normalize Date values to ISO strings', () => {
    const prevHash = 'b'.repeat(64);
    const actionType = 'CREATE';
    const actorId = 'user-2';

    const date = new Date('2025-01-02T03:04:05.000Z');
    const payloadA = { when: date };
    const payloadB = { when: date.toISOString() };

    const hashA = HashService.chain(prevHash, actionType, actorId, payloadA);
    const hashB = HashService.chain(prevHash, actionType, actorId, payloadB);

    expect(hashA).toBe(hashB);
  });

  it('should change hash when action or actor changes', () => {
    const prevHash = 'c'.repeat(64);
    const payload = { x: 1 };

    const hashA = HashService.chain(prevHash, 'CREATE', 'user-1', payload);
    const hashB = HashService.chain(prevHash, 'UPDATE', 'user-1', payload);
    const hashC = HashService.chain(prevHash, 'CREATE', 'user-2', payload);

    expect(hashA).not.toBe(hashB);
    expect(hashA).not.toBe(hashC);
  });
});
