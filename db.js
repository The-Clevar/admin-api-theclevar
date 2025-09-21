const knex = require("knex");
const config = require("./knexfile");

const db = knex(config.development);

// Test the connection
db.raw("SELECT 1")
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

module.exports = db;
