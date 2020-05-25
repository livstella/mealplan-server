const { Pool } = require("pg");

const pool = new Pool({
  user: "pgsjpaws",
  host: "rogue.db.elephantsql.com",
  database: "pgsjpaws",
  password: "vvGKkLKdYYo-uJec1lgPmOVmhXT59muM",
  port: 5432,
});

module.exports = pool;