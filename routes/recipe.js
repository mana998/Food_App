const router = require("express").Router();
const db = require("./../database/connection").connection; 

class Recipe {
    constructor (name, description, user_id) {
        this.name = name;
        this.description = description;
        this.user_id = user_id;
        //there should be url in db form img 
    }
}



router.get("/api/recipe/:recipe_name", (req, res) => {
    
    //get recipe from db
    
    db.query('SELECT * FROM recipe WHERE recipe_name=? ;',[req.params.recipe_name], (error, result, fields) => {
    //this part should be outside
        if (result){
            //write recipe to object
            const recipe = new Recipe(result[0].recipe_name, result[0].recipe_desc, result[0].user_id );

            res.send({recipe});
        }else{
            res.redirect("/recipes");
        }
    });
 

    
})

module.exports = {
    router: router
}
