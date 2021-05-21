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
    let query = `SELECT recipe_id, recipe_name, recipe_img, likes FROM recipe ORDER BY ${filter} ${direction} LIMIT ? OFFSET ?;`;
    values = [Number(size), Number((page - 1) * size)];

    db.query(query, values, (error, result, fields) => {
        //console.log("result", result);
        if (result && result.length) {
            //write recipe to object
            const recipes = [];
            for (const recipe of result) {
                recipes.push(new Recipe(recipe.recipe_id, recipe.recipe_name,'', '', recipe.recipe_img, recipe.likes));
            }
            res.send({recipes});
        } else {
            res.send({message: "No recipes found"});
        }
    });
})

router.get("/api/recipes/user/:user_id", (req, res) => {

    //add filtering
    let filter = req.query.filter;
    let user_id = req.params["user_id"];
 
    let query = "";
    let values= "";

   if (filter == ""){
        query = 'SELECT recipe_id, recipe_name,recipe.recipe_desc, recipe_img, recipe.likes FROM recipe WHERE recipe.user_id = ? ;';
        values = [user_id];
   }else if (filter == "favorite"){
        query = 'SELECT recipe.recipe_id, recipe.recipe_name,recipe.recipe_desc, recipe.recipe_img, recipe.likes FROM recipe INNER JOIN favorite ON recipe.recipe_id = favorite.recipe_id WHERE favorite.user_id = ?;';
        values = [user_id];
   }else {
        res.send({message: "No recipes found"});
   }
   

    db.query(query, values, (error, result, fields) => {

        if (result && result.length) {
            //write recipe to object
            const recipes = [];
            for (const recipe of result) {
                recipes.push(new Recipe(recipe.recipe_id, recipe.recipe_name,recipe.recipe_desc, '', recipe.recipe_img, recipe.likes));
            }
            res.send({recipes});
        } else {
            res.send({message: "No recipes found"});
        }
    });
})

router.get("/api/recipes/ingredients", (req, res) => {

    console.log(req.query.ingredients);
    let values = [];
    //if (req.query.ingredients && req.query.ingredient.lengths > 0) {
    if (req.query.ingredients) values = [...req.query.ingredients];
    /*`SELECT recipe.recipe_id, recipe_name, recipe_img, likes, ingredient_has_recipe.ingredient_id  FROM recipe 
	INNER JOIN ingredient_has_recipe 
	ON recipe.recipe_id = ingredient_has_recipe.recipe_id
	WHERE ingredient_id = ?
	GROUP BY recipe_id
    ) AS t0 `;*/
    let query = `SELECT recipe.recipe_id, recipe_name, recipe_img, likes, ingredient_has_recipe.ingredient_id  FROM recipe INNER JOIN ingredient_has_recipe ON recipe.recipe_id = ingredient_has_recipe.recipe_id WHERE ingredient_id = ? GROUP BY recipe_id) AS t0 `;
    if (req.query.ingredients && req.query.ingredients.length > 1) {
        req.query.ingredients.map((id, index) => {
            if (index !== 0) {
                query = `(SELECT t${index - 1}.recipe_id, recipe_name, recipe_img, likes FROM ( ${query}`;
                /* `INNER JOIN ingredient_has_recipe
                ON t${index - 1}.recipe_id = ingredient_has_recipe.recipe_id
                WHERE ingredient_has_recipe.ingredient_id = ?
                GROUP BY recipe_id) AS t${index} `;*/
                query += `INNER JOIN ingredient_has_recipe ON t${index - 1}.recipe_id = ingredient_has_recipe.recipe_id WHERE ingredient_has_recipe.ingredient_id = ? GROUP BY recipe_id) AS t${index} `;
                //values.unshift(id);
            }
        })
    }
    //console.log(query);
    //query = "(SELECT t0.recipe_id, recipe_name, recipe_img, likes FROM ( SELECT recipe.recipe_id, recipe_name, recipe_img, likes, ingredient_has_recipe.ingredient_id  FROM recipe INNER JOIN ingredient_has_recipe ON recipe.recipe_id = ingredient_has_recipe.recipe_id WHERE ingredient_id = ? GROUP BY recipe_id) AS t0 INNER JOIN ingredient_has_recipe ON t0.recipe_id = ingredient_has_recipe.recipe_id WHERE ingredient_has_recipe.ingredient_id = ? GROUP BY recipe_id) AS t0";
    console.log("\nnq", query);
    let regex = /^\(?(.*)/;
    //console.log("regex",regex)
    //let newquery = query.replace("^\(?(.*)(\) AS t(\d)+)?$", '$1;')
    //console.log("test", query.match(regex));
    query = query.replace(regex, '$1')
    console.log("\nnq", query);
    regex = /^(.+?)(\) AS t(\d)+ )?$/;
    query = query.replace(regex, '$1;')
    //let regex = /^\(*+(.+?)(\) AS t(\d)+ )?$/;
    //query = query.replace(regex, '$1;')
    console.log("\nnq", query);
    //console.log(values);
    //needs to be in there as else it is putting it into quotes
    //let query = `SELECT recipe_id, recipe_name, recipe_img, likes FROM recipe INNER JOIN ingredient_has_recipe WHERE ingredient_id = ? ;`;
    //let values = [...req.query.ingredients]
    db.query(query, values, (error, result, fields) => {
        console.log("result", result);
        if (result && result.length) {
            //write recipe to object
            const recipes = [];
            for (const recipe of result) {
                recipes.push(new Recipe(recipe.recipe_id, recipe.recipe_name,'', '', recipe.recipe_img, recipe.likes));
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
