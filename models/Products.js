const knex = require("../db");

class Products {
  static async getFiltered({
    page = 1,
    limit = 10,
    search = "",
    gender = "",
    category = "",
    color = "",
    size = "",
    stock = "",
    sort = "latest",
  }) {
    const offset = (page - 1) * limit;
console.log('size',size)
    // Base query
    let query = knex("products").select("*");

    // 🔍 Search by name or category
    if (search) {
      query.where(function () {
        this.where("name", "like", `%${search}%`)
          .orWhere("category", "like", `%${search}%`);
      });
    }

    // 🎯 Basic filters
    if (gender) query.andWhere("gender", gender);
    if (category) query.andWhere("category", category);

    // 🧩 Stock filter
    if (stock === "available") query.andWhere("stock", ">", 0);
    if (stock === "out") query.andWhere("stock", "=", 0);

    // 🕓 Sorting
    switch (sort) {
      case "price_asc":
        query.orderBy("price", "asc");
        break;
      case "price_desc":
        query.orderBy("price", "desc");
        break;
      default:
        query.orderBy("created_at", "desc");
    }

    // 📦 Count total for pagination
    const [{ count }] = await query.clone().clearSelect().count("id as count");
    const totalItems = parseInt(count);

    // ⏱ Apply pagination
    const products = await query.limit(limit).offset(offset);

    const productIds = products.map((p) => p.id);
    if (!productIds.length) {
      return {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        products: [],
      };
    }

    // 🖼 Fetch relations
    const [images, colors, sizes] = await Promise.all([
      knex("product_images").whereIn("product_id", productIds),
      knex("product_colors").whereIn("product_id", productIds),
      knex("product_sizes").whereIn("product_id", productIds),
    ]);

    // 🧩 Attach relations
    let enriched = products.map((p) => ({
      ...p,
      images: images.filter((i) => i.product_id === p.id),
      colors: colors.filter((c) => c.product_id === p.id),
      sizes: sizes.filter((s) => s.product_id === p.id),
    }));

    // 🎨 Color filter (case-insensitive)
    if (color) {
      enriched = enriched.filter((p) =>
        p.colors.some(
          (c) =>
            c.name &&
            c.name.toLowerCase().trim() === color.toLowerCase().trim()
        )
      );
    }

    // 📏 Size filter (handles "M", "L", "100ml", case-insensitive)
if (size) {
  const sizesArray = size
    .split(",")
    .map((s) => s.toLowerCase().trim())
    .filter((s) => s); // remove empty strings

  enriched = enriched.filter((p) =>
    p.sizes.some(
      (s) =>
        (s.size && sizesArray.includes(s.size.toLowerCase().trim())) ||
        (s.label && sizesArray.includes(s.label.toLowerCase().trim()))
    )
  );
}


    return {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      products: enriched,
    };
  }
}

module.exports = Products;
