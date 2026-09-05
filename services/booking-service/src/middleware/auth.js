function extractUser(req, res, next) {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const userEmail = req.headers['x-user-email'];
  const cooperativeId = req.headers['x-user-cooperative-id'];

  if (!userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User identity headers missing from Gateway'
    });
  }

  req.user = {
    id: userId,
    role: userRole,
    email: userEmail,
    cooperativeId: cooperativeId || null
  };

  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User context missing' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Action requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
}

module.exports = {
  extractUser,
  requireRole
};
