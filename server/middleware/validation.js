export function validateJson(schema) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        status: 400,
      });
    }

    // Basic validation: ensure only expected fields
    const allowedFields = Object.keys(schema);
    const bodyFields = Object.keys(req.body);
    const unexpectedFields = bodyFields.filter(field => !allowedFields.includes(field));

    if (unexpectedFields.length > 0) {
      return res.status(400).json({
        error: 'Unexpected fields in request',
        status: 400,
      });
    }

    next();
  };
}
