export function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      status: 401,
    });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      status: 401,
    });
  }

  if (req.session?.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      status: 403,
    });
  }

  next();
}
