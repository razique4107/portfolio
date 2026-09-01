import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',

  db: {
    url: process.env.DATABASE_URL,
  },

  session: {
    secret: process.env.SESSION_SECRET,
  },

  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  },

  security: {
    csrfTokenLength: parseInt(process.env.CSRF_TOKEN_LENGTH || '32'),
  },
};

// Validate required config
if (!config.db.url) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!config.session.secret) {
  throw new Error('SESSION_SECRET environment variable is required');
}

if (config.env === 'production' && config.appOrigin.includes('localhost')) {
  throw new Error('APP_ORIGIN must be set to production URL in production environment');
}

export const isDev = config.env === 'development';
export const isProd = config.env === 'production';
