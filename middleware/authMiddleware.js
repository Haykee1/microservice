const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Access denied" });

  const token = header.split("")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEYS);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
}
module.exports = authMiddleware;
