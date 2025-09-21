exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("fullname").notNullable().defaultTo("Anonymous");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("fullname");
  });
};
