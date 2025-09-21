const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Admin = require("../models/Admin");

const JWT_SECRET = "your_secret_key";

/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: Admin Authentication routes
 */

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullname
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *               fullname:
 *                 type: string
 *                 example: Admin User
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/signup", async (req, res) => {
  const { email, password, fullname, role } = req.body;

  try {
    const existingAdmin = await Admin.getByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.createAdmin({
      email,
      password: hashedPassword,
      fullname,
      role
    });

    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login admin and get JWT token
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.getByEmail(email);
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "30d" } // ✅ 30 days
    );


    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
