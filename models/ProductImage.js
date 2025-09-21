const db = require("../db"); // Your initialized Knex instance

const ProductImage = {
  async createImage(image) {
    // Ensure category is valid
    if (!["UserImg", "ProductImg"].includes(image.category)) {
      image.category = "ProductImg"; // fallback
    }

    const [id] = await db("product_images").insert(image);
    const saved = await db("product_images").where({ id }).first();
    return saved;
  },

  async getImageById(id) {
    return db("product_images").where({ id }).first();
  },

  async getImagesByCategory(category) {
    if (!["UserImg", "ProductImg"].includes(category)) return [];
    return db("product_images").where({ category });
  },
};

module.exports = ProductImage;
