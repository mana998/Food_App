const router = require("express").Router();
const db = require("./../database/connection").connection; 

const Recipe = require("./../models/Recipe").Recipe;

router.get("/api/recipes", (req, res) => {

    let page = req.query.page || 1;
    let size = req.query.size;
    //add filtering
    let filter = req.query.filter;

    let query = 'SELECT recipe_name, recipe_img FROM recipe LIMIT ? OFFSET ?;'

    db.query(query, [Number(size), Number((page - 1) * size)], (error, result, fields) => {
    
        //this part should be outside
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



module.exports = {
    router: router
}
