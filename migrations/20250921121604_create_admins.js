exports.up = function (knex) {
  return knex.schema.createTable("admins", (table) => {
    table.increments("id").primary();
    table.string("fullname").notNullable();
    table.string("role").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("admins");
};
