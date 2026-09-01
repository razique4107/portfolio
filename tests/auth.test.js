import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import prisma from '../server/db.js';
import { hashPassword, verifyPassword } from '../server/utils/crypto.js';
import { registerUser, authenticateUser, requestPasswordReset, resetPassword, changePassword } from '../server/services/auth.js';

describe('Authentication Service Suite', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'SecurePassword123!';
  let createdUserId = null;

  it('should register a new user with hashed password', async () => {
    const user = await registerUser(testEmail, 'Test Explorer', testPassword);
    assert.ok(user.id);
    assert.strictEqual(user.email, testEmail.toLowerCase());
    assert.strictEqual(user.displayName, 'Test Explorer');
    createdUserId = user.id;

    // Verify password is NOT stored as plaintext in DB
    const dbRecord = await prisma.user.findUnique({ where: { id: user.id } });
    assert.ok(dbRecord.passwordHash);
    assert.notStrictEqual(dbRecord.passwordHash, testPassword);
    assert.ok(dbRecord.passwordHash.startsWith('$argon2id$'));
  });

  it('should authenticate registered user with valid credentials', async () => {
    const authResult = await authenticateUser(testEmail, testPassword);
    assert.ok(authResult.id);
    assert.strictEqual(authResult.email, testEmail.toLowerCase());
    assert.strictEqual(authResult.role, 'USER');
  });

  it('should reject authentication with invalid password', async () => {
    await assert.rejects(
      async () => {
        await authenticateUser(testEmail, 'WrongPassword999!');
      },
      { message: 'Invalid email or password' }
    );
  });

  it('should change password with valid current password', async () => {
    const newPassword = 'NewSecurePassword456!';
    const changed = await changePassword(createdUserId, testPassword, newPassword);
    assert.strictEqual(changed, true);

    // Verify new password works
    const newAuth = await authenticateUser(testEmail, newPassword);
    assert.strictEqual(newAuth.id, createdUserId);
  });

  it('should generate password reset token and reset password', async () => {
    const resetToken = await requestPasswordReset(testEmail);
    assert.ok(resetToken);
    assert.strictEqual(typeof resetToken, 'string');

    const brandNewPassword = 'FinalResetPassword789!';
    const resetSuccess = await resetPassword(resetToken, brandNewPassword);
    assert.strictEqual(resetSuccess, true);

    const finalAuth = await authenticateUser(testEmail, brandNewPassword);
    assert.strictEqual(finalAuth.id, createdUserId);
  });

  after(async () => {
    if (createdUserId) {
      await prisma.authEvent.deleteMany({ where: { userId: createdUserId } }).catch(() => {});
      await prisma.passwordResetToken.deleteMany({ where: { userId: createdUserId } }).catch(() => {});
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
  });
});
