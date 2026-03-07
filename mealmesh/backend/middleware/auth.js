const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect — verifies the Bearer JWT and attaches req.user
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorised — no token" });
  }

  try {
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch {
    res.status(401).json({ message: "Not authorised — invalid token" });
  }
};

/**
 * authorize(...roles) — must be used AFTER protect
 * Example: router.get("/donor-only", protect, authorize("donor"), handler)
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Role '${req.user.role}' is not permitted to access this route`,
    });
  }
  next();
};

module.exports = { protect, authorize };
