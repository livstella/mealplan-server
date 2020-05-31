const { Pool } = require("pg");
require('dotenv').config();
const aws = require('aws-sdk');



const pool = new Pool({
  user: process.env.DBuser,
  host: process.env.DBhost,
  database: process.env.database,
  password: process.env.password,
  port: process.env.DBport,
});

module.exports = pool;