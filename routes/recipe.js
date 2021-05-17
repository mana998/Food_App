const router = require("express").Router();
const db = require("./../database/connection").connection; 
const multer = require('multer');
const path = require('path');

const Recipe = require("./../models/Recipe").Recipe;
const Ingredient = require("./../models/Ingredient").Ingredient; 

router.get("/api/recipes/:recipe_name", (req, res) => {
    
    //get recipe from db
    db.query('SELECT * FROM recipe INNER JOIN ingredient_has_recipe ON recipe.recipe_id = ingredient_has_recipe.recipe_id INNER JOIN ingredient ON ingredient_has_recipe.ingredient_id = ingredient.ingredient_id INNER JOIN measurement ON ingredient.measurement_id = measurement.measurement_id WHERE recipe.recipe_name=?;',[req.params.recipe_name.toLowerCase()],
    (error, result, fields) => {

        if (result.length != 0){
            
            //write recipe to object
            const ingredients = [];
            for (const ingredient in result){

                ingredients.push(new Ingredient(result[ingredient].id,result[ingredient].ingredient_name, result[ingredient].measurement_name, result[ingredient].amount));
            };
            const recipe = new Recipe(result[0].recipe_id, result[0].recipe_name, result[0].recipe_desc, result[0].user_id, result[0].recipe_img );
         
            res.send({
                        recipe: recipe,
                        ingredients: ingredients
                    });
        }else{
   
            res.send({
                message: "This recipe does not exists."
            });
        };
    }); 
});

router.get("/api/ingredients", (req, res) => {
    
    //get ingredients from db
    db.query('SELECT * FROM ingredient INNER JOIN measurement ON ingredient.measurement_id = measurement.measurement_id;', (error, result, fields) => {
  
        if (result.length != 0){
            
            //write recipe to object
            const ingredients = [];
            for (const ingredient in result){

                ingredients.push(new Ingredient(result[ingredient].ingredient_id,result[ingredient].ingredient_name, result[ingredient].measurement_name));
            }      
            res.send({
                        ingredients: ingredients
                    });
        }else{
            res.send({
                message: "There is no ingredients."
            });
        }
    });  
});

//Code neccessary for uploading the images. multer, path def at the top of the page!

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb = collback function
        cb(null, './public/global/images') //first arg is error, second destination
    },
    filename: (req, file, cb) => {
        console.log(req.file)
        if (file.mimetype!=='image/jpg' && file.mimetype !=='image/jpeg') {
            let err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, req.body.recipe_name.toLowerCase().split(" ").join("_") + '.jpg');
        }
    }

});
const upload = multer({
    storage: storage, //holds the destnation and filename
    limits: {fileSize: 1000000}, //def allowed file size
    
}).single('image-recipe');

router.post("/api/recipeAdd", (req, res) => {

    upload(req,res,(err) => {

        //insert into recipe table
        const recipe_img = req.body.recipe_name.toLowerCase().split(" ").join("_");
        const user_id = 6;

        db.query("INSERT INTO recipe (recipe_name, recipe_desc, user_id, recipe_img) VALUES (?, ?, ?, ?);",[req.body.recipe_name, req.body.recipe_description, user_id, recipe_img],
            (error, result, fields) => {
            
                if (error){
                    throw error;
                }else{
                    const recipe_id = result.insertId;

                   //retrive names of the ingredents and input them into db
    
                    let formObjectIngredients = req.body.ingredients;
                    let ingredients = [];
                
                    for (key in formObjectIngredients){
                        
                        ingredients.push(formObjectIngredients[key]);
                    }
                    for (let i in ingredients){
                        db.query("INSERT INTO ingredient_has_recipe VALUES (?,?,?);",[ingredients[i].id, recipe_id,ingredients[i].amount],
                        (error, result, fields) => {
                            if (error){
                                throw error;
                            }
                        });

                    }                     
                }
        });

        if (err){
            res.send({
                message: "Make sure that your image is .jpg or .jpeg and has max. 1MB size.",
            });
        }else {
            if(req.file == undefined){
                res.send({
                message: "No image selected."});
            }else{

                res.send({
                    message: "Image uploaded."});
            }
            
            
        }
    })

})

router.put("/api/recipeUpdate", (req, res) => {


    upload(req,res,(err) => {

        //insert into recipe table
        const recipe_img = req.body.recipe_name.toLowerCase().split(" ").join("_");
        const user_id = 6;


        let query = "UPDATE recipe SET recipe_name = ?, recipe_desc = ?, recipe_img = ? WHERE recipe.user_id = ?) VALUES (?, ?, ?, ?);";
        let parameters = [req.body.recipe_name, req.body.recipe_description, recipe_img, user_id];

        let query2 = "DELETE ingredient_has_recipe WHERE ingredient_has_recipe.recipe_id = ?;";
        let parameters2 = [recipe_id];

        let query3 = "INSERT INTO ingredient_has_recipe VALUES (?,?,?);";
        let parameters3 = [ingredients[i].id, recipe_id,ingredients[i].amount];

            //delete previous file
            /*
            db.query('SELECT recipe_img from recipe WHERE recipe.recipe_name = ?',[req.body.recipe_name],
                (error, result, fields) => {
                    if (error){
                        throw error;
                    }else{

                        const fs = require('fs')

                        const path = `./${result[0].recipe_img }.jpg`

                        fs.unlink(path, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }

                        //file removed
                        })
                    }
                });
                */
        

        db.query(query,parameters,
            (error, result, fields) => {
            
                if (error){
                    throw error;
                }else{
                    const recipe_id = result.insertId;

                   //retrive names of the ingredents and input them into db
    
                    let formObjectIngredients = req.body.ingredients;
                    let ingredients = [];
                
                    for (key in formObjectIngredients){
                        
                        ingredients.push(formObjectIngredients[key]);
                    }
                    for (let i in ingredients){
                        //deletes old ingredients list
                        db.query(query2,parameters2,
                        (error, result, fields) => {
                            if (error){
                                throw error;
                            }
                        });
                        //inserts new ingrdients
                        db.query(query3,parameters3,
                            (error, result, fields) => {
                                if (error){
                                    throw error;
                                }
                        });
                    }                     
                }
        });

        if (err){
            res.send({
                message: "Make sure that your image is .jpg or .jpeg and has max. 1MB size.",
            });
        }else {
            if(req.file == undefined){
                res.send({
                message: "No image selected."});
            }else{

                res.send({
                    message: "Image uploaded."});
            }    
        }
    })
})

//adding to favorites
router.post('/api/addToFavorite', (req,res) => {
    const recipe_id = req.body.recipe_id;
    const user_id = req.body.user_id;

    db.query('INSERT INTO favorite VALUES (?,?)',[recipe_id, user_id], (error, result, fields) => {
            
        if (error){
            throw error;
        }else {
            if (result.affectedRows === 1) {
                res.send({message: "Like added."});
            } else {
                res.send({
                    message: "Something went wrong. Try again."
                });
            }
        }      
    });
});

//delete from favorite
router.delete('/api/deleteFromFavorite', (req,res) => {
    const recipe_id = req.body.recipe_id;
    const user_id = req.body.user_id;
    console.log(recipe_id, user_id);

    db.query('DELETE FROM favorite WHERE favorite.recipe_id = ? AND favorite.user_id = ?',[recipe_id, user_id], (error, result, fields) => {
        console.log(result);
        if (error){
            throw error;
        }else {
            if (result.affectedRows === 1) {
                res.send({message: "Like deleted."});
            } else {
                res.send({
                    message: "Something went wrong. Try again."
                });
            }
        }      
    });
});

module.exports = {
    router: router
}
