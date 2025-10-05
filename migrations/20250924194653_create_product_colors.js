// migrations/202509250005_create_product_colors.js
exports.up = function (knex) {
  return knex.schema.createTable("product_colors", (table) => {
    table.increments("id").primary();
    table.integer("product_id").unsigned().references("id").inTable("products").onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("hex").notNullable();
    table.integer("stock").defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_colors");
};
