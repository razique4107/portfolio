import helmet from 'helmet';
import { config, isProd } from '../config.js';

export function setupSecurityHeaders(app) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://dcym8fthxf5uu.cloudfront.net'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'https:', 'data:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://dcym8fthxf5uu.cloudfront.net'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        childSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: !isProd,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }));

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    if (isProd) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    next();
  });
}

export function setupCsrfProtection(app, doubleCsrf) {
  // CSRF middleware
  app.use((req, res, next) => {
    const token = doubleCsrf.secretSync();
    res.locals.csrfToken = doubleCsrf.getToken(req, res);
    next();
  });
}
