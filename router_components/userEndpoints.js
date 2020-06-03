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

  const saveRecipe = (req, res, next) => {
       const { id } = req.body
       pool
        .query(
            "INSERT INTO saved_recipes(recipe_id) VALUES($1) RETURNING *;",
            [id])
            .then((data) => res.json(data.rows))
            .catch((e) => console.log(e));
  }



  router.get("/", user);
  router.post("/create", createUser);
  router.post("/save-recipe", saveRecipe);
  
  
  module.exports = router;