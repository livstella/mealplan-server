const { Pool } = require("pg");

const pool = new Pool({
  user: "pgsjpaws",
  host: "rogue.db.elephantsql.com",
  database: "pgsjpaws",
  password: "",
  port: 5432,
});

module.exports = pool;