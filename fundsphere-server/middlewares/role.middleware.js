const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "No user on request" });
    if (roles.length === 0) return next();

    if (!roles.includes(req.user.role))
      return res.status(403).json({ msg: "Access denied: insufficient role" });

    next();
  };
};

module.exports = { roleMiddleware };
