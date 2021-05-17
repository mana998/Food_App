const router = require("express").Router();
const db = require("./../database/connection").connection; 

const Recipe = require("./../models/Recipe").Recipe;

router.get("/api/recipes", (req, res) => {

    let page = req.query.page || 1;
    let size = req.query.size || 1000;
    //add filtering
    let filter = req.query.filter || "likes";
    let direction = req.query.direction || "desc";

    //needs to be in there as else it is putting it into quotes
    let query = `SELECT recipe_name, recipe_img FROM recipe ORDER BY ${filter} ${direction} LIMIT ? OFFSET ?;`;
    values = [Number(size), Number((page - 1) * size)];

    db.query(query, values, (error, result, fields) => {
        //console.log("result", result);
        if (result && result.length) {
            //write recipe to object
            const recipes = [];
            for (const recipe of result) {
                recipes.push(new Recipe('', recipe.recipe_name,'', '', recipe.recipe_img));
            }
            res.send({recipes});
        } else {
            res.send({message: "No recipes found"});
        }
    });
})

router.get("/api/recipes/:user_id", (req, res) => {


    //add filtering
    let filter = req.query.filter;
    let user_id = req.params["user_id"];
 
    let query = "";
    let values= "";

   if (filter == ""){
        query = 'SELECT recipe_id, recipe_name, recipe_img FROM recipe WHERE recipe.user_id = ? ;';
        values = [user_id];
   }else if (filter == "favorite"){
        query = 'SELECT recipe.recipe_id, recipe.recipe_name, recipe.recipe_img FROM recipe INNER JOIN favorite ON recipe.recipe_id = favorite.recipe_id WHERE favorite.user_id = ?;';
        values = [user_id];
   }else {
        res.send({message: "No recipes found"});
   }
   

    db.query(query, values, (error, result, fields) => {

        if (result && result.length) {
            //write recipe to object
            const recipes = [];
            for (const recipe of result) {
                recipes.push(new Recipe(recipe.recipe_id, recipe.recipe_name,'', '', recipe.recipe_img));
            }
            res.send({recipes});
        } else {
            res.send({message: "No recipes found"});
        }
    });
})

module.exports = {
    router: router
}
