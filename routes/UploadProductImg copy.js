const express = require("express");
const multer = require("multer");
const path = require("path");
const ProductImage = require("../models/ProductImage"); // Your Knex model

const router = express.Router();

// ✅ Local path to save uploaded images
const UPLOADS_PATH = path.join("D:", "Clevar", "theclevar", "public", "uploads");

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: ProductImage
 *   description: API for uploading product images
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload a product image
 *     tags: [ProductImage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://staging.theclevar.com/uploads/1726898765432-product.png
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ File URL accessible via your domain
    const fileUrl = `https://staging.theclevar.com/uploads/${req.file.filename}`;

    // Save to DB
    const saved = await ProductImage.createImage({
      filename: req.file.filename,
      url: fileUrl,
    });

    res.json({ url: saved.url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
