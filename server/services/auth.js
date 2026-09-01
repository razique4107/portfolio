import prisma from '../db.js';
import { hashPassword, verifyPassword, generateSecureToken, hashToken } from '../utils/crypto.js';
import { normalizeEmail, normalizeDisplayName } from '../utils/normalize.js';
import { validateEmail, validatePassword, validateDisplayName } from '../utils/validation.js';

export async function registerUser(email, displayName, password) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = normalizeDisplayName(displayName);

  if (!validateEmail(normalizedEmail)) {
    throw new Error('Invalid email format');
  }

  if (!validateDisplayName(normalizedName)) {
    throw new Error('Display name must be between 2 and 100 characters');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(password);

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      displayName: normalizedName,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
    },
  });
}

export async function authenticateUser(email, password) {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is disabled');
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Update login metadata
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      loginCount: { increment: 1 },
    },
  });

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  };
}

export async function getUserById(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      loginCount: true,
      isActive: true,
    },
  });
}

export async function requestPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    // Don't reveal if email exists
    return null;
  }

  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  const tokenHash = hashToken(token);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  return token;
}

export async function resetPassword(token, newPassword) {
  if (!validatePassword(newPassword)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetToken || resetToken.expiresAt < new Date() || resetToken.usedAt !== null) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
  ]);

  return true;
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }

  if (!validatePassword(newPassword)) {
    throw new Error('New password must be at least 8 characters with uppercase, lowercase, and number');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return true;
}
