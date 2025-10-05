const knex = require("../db");

class ProductId {
  /**
   * Get product by ID with all related data (images, colors, sizes)
   * @param {number} id
   */
  static async getById(id) {
    // 1️⃣ Fetch main product
    const product = await knex("products").where({ id }).first();
    if (!product) return null;

    // 2️⃣ Fetch related data in parallel
    const [images, colors, sizes] = await Promise.all([
      knex("product_images").where({ product_id: id }),
      knex("product_colors").where({ product_id: id }),
      knex("product_sizes").where({ product_id: id }),
    ]);

    // 3️⃣ Combine into a single object
    return {
      ...product,
      images,
      colors,
      sizes,
    };
  }

  /**
   * Update product by ID
   * @param {number} id
   * @param {object} data
   */
  static async update(id, data) {
    await knex("products").where({ id }).update(data);
    return this.getById(id); // return updated product
  }

  /**
   * Delete product by ID
   * @param {number} id
   */
  static async delete(id) {
    return knex("products").where({ id }).del();
  }

  /**
   * Create a new product
   * @param {object} data
   */
  static async create(data) {
    const [id] = await knex("products").insert(data);
    return this.getById(id); // return created product
  }
}

module.exports = ProductId;
