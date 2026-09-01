import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, hashToken, generateSecureToken } from '../server/utils/crypto.js';
import { validateEmail, validatePassword, validateDisplayName } from '../server/utils/validation.js';

describe('Security & Cryptography Test Suite', () => {
  it('should hash passwords using Argon2id with strong salt', async () => {
    const rawPassword = 'StrongPassword123!';
    const hash1 = await hashPassword(rawPassword);
    const hash2 = await hashPassword(rawPassword);

    assert.ok(hash1.startsWith('$argon2id$'));
    assert.ok(hash2.startsWith('$argon2id$'));
    assert.notStrictEqual(hash1, hash2, 'Salt should ensure different hashes for same password');

    const isValid = await verifyPassword(rawPassword, hash1);
    assert.strictEqual(isValid, true);

    const isInvalid = await verifyPassword('IncorrectPassword123!', hash1);
    assert.strictEqual(isInvalid, false);
  });

  it('should deterministically hash tokens with SHA-256 for fast lookup', () => {
    const token = generateSecureToken();
    const hashA = hashToken(token);
    const hashB = hashToken(token);

    assert.strictEqual(hashA, hashB);
    assert.strictEqual(hashA.length, 64);
  });

  it('should enforce strict password complexity validation', () => {
    assert.strictEqual(validatePassword('ValidPass123!'), true);
    assert.strictEqual(validatePassword('short1!'), false, 'Too short');
    assert.strictEqual(validatePassword('alllowercase123'), false, 'Missing uppercase');
    assert.strictEqual(validatePassword('ALLUPPERCASE123'), false, 'Missing lowercase');
    assert.strictEqual(validatePassword('NoNumbersHere!'), false, 'Missing number');
  });

  it('should validate and sanitize emails properly', () => {
    assert.strictEqual(validateEmail('test@example.com'), true);
    assert.strictEqual(validateEmail('invalid-email'), false);
    assert.strictEqual(validateEmail('@missinguser.com'), false);
    assert.strictEqual(validateEmail(''), false);
  });

  it('should validate display name bounds', () => {
    assert.strictEqual(validateDisplayName('Karachi Traveler'), true);
    assert.strictEqual(validateDisplayName('A'), false, 'Too short');
    assert.strictEqual(validateDisplayName('A'.repeat(101)), false, 'Too long');
  });
});
