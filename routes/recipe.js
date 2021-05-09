const router = require("express").Router();
const db = require("./../database/connection").connection; 

const Recipe = require("./../models/Recipe").Recipe;
const Ingredient = require("./../models/Ingredient").Ingredient; 

router.get("/api/recipes/:recipe_name", (req, res) => {
    
    //get recipe from db


    db.query('SELECT * FROM recipe INNER JOIN ingredient_has_recipe ON recipe.recipe_id = ingredient_has_recipe.recipe_id INNER JOIN ingredient ON ingredient_has_recipe.ingredient_id = ingredient.ingredient_id INNER JOIN measurement ON ingredient.measurement_id = measurement.measurement_id WHERE recipe.recipe_name=?;',[req.params.recipe_name], (error, result, fields) => {
        
        
        //this part should be outside
        if (result.length != 0){
            
            //write recipe to object
            const ingredients = [];
            for (const ingredient in result){

                ingredients.push(new Ingredient(result[ingredient].ingredient_name, result[ingredient].measurement_name, result[ingredient].amount));
            }
            const recipe = new Recipe(result[0].recipe_id, result[0].recipe_name, result[0].recipe_desc, result[0].user_id, result[0].recipe_img );
         
            res.send({
                        recipe: recipe,
                        ingredients: ingredients
                    });
        }else{
   
            res.send({
                message: "This recipe does not exists."
            });
        }
    });
 

    
})

module.exports = {
    router: router
}
