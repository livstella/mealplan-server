const express = require("express");
const router = express.Router();
const pool = require("../database");
const jwt = require("jsonwebtoken");

/*const ingredients = (req, res, next) => {
    pool
      .query('SELECT * FROM "ingredient";')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };
*/

// Reformat as ES6
const ingredients = async (req, res, next) => {
    try{
        const query = await pool.query('SELECT * FROM "ingredient";');
        res.json(query.data.rows);
    }catch(e){
        console.log(e)
    }
 };

  const units = (req, res, next) => {
    pool
      .query('SELECT * FROM "unit";')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };

  const author = (req, res, next) => {
    pool
      .query('SELECT * FROM "author_site";')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };

  const category = (req, res, next) => {
    pool
      .query('SELECT * FROM "category";')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };


  const recipe = (req, res, next) => {
    pool
      .query('SELECT * FROM recipe')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };

  
  const categoryRecipe = (req, res, next) => {
    pool
      .query('SELECT category.name, recipe_id FROM category_recipe FULL JOIN category ON category_id=category.id INNER JOIN recipe ON recipe.id=recipe_id;')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };

  const ingredientUnit = (req, res, next) => {
    pool
      .query('SELECT ingredient.name, unit.name, amount, recipe_id FROM ingredient_unit FULL JOIN unit ON unit_id=unit.id FULL JOIN ingredient ON ingredient_id=ingredient.id')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };

  const getRecipes = async (req, res, next) => {
    try{
      const result = await pool
        .query('SELECT recipe.id, recipe.name, recipe.img_url, recipe.description, author_site.name AS author FROM recipe INNER JOIN author_site on author_id=author_site.id;')
    req.recipes = result.rows;
    next();
    }catch(e){
    console.log(e);
  }};

  const getIngredients = async (req, res, next) => {
    try{
      const result = await pool
        .query('SELECT  amount, unit.name AS unit,  ingredient.name AS ingredient, recipe_id FROM ingredient_unit INNER JOIN unit ON unit_id=unit.id INNER JOIN ingredient ON ingredient_id=ingredient.id')
    req.recipesIngredients = result.rows;
    next();
    }catch(e){
    console.log(e);
  }};

  const getCategories = async (req, res, next) => {
    try{
      const result = await pool
        .query('SELECT * FROM category_recipe FULL JOIN category ON category_id=category.id;')
    req.categories = result.rows;
    console.log(req.categories)
    next();
    }catch(e){
    console.log(e);
  }};

  const mapIngredients= (req, res, next) => {
    const fullResponse = req.recipes.map((recipe) => {
      recipe.ingredients = [];
      recipe.categories=[];
      for (let index in req.recipesIngredients ) {
        if (req.recipesIngredients[index].recipe_id === recipe.id) {
          delete req.recipesIngredients[index].recipe_id;
          recipe.ingredients.push(req.recipesIngredients[index]);
        }
      }
      for (let catIndex in req.categories ) {
        if (req.categories[catIndex].recipe_id === recipe.id) {
          delete req.categories[catIndex].recipe_id;
          recipe.categories.push(req.categories[catIndex]);
        }
      }
      return recipe;
      
    })
    res.json(fullResponse);
   next();
   
  }

  const mapCategories= (req, res, next) => {
    const newResponse = req.recipes.map((recipe) => {
      recipe.categories = [];
      for (let index in req.categories ) {
        if (req.categories[index].recipe_id === recipe.id) {
            delete req.categories[index].recipe_id;
            recipe.categories.push(req.categories[index].name);
        }
      }
      return recipe;
      
    })
    res.json(newResponse);
   
  }

  const user = (req, res, next) => {
    pool
      .query('SELECT * FROM users')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };


  const savedRecipes = (req, res, next) => {
    pool
      .query('SELECT saved_recipes.id, user_id, recipe.id AS recipe_id, recipe.name, recipe.img_url, recipe.description, author_site.name AS author FROM saved_recipes INNER JOIN recipe ON recipe.id=recipe_id INNER JOIN author_site on author_id=author_site.id;')
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };


  const shoppingList = (req, res, next) => {
    const { authorization } = req.headers;
    verification = jwt.verify(authorization, "mySecretKey");

    pool
      .query('SELECT ingredient.name AS ingredient , amount, unit.name AS unit, saved_recipes.user_id AS user_id FROM shopping_list FULL JOIN saved_recipes ON saved_recipes_id=saved_recipes.id FULL JOIN recipe ON recipe.id=recipe_id FULL JOIN ingredient_unit ON ingredient_unit.recipe_id=recipe.id FULL JOIN unit ON unit.id=unit_id FULL JOIN ingredient ON ingredient.id=ingredient_id WHERE user_id=$1 GROUP BY ingredient, amount, unit, user_id;',
      [verification.id])
      .then((data) => res.json(data.rows))
      .catch((e) => console.log(e));
  };




  const getSavedRecipes =(req, res, next) => {
    const { authorization } = req.headers;
    verification = jwt.verify(authorization, "mySecretKey");
    
    pool
     .query(
         "SELECT saved_recipes.id AS savedID, user_id, recipe.id, recipe.name, recipe.img_url, recipe.description, author_site.name AS author FROM saved_recipes INNER JOIN recipe ON recipe.id=recipe_id INNER JOIN author_site on author_id=author_site.id WHERE user_id=$1;",
         [verification.id])
         .then((data) => res.json(data.rows))
         .catch((e) => console.log(e));
  }



  

 



router.get("/ingredients", ingredients);
router.get("/units", units);
router.get("/author", author);
router.get("/category", category);
router.get("/recipe", recipe);
router.get("/category-recipe", categoryRecipe);
router.get("/ingredient-unit", ingredientUnit);
router.get("/recipe-with-ingredients", getRecipes, getIngredients,getCategories,  mapIngredients);
router.get("/recipe-with-categories", getRecipes, getCategories, mapCategories)
router.get("/user", user);
router.get("/saved-recipes", savedRecipes, getIngredients,  mapIngredients);
router.get("/shopping", shoppingList);
router.get("/get-saved-recipes", getSavedRecipes, getIngredients,  mapIngredients);

module.exports = router;
