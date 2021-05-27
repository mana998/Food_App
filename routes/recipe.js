const router = require("express").Router();
const db = require("./../database/connection").connection; 
const multer = require('multer');
const path = require('path');
const Recipe = require("./../models/Recipe").Recipe;
const Ingredient = require("./../models/Ingredient").Ingredient; 

router.get("/api/recipes/:recipe_name", (req, res) => {

    //get recipe from db
    db.query('SELECT * FROM recipe INNER JOIN ingredient_has_recipe ON recipe.recipe_id = ingredient_has_recipe.recipe_id INNER JOIN ingredient ON ingredient_has_recipe.ingredient_id = ingredient.ingredient_id INNER JOIN measurement ON ingredient.measurement_id = measurement.measurement_id WHERE recipe.recipe_name=?;',[req.params.recipe_name],
    (error, result, fields) => {
        if (result.length !== 0){
        
            //write recipe to object
            const ingredients = [];
            for (const ingredient of result){
                ingredients.push(new Ingredient(ingredient.ingredient_id, ingredient.ingredient_name, ingredient.measurement_name, ingredient.amount));
            };
            const recipe = new Recipe(result[0].recipe_id, result[0].recipe_name, result[0].recipe_desc, result[0].user_id, result[0].recipe_img, result[0].likes );
            res.send({
                recipe: recipe,
                ingredients: ingredients
            });
        } else {
            res.send({
                message: "This recipe does not exists."
            });
        }
    }); 
})

//const parseMulter = multer();


//Code neccessary for uploading the images. multer, path def at the top of the page!
const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb = collback function
        cb(null, './public/global/images'); //first arg is error, second destination
    },
    filename: (req, file, cb) => {
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
    limits: {fileSize: 5000000}, //def allowed file size   
}).single('image-recipe');

router.post("/api/recipe/recipeAdd", (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            res.send({
                message: "Make sure that your image is .jpg or .jpeg and has max. 5MB size."
            });
            return;
        }else {
            if (req.file === undefined) {
                res.send({
                    message: "No image selected."
                });
                return;               
            } else {
                res.send({
                    message: "Image uploaded."
                });             
            }  
        }

        //insert into recipe table
        const recipe_img = req.body.recipe_name.toLowerCase().split(" ").join("_");
        db.query("INSERT INTO recipe (recipe_name, recipe_desc, user_id, recipe_img) VALUES (?, ?, ?, ?);",[req.body.recipe_name, req.body.recipe_description, req.body.user_id, recipe_img], (error, result, fields) => {
            if (error) {
                throw error;
            } else {
                const recipe_id = result.insertId;
                if (recipe_id) {
                    let formObjectIngredients = req.body.ingredients;
                    let ingredients = [];
                    for (key in formObjectIngredients) {
                        ingredients.push(formObjectIngredients[key]);
                    }
                    if (ingredients.length !==0) {
                        for (let i in ingredients) {
                            db.query("INSERT INTO ingredient_has_recipe VALUES (?,?,?);",[ingredients[i].id, recipe_id,ingredients[i].amount], (error, result, fields) => {
                                if (error) {
                                    throw error;
                                } else {
                                    if (result.affectedRows === 0) {
                                        res.send({message: "Something went wrong. Try again."});
                                        return;
                                    }
                                } 
                            });
                        } 
                    }
                }
            }                     
            
        });
        
    });
})

router.put("/api/recipe/recipeUpdate", (req, res) => {
    upload(req, res, (err) => {
        const recipe_img = req.body.recipe_name.toLowerCase().split(" ").join("_");
        if (err) {
            res.send({
                message: "Make sure that your image is .jpg or .jpeg and has max. 1MB size."   
            });
            return;
        } else {
            if (req.file === undefined) {
                res.send({
                    message: "No image selected."
                });
                return;
            } else {
                res.send({
                    message: "Image uploaded."
                });
                
            }
        }
        //deletes unused images
        db.query('SELECT recipe_img from recipe WHERE recipe.recipe_id = ?', [req.body.recipe_id], (error, result, fields) => {
            if (error) {
                throw error;
            } else {
                if (result[0].recipe_img != recipe_img) {
                    const fs = require('fs');
                    const path = `./public/global/images/${result[0].recipe_img }.jpg`;
                    fs.unlink(path, err => {
                        if (err) {
                            console.error(err)
                            return;
                        }
                    });
                }                   
            }
        });

        //update  recipe table
        db.query("UPDATE recipe SET recipe_name = ?, recipe_desc = ?, recipe_img = ? WHERE recipe.recipe_id = ?;", [req.body.recipe_name, req.body.recipe_description, recipe_img, req.body.recipe_id], (error, result, fields) => {  
            if (error) {
                throw error;
            } else {
                if (result.affectedRows === 0) {
                    res.send({
                        message: "Something went wrong with updating. Try again."
                    });
                    return;
                }
            } 
        }); 

        //delete previous ingredients
        db.query("DELETE FROM ingredient_has_recipe WHERE ingredient_has_recipe.recipe_id = ?;", [req.body.recipe_id], (error, result, fields) => {
            if (error) {
                throw error;
            } else if (result.affectedRows === 0) {
                res.send({
                    message: "Something went wrong with updating ingredients. Try again."
                });
                return;     
            } 
        });

        //chceck if recipe has ingredients:
        let formObjectIngredients = req.body.ingredients;
        let ingredients = [];
        for (key in formObjectIngredients) {            
            ingredients.push(formObjectIngredients[key]);
        }
        if (ingredients.length !== 0) {

            //add new ingredients
            for (let i in ingredients){
                db.query("INSERT INTO ingredient_has_recipe VALUES (?,?,?);", [ingredients[i].id, req.body.recipe_id, ingredients[i].amount], (error, result, fields) => {
                    if (error) {
                        throw error;
                    } else if (result.affectedRows === 0) {
                        res.send({
                            message: "Something went wrong with updating ingredients. Try again."
                        });
                        return;
                    }    
                });
            }    
        }       
    });
})
                   
//adding to favorites
router.post('/api/recipe/addToFavorite', (req,res) => {
    const recipe_id = req.body.recipe_id;
    const user_id = req.body.user_id;
    db.query('INSERT INTO favorite VALUES (?,?)', [recipe_id, user_id], (error, result, fields) => {     
        if (error) {
            throw error;
        } else {
            if (result.affectedRows === 1) {
                res.send({
                    message: "Like added."
                });
            } else {
                res.send({
                    message: "Something went wrong. Try again."
                });
            }
        }      
    });
});

//delete from favorite
router.delete('/api/recipe/deleteFromFavorite', (req,res) => {
    const recipe_id = req.body.recipe_id;
    const user_id = req.body.user_id;
    db.query('DELETE FROM favorite WHERE favorite.recipe_id = ? AND favorite.user_id = ?', [recipe_id, user_id], (error, result, fields) => {
        if (error) {
            throw error;
        } else {
            if (result.affectedRows === 1) {
                res.send({
                    message: "Like deleted."
                });
            } else {
                res.send({
                    message: "Something went wrong. Try again."
                });
            }
        }      
    });
})

module.exports = {
    router: router
}
