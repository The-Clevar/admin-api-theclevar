const db = require("../db");

const createUser = async (user) => {
  return await db("users").insert(user);
};

const getUserByEmail = async (email) => {
  return await db("users").where({ email }).first();
};

module.exports = {
  createUser,
  getUserByEmail,
};
