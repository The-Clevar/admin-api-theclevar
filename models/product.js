// models/product.js
// const knex = require("knex")(require("../knexfile").development);
const db = require("../db"); // Your initialized Knex instance

const Product = {
  // Products
  getAll: () => db("products"),
  getById: (id) => db("products").where({ id }).first(),
  create: (data) => db("products").insert(data).returning("*"),
  update: (id, data) => db("products").where({ id }).update(data),
  delete: (id) => db("products").where({ id }).del(),

  // Images
  getImages: (productId) => db("product_images").where({ product_id: productId }),
  addImage: (data) => db("product_images").insert(data),
  updateImage: (id, data) => db("product_images").where({ id }).update(data),
  deleteImage: (id) => db("product_images").where({ id }).del(),

  // Colors
  getColors: (productId) => db("product_colors").where({ product_id: productId }),
  addColor: (data) => db("product_colors").insert(data),
  updateColor: (id, data) => db("product_colors").where({ id }).update(data),
  deleteColor: (id) => db("product_colors").where({ id }).del(),

  // Sizes
  getSizes: (productId) => db("product_sizes").where({ product_id: productId }),
  addSize: (data) => db("product_sizes").insert(data),
  updateSize: (id, data) => db("product_sizes").where({ id }).update(data),
  deleteSize: (id) => db("product_sizes").where({ id }).del(),
};

module.exports = Product;
