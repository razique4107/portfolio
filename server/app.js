import express from 'express';
import session from 'express-session';
import compression from 'compression';
import { setupSecurityHeaders } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { config, isDev } from './config.js';

// Import routes
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import contentRouter from './routes/content.js';
import adminRouter from './routes/admin.js';

export function createApp() {
  const app = express();

  // Security headers
  setupSecurityHeaders(app);

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));

  // Sessions
  app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: !isDev, // HTTPS only in production
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }));

  // Static files (with extension-less HTML resolution for /login, /register, /account, /admin, etc.)
  app.use(express.static('public', { extensions: ['html'] }));

  // API rate limiting
  app.use('/api/', apiLimiter);

  // Routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/content', contentRouter);
  app.use('/api/admin', adminRouter);

  // 404 and error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
