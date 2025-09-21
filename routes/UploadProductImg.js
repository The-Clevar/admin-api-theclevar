// routes/uploadImage.js
const express = require("express");
const multer = require("multer");
const ftp = require("basic-ftp");
const { Readable } = require("stream");
const ProductImage = require("../models/ProductImage");
const authMiddleware = require("../middleware/authMiddleware"); // <- add this

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const FTP_CONFIG = {
    host: process.env.FTP_HOST || "82.25.125.253",
    user: process.env.FTP_USER || "u149966355",
    password: process.env.FTP_PASSWORD || "Stark@0505",
    port: parseInt(process.env.FTP_PORT || "21", 10),
    secure: false,
};

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload a User or Product image
 *     tags:
 *       - Upload
 *     security:
 *       - BearerAuth: []   # <- add this line to enable JWT auth
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [UserImg, ProductImg]
 *         required: true
 *         description: Type of image to upload (UserImg or ProductImg)
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
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *       400:
 *         description: Invalid type or no file uploaded
 *       500:
 *         description: Server error
 */

router.post(
    "/image",
    authMiddleware, // <- protect the route
    upload.single("image"),
    async (req, res) => {
        const type = req.query.type; // 'UserImg' or 'ProductImg'

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        if (!type || !["UserImg", "ProductImg"].includes(type)) {
            return res.status(400).json({ message: "Invalid or missing type. Use 'UserImg' or 'ProductImg'" });
        }

        const client = new ftp.Client();
        client.ftp.verbose = false;

        try {
            await client.access(FTP_CONFIG);

            const timestamp = Date.now();
            const uniqueName = `${timestamp}-${req.file.originalname}`;
            const readable = Readable.from(req.file.buffer);

            // Set folder based on type
            const folderPath =
                type === "UserImg"
                    ? `${process.env.FTP_BASE_PATH}/Images/UserImages`
                    : `${process.env.FTP_BASE_PATH}/Images/ProductImages`;

            await client.ensureDir(folderPath);
            await client.uploadFrom(readable, `${folderPath}/${uniqueName}`);

            const fileUrl = `https://staging.theclevar.com/Images/${type === "UserImg" ? "UserImages" : "ProductImages"}/${uniqueName}`;

            const saved = await ProductImage.createImage({
                filename: uniqueName,
                url: fileUrl,
            });

            return res.json({
                message: `${type} uploaded successfully`,
                data: saved,
            });
        } catch (err) {
            console.error("FTP Upload Error:", err);
            return res.status(500).json({ message: "Server error", error: err.message });
        } finally {
            client.close();
        }
    }
);

module.exports = router;
