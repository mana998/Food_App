const router = require("express").Router();
const db = require("./../database/connection").connection; 

class Recipe {
    constructor (name, description, user_id, recipe_img) {
        this.name = name;
        this.description = description;
        this.user_id = user_id;
        this.recipe_img = recipe_img;
    }
}


router.get("/api/homeRecipes", (req, res) => {
    
    //get recipes from db


    db.query('SELECT * FROM recipe', (error, result, fields) => {


        //this part should be outside
        if (result.length != 0){
            
            //write recipe to object
            const recipes = [];
            for (const recipe in result){

                recipes.push(new Recipe(result[recipe].recipe_name, result[recipe].recipe_desc, result[recipe].user_id, result[recipe].recipe_img));
            }

            res.send({
                        recipes: recipes,
                        
                    });
        }else{
   
            res.send({
                message: "There is no recipes in the dtaabase"
            });
        }
    });
 

    
})

module.exports = {
    router: router
}
