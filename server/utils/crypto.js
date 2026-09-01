import { hash, verify } from 'argon2';
import { randomBytes, createHash } from 'crypto';

export async function hashPassword(password) {
  return hash(password, {
    type: 2,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(password, hash) {
  return verify(hash, password);
}

export function generateSecureToken(length = 32) {
  return randomBytes(length).toString('hex');
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function generateCsrfToken(length = 32) {
  return randomBytes(length).toString('hex');
}

