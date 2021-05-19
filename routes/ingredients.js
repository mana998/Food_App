const router = require("express").Router();
const db = require("./../database/connection").connection; 

const Ingredient = require("./../models/Ingredient").Ingredient;

router.get("/api2/ingredients", (req, res) => {
    console.log("here");
    //needs to be in there as else it is putting it into quotes
    let query = `SELECT ingredient_id, ingredient_name FROM ingredient ORDER BY ingredient_name ASC;`;

    db.query(query, (error, result, fields) => {
        if (result && result.length) {
            //write recipe to object
            const ingredients = [];
            for (const ingredient of result) {
                ingredients.push(new Ingredient(ingredient.ingredient_id, ingredient.ingredient_name));
            }
            res.send({ingredients});
        } else {
            res.send({message: "No ingredients found"});
        }
    });
})


module.exports = {
    router: router
}
