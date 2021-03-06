const express = require("express");
const router = express.Router();
const pool = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')


const user = (req, res, next) => {
    pool
      .query('SELECT * FROM users')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };


const createUser = async (req, res, next) => {
    const { email, name, password } = req.body;
    if (!name || !password) {
      res.sendStatus(400);
      return;
    }
    try{
      const hashedPassword = await bcrypt.hash(password, 10)
      console.log(hashedPassword)
    
    pool
      .query(
        "INSERT INTO users(email, name, password) VALUES($1, $2, $3) RETURNING *;",
        [email, name, hashedPassword]
      ).then((data) => res.json(data.rows))
    }catch(e){
      console.log(e);
    }};

  const saveRecipe = (req, res, next) => {
       const { id } = req.body;
       const { authorization } = req.headers;
       const verification = jwt.verify(authorization, "mySecretKey");
       pool
        .query(
            "INSERT INTO saved_recipes(recipe_id, user_id) VALUES($1, $2) RETURNING *;",
            [id, verification.id])
            .then((data) => res.json(data.rows))
            .catch((e) => console.log(e));
  }


 const login= async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.sendStatus(401);
        return;
     }
     try{
         const result = pool.query("SELECT * FROM users WHERE name=$1;", [username]);
         if(result.rowCount <= 0){
                res.status(404).send("you don't exist");
                return;
          }else if(await bcrypt.compare( password, result.rows[0].password)){
            const token = await jwt.sign({id: result.rows[0].id}, "mySecretKey", {
                expiresIn: "1 day",
            });
            res.send(token);
           }else{
               res.send(401)}
            }
     }catch(e){
        console.log(e);
     }
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


  const deleteRecipe=(req, res, next) => {
    const { id } = req.body;
    pool
     .query(
        "DELETE FROM saved_recipes WHERE id=$1;", 
        [id])
         .then((data) => res.json(data.rows))
         .catch((e) => console.log(e));
  }





  router.get("/", user);
  router.post("/create", createUser);
  router.post("/save-recipe", saveRecipe);
  router.post("/login", login);
  router.get("/test", verify, hello);
  router.delete("/delete-recipe", deleteRecipe);
  

  
  
  module.exports = router;
