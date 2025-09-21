exports.up = function (knex) {
  return knex.schema.createTable("product_images", (table) => {
    table.increments("id").primary();
    table.string("filename").notNullable();
    table.string("url").notNullable();
    table
      .enu("category", ["UserImg", "ProductImg"])
      .notNullable()
      .defaultTo("ProductImg"); // default if not provided
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_images");
};
