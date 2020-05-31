const { Pool } = require("pg");




const pool = new Pool({
  user: "pgsjpaws",
  host: "rogue.db.elephantsql.com",
  database: "pgsjpaws",
  password: process.env.DBpassword,
  port: 5432,
});

module.exports = pool;