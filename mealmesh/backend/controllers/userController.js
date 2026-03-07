const User   = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

// Helper to build the public user payload
const publicUser = (u) => ({
  _id:   u._id,
  name:  u.name,
  email: u.email,
  role:  u.role,
});

// ── Register ──────────────────────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({
      name,
      email,
      password: hashed,
      role: role || "donor",
    });

    res.status(201).json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid password" });

    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get own profile (protected) ───────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  res.json(req.user);
};
