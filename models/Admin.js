const db = require("../db");


const Admin = {
  async getByEmail(email) {
    return db("admins").where({ email }).first();
  },

  async createAdmin(admin) {
    return db("admins").insert(admin).returning("*");
  },
};

module.exports = Admin;
