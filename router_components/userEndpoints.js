const express = require("express");
const router = express.Router();
const pool = require("../database");
const jwt = require("jsonwebtoken");


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


 const login= (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.sendStatus(401);
        return;
      } 
      pool
      .query(
        "SELECT * FROM users WHERE name=$1;",
        [username])
        .then((result) => {
            if(result.rowCount <= 0){
                res.send("you don't exist")
            }
           else if(password === result.rows[0].password){
            const token = jwt.sign({username}, "mySecretKey", {
                expiresIn: "1 day",
            });
            res.send(token);
           }else{res.send(401)}
            })
            .catch((e) => console.log(e));
        };
    

        
  const verify = (req, res, next) => {
    const { authorization } = req.headers;
    try {
      const verification = jwt.verify(authorization, "mySecretKey");
      if (verification) next();
      else res.sendStatus(401);
    } catch (error) {
      res.sendStatus(401);
    }
  };
  
  const hello = (req, res, next) => {
    res.send("Hello World");
  }




  router.get("/", user);
  router.post("/create", createUser);
  router.post("/save-recipe", saveRecipe);
  router.post("/login", login);
  router.get("/test", verify, hello);

  
  
  module.exports = router;