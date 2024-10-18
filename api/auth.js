const express = require("express");
const router = express.Router();

// Import jwt and JWT_SECRET
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Create Token
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

const prisma = require("../prisma");

// Token-checking middleware
router.use(async (req, res, next) => {
  // Grab token from headers only if it exists
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // "Bearer <token>"
  if (!token) return next();

  // Find user with ID decrypted from the token and attach to the request
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});

// POST /register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.register(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

// POST /login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.login(username, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

// Checks the request for an authenticated user.
function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in." });
  }
}

// export the router and the `authenticate` middleware
module.exports = {
  router,
  authenticate,
};
