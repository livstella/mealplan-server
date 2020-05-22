const express = require("express");
const router = express.Router();
const pool = require("../database");

const ingredients = (req, res, next) => {
    pool
      .query('SELECT * FROM "ingredient";')
      .then((data) => res.json(data))
      .catch((e) => console.log(e));
  };


router.get("/ingredients", ingredients);


module.exports = router;
