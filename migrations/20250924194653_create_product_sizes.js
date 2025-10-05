// migrations/202509250006_create_product_sizes.js
exports.up = function (knex) {
  return knex.schema.createTable("product_sizes", (table) => {
    table.increments("id").primary();
    table.integer("product_id").unsigned().references("id").inTable("products").onDelete("CASCADE");
    table.string("size").notNullable();
    table.integer("stock").defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_sizes");
};
