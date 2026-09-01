import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { getAdminOverview, getAllUsers, disableUser, enableUser, changeUserRole, recordAdminAction } from '../services/admin.js';
import { getRecentAuthEvents } from '../services/audit.js';

const router = express.Router();

// Admin overview
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const overview = await getAdminOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// Get all users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Disable user
router.patch('/users/:id/disable', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await disableUser(id);
    await recordAdminAction(req.session.userId, 'USER_DISABLED', id, null);

    res.json({ message: 'User disabled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Enable user
router.patch('/users/:id/enable', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await enableUser(id);
    await recordAdminAction(req.session.userId, 'USER_ENABLED', id, null);

    res.json({ message: 'User enabled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change user role
router.patch('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role required' });
    }

    await changeUserRole(id, role);
    await recordAdminAction(req.session.userId, 'ROLE_CHANGED', id, `Changed to ${role}`);

    res.json({ message: 'Role updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get auth events
router.get('/auth-events', requireAdmin, async (req, res) => {
  try {
    const events = await getRecentAuthEvents(100);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch auth events' });
  }
});

export default router;
