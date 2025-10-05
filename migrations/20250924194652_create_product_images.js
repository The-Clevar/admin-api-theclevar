// migrations/202509250004_create_product_images.js
exports.up = function (knex) {
  return knex.schema.createTable("product_images", (table) => {
    table.increments("id").primary();
    table.string("filename").notNullable();
    table.string("url").notNullable();
    table
      .enu("category", ["UserImg", "ProductImg"])
      .notNullable()
      .defaultTo("ProductImg");
    table.integer("product_id").unsigned().references("id").inTable("products").onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_images");
};
