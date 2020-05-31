const { Pool } = require("pg");
require('dotenv').config();




const pool = new Pool({
  user: "pgsjpaws",
  host: "rogue.db.elephantsql.com",
  database: "pgsjpaws",
  password: "qOyZbhOmpqF9x8DwsUUfAEzu4-otE5eM",
  port: 5432,
});

module.exports = pool;