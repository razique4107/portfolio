import prisma from '../db.js';
import { normalizeEmail, truncateUserAgent, hashIp } from '../utils/normalize.js';
import { getClientIp } from '../utils/validation.js';

export async function recordAuthEvent(userId, eventType, success, req) {
  const clientIp = getClientIp(req);
  const ipHash = hashIp(clientIp);
  const userAgent = truncateUserAgent(req.headers['user-agent']);

  try {
    await prisma.authEvent.create({
      data: {
        userId: userId || null,
        eventType,
        success,
        ipHash,
        userAgentSummary: userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to record auth event:', error.message);
  }
}

export async function getAuthEventSummary(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [
    totalLogins,
    failedLogins,
    registrations,
    passwordResets,
  ] = await Promise.all([
    prisma.authEvent.count({
      where: {
        eventType: 'LOGIN_SUCCESS',
        createdAt: { gte: since },
      },
    }),
    prisma.authEvent.count({
      where: {
        eventType: 'LOGIN_FAILURE',
        createdAt: { gte: since },
      },
    }),
    prisma.authEvent.count({
      where: {
        eventType: 'REGISTER',
        success: true,
        createdAt: { gte: since },
      },
    }),
    prisma.authEvent.count({
      where: {
        eventType: 'PASSWORD_RESET_COMPLETED',
        success: true,
        createdAt: { gte: since },
      },
    }),
  ]);

  return {
    totalLogins,
    failedLogins,
    registrations,
    passwordResets,
  };
}

export async function getRecentAuthEvents(limit = 50) {
  return prisma.authEvent.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      eventType: true,
      success: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
    },
  });
}
