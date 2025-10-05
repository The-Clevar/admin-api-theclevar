// migrations/202509250003_create_products.js
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("category").notNullable();
    table.string("gender").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.decimal("oldPrice", 10, 2).nullable();
    table.boolean("sale").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
