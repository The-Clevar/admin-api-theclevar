const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Products = require("../models/Products");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
// router.get("/", async (req, res) => res.json(await Product.getAll()));

router.get("/", async (req, res) => {
  try {
    const products = await Products.getAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product object
 */
router.get("/:id", async (req, res) => res.json(await Product.getById(req.params.id)));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "T-Shirt"
 *               price: 19.99
 *     responses:
 *       201:
 *         description: Created product
 */
router.post("/", async (req, res) => {
  const [created] = await Product.create(req.body);
  res.status(201).json(created);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put("/:id", async (req, res) => {
  await Product.update(req.params.id, req.body);
  res.json({ updated: true });
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete("/:id", async (req, res) => {
  await Product.delete(req.params.id);
  res.json({ deleted: true });
});

/**
 * @swagger
 * /products/{productId}/images:
 *   get:
 *     summary: Get product images
 *     tags: [Products]
 *   post:
 *     summary: Add a product image
 *     tags: [Products]
 */
router.get("/:productId/images", async (req, res) => res.json(await Product.getImages(req.params.productId)));
router.post("/:productId/images", async (req, res) => {
  const [id] = await Product.addImage({ product_id: req.params.productId, ...req.body });
  res.status(201).json({ id });
});

/**
 * @swagger
 * /products/images/{id}:
 *   put:
 *     summary: Update product image
 *     tags: [Products]
 *   delete:
 *     summary: Delete product image
 *     tags: [Products]
 */
router.put("/images/:id", async (req, res) => { await Product.updateImage(req.params.id, req.body); res.json({ updated: true }); });
router.delete("/images/:id", async (req, res) => { await Product.deleteImage(req.params.id); res.json({ deleted: true }); });

/**
 * @swagger
 * /products/{productId}/colors:
 *   get:
 *     summary: Get product colors
 *     tags: [Products]
 *   post:
 *     summary: Add a product color
 *     tags: [Products]
 */
router.get("/:productId/colors", async (req, res) => res.json(await Product.getColors(req.params.productId)));
router.post("/:productId/colors", async (req, res) => {
  const [id] = await Product.addColor({ product_id: req.params.productId, ...req.body });
  res.status(201).json({ id });
});

/**
 * @swagger
 * /products/colors/{id}:
 *   put:
 *     summary: Update product color
 *     tags: [Products]
 *   delete:
 *     summary: Delete product color
 *     tags: [Products]
 */
router.put("/colors/:id", async (req, res) => { await Product.updateColor(req.params.id, req.body); res.json({ updated: true }); });
router.delete("/colors/:id", async (req, res) => { await Product.deleteColor(req.params.id); res.json({ deleted: true }); });

/**
 * @swagger
 * /products/{productId}/sizes:
 *   get:
 *     summary: Get product sizes
 *     tags: [Products]
 *   post:
 *     summary: Add a product size
 *     tags: [Products]
 */
router.get("/:productId/sizes", async (req, res) => res.json(await Product.getSizes(req.params.productId)));
router.post("/:productId/sizes", async (req, res) => {
  const [id] = await Product.addSize({ product_id: req.params.productId, ...req.body });
  res.status(201).json({ id });
});

/**
 * @swagger
 * /products/sizes/{id}:
 *   put:
 *     summary: Update product size
 *     tags: [Products]
 *   delete:
 *     summary: Delete product size
 *     tags: [Products]
 */
router.put("/sizes/:id", async (req, res) => { await Product.updateSize(req.params.id, req.body); res.json({ updated: true }); });
router.delete("/sizes/:id", async (req, res) => { await Product.deleteSize(req.params.id); res.json({ deleted: true }); });

module.exports = router;
