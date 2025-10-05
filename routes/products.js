const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Products = require("../models/Products");
const authMiddleware = require("../middleware/authMiddleware");
const ProductId = require("../models/ProductId");

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Manage product catalog, images, colors, and sizes
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         gender:
 *           type: string
 *         price:
 *           type: number
 *         oldPrice:
 *           type: number
 *         sale:
 *           type: boolean
 *       example:
 *         id: 1
 *         name: "Lavender Facewash"
 *         category: "Skincare"
 *         gender: "Unisex"
 *         price: 150
 *         oldPrice: 199
 *         sale: true
 *
 *     Color:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         hex:
 *           type: string
 *         stock:
 *           type: integer
 *       example:
 *         id: 3
 *         name: "Lavender"
 *         hex: "#C39BD3"
 *         stock: 25
 *
 *     Size:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         size:
 *           type: string
 *         stock:
 *           type: integer
 *       example:
 *         id: 5
 *         size: "100ml"
 *         stock: 40
 *
 *     Image:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         url:
 *           type: string
 *         filename:
 *           type: string
 *       example:
 *         id: 7
 *         url: "https://cdn.example.com/images/product1.jpg"
 *         filename: "product1.jpg"
 */

/* -------------------------------------------------------------------------- */
/*                              Public Endpoints                              */
/* -------------------------------------------------------------------------- */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get paginated, filtered, and sorted list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (matches name or category)
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Men, Women, Unisex]
 *         description: Filter by gender
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by color name
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Filter by size (e.g., M, L, XL, 100ml)
 *       - in: query
 *         name: stock
 *         schema:
 *           type: string
 *           enum: [available, out]
 *         description: Filter by stock availability
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, price_asc, price_desc]
 *         description: Sort products by date or price
 *     responses:
 *       200:
 *         description: Paginated and filtered list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */



router.get("/", async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || "",
      gender: req.query.gender || "",
      category: req.query.category || "",
      color: req.query.color || "",
      size: req.query.size || "",
      stock: req.query.stock || "",
      sort: req.query.sort || "latest",
    };
console.log(req.query.size)
    const result = await Products.getFiltered(filters);
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID with all details (images, colors, sizes)
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductId.getById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* -------------------------------------------------------------------------- */
/*                            Protected Endpoints                             */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", authMiddleware, async (req, res) => {
  const [created] = await Product.create(req.body);
  res.status(201).json(created);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", authMiddleware, async (req, res) => {
  await Product.update(req.params.id, req.body);
  res.json({ updated: true });
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  await Product.delete(req.params.id);
  res.json({ deleted: true });
});

/* -------------------------------------------------------------------------- */
/*                               Product Images                               */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/products/{productId}/images:
 *   get:
 *     summary: Get product images
 *     tags: [Products]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 */
router.get("/:productId/images", async (req, res) =>
  res.json(await Product.getImages(req.params.productId))
);

/**
 * @swagger
 * /api/products/{productId}/images:
 *   post:
 *     summary: Add an image to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Image'
 *     responses:
 *       201:
 *         description: Image added successfully
 */
router.post("/:productId/images", authMiddleware, async (req, res) => {
  const [id] = await Product.addImage({
    product_id: req.params.productId,
    ...req.body,
  });
  res.status(201).json({ id });
});

/**
 * @swagger
 * /api/products/images/{id}:
 *   put:
 *     summary: Update product image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete product image
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put("/images/:id", authMiddleware, async (req, res) => {
  await Product.updateImage(req.params.id, req.body);
  res.json({ updated: true });
});
router.delete("/images/:id", authMiddleware, async (req, res) => {
  await Product.deleteImage(req.params.id);
  res.json({ deleted: true });
});

/* -------------------------------------------------------------------------- */
/*                               Product Colors                               */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/products/{productId}/colors:
 *   get:
 *     summary: Get product colors
 *     tags: [Products]
 *   post:
 *     summary: Add a color to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:productId/colors", async (req, res) =>
  res.json(await Product.getColors(req.params.productId))
);
router.post("/:productId/colors", authMiddleware, async (req, res) => {
  const [id] = await Product.addColor({
    product_id: req.params.productId,
    ...req.body,
  });
  res.status(201).json({ id });
});

/**
 * @swagger
 * /api/products/colors/{id}:
 *   put:
 *     summary: Update a product color
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a product color
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put("/colors/:id", authMiddleware, async (req, res) => {
  await Product.updateColor(req.params.id, req.body);
  res.json({ updated: true });
});
router.delete("/colors/:id", authMiddleware, async (req, res) => {
  await Product.deleteColor(req.params.id);
  res.json({ deleted: true });
});

/* -------------------------------------------------------------------------- */
/*                               Product Sizes                                */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/products/{productId}/sizes:
 *   get:
 *     summary: Get product sizes
 *     tags: [Products]
 *   post:
 *     summary: Add a size to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:productId/sizes", async (req, res) =>
  res.json(await Product.getSizes(req.params.productId))
);
router.post("/:productId/sizes", authMiddleware, async (req, res) => {
  const [id] = await Product.addSize({
    product_id: req.params.productId,
    ...req.body,
  });
  res.status(201).json({ id });
});

/**
 * @swagger
 * /api/products/sizes/{id}:
 *   put:
 *     summary: Update a product size
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a product size
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put("/sizes/:id", authMiddleware, async (req, res) => {
  await Product.updateSize(req.params.id, req.body);
  res.json({ updated: true });
});
router.delete("/sizes/:id", authMiddleware, async (req, res) => {
  await Product.deleteSize(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
