import { isProd } from '../config.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isDevelopment = !isProd;

  // Log error server-side
  console.error('Error:', {
    message: err.message,
    status: statusCode,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    // Never log sensitive data
  });

  // Send safe response to client
  if (isDevelopment) {
    res.status(statusCode).json({
      error: err.message,
      status: statusCode,
      path: req.path,
    });
  } else {
    res.status(statusCode).json({
      error: statusCode === 500 ? 'An error occurred' : err.message,
      status: statusCode,
    });
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    status: 404,
    path: req.path,
  });
}
