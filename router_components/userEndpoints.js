const express = require("express");
const router = express.Router();
const pool = require("../database");


const user = (req, res, next) => {
    pool
      .query('SELECT * FROM users')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };


const createUser = (req, res, next) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      res.sendStatus(400);
      return;
    }
    pool
      .query(
        "INSERT INTO users(email, name, password) VALUES($1, $2, $3) RETURNING *;",
        [email, name, password]
      )
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };
  router.get("/", user);
  router.post("/create", createUser);
  
  
  module.exports = router;