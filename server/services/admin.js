import prisma from '../db.js';

export async function getAllUsers() {
  return prisma.user.findMany({
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
    orderBy: { createdAt: 'desc' },
  });
}

export async function disableUser(userId) {
  if (!userId) throw new Error('User ID required');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  // Invalidate sessions
  await prisma.session.deleteMany({
    where: { userId },
  });

  return true;
}

export async function enableUser(userId) {
  if (!userId) throw new Error('User ID required');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  return true;
}

export async function changeUserRole(userId, newRole) {
  if (!userId) throw new Error('User ID required');
  if (!['USER', 'ADMIN'].includes(newRole)) {
    throw new Error('Invalid role');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
}

export async function getAdminOverview() {
  const [
    totalUsers,
    activeUsers,
    adminUsers,
    newUsersThisMonth,
    authEventsSummary,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
    getAuthEventsSummary(),
    getRecentAuthEvents(10),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers,
      newThisMonth: newUsersThisMonth,
    },
    authentication: authEventsSummary,
    recentEvents,
  };
}

async function getAuthEventsSummary() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  const [successLogins, failedLogins] = await Promise.all([
    prisma.authEvent.count({
      where: {
        eventType: 'LOGIN_SUCCESS',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.authEvent.count({
      where: {
        eventType: 'LOGIN_FAILURE',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  return {
    successLogins,
    failedLogins,
    period: '30 days',
  };
}

async function getRecentAuthEvents(limit) {
  return prisma.authEvent.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      eventType: true,
      success: true,
      createdAt: true,
      user: {
        select: {
          displayName: true,
          email: true,
        },
      },
    },
  });
}

export async function recordAdminAction(adminId, actionType, targetUserId, details) {
  return prisma.adminAction.create({
    data: {
      adminId,
      actionType,
      targetUserId: targetUserId || null,
      details: details || null,
    },
  });
}
