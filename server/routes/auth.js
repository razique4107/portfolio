import express from 'express';
import { loginLimiter, registerLimiter, passwordResetLimiter } from '../middleware/rateLimit.js';
import { recordAuthEvent } from '../services/audit.js';
import { registerUser, authenticateUser, requestPasswordReset, resetPassword, changePassword } from '../services/auth.js';
import { validateEmail, validatePassword, validateDisplayName } from '../utils/validation.js';

const router = express.Router();

// Register
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { email, displayName, password, confirmPassword } = req.body;

    if (!email || !displayName || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const user = await registerUser(email, displayName, password);
    await recordAuthEvent(user.id, 'REGISTER', true, req);

    req.session.userId = user.id;
    req.session.role = 'USER';

    res.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    await recordAuthEvent(null, 'REGISTER', false, req);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      await recordAuthEvent(null, 'LOGIN_FAILURE', false, req);
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await authenticateUser(email, password);
    await recordAuthEvent(user.id, 'LOGIN_SUCCESS', true, req);

    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    await recordAuthEvent(null, 'LOGIN_FAILURE', false, req);
    res.status(401).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const userId = req.session?.userId;

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    if (userId) {
      recordAuthEvent(userId, 'LOGOUT', true, req).catch(() => {});
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Request password reset
router.post('/request-reset', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const token = await requestPasswordReset(email);

    // Generic response to not reveal email existence
    if (!token) {
      await recordAuthEvent(null, 'PASSWORD_RESET_REQUEST', false, req);
      return res.json({ message: 'If that email exists, you will receive a reset link.' });
    }

    await recordAuthEvent(null, 'PASSWORD_RESET_REQUEST', true, req);

    // In production, email the token. For dev, return it.
    if (process.env.NODE_ENV === 'development') {
      res.json({
        message: 'Password reset link would be sent',
        _dev_token: token,
      });
    } else {
      res.json({ message: 'If that email exists, you will receive a reset link.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password', passwordResetLimiter, async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    await resetPassword(token, password);
    await recordAuthEvent(null, 'PASSWORD_RESET_COMPLETED', true, req);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    await recordAuthEvent(null, 'PASSWORD_RESET_COMPLETED', false, req);
    res.status(400).json({ error: error.message });
  }
});

// Change password (requires auth)
router.post('/change-password', async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    await changePassword(req.session.userId, currentPassword, newPassword);
    await recordAuthEvent(req.session.userId, 'PASSWORD_CHANGE', true, req);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (req.session?.userId) {
      await recordAuthEvent(req.session.userId, 'PASSWORD_CHANGE', false, req);
    }
    res.status(400).json({ error: error.message });
  }
});

export default router;
