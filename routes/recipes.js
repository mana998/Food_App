const router = require("express").Router();

class Recipe {
    constructor (name) {
        this.name = name;
    }
}

//depending on parameters, modified array will be returned, but original one must remain unchanged
const recipes = [
    new Recipe (
        "Chocolate Cake", 
    ),
    new Recipe (
        "Butter-poached squid noodle", 
    ),
    new Recipe (
        "Pork Meat Pie", 
    ),
    new Recipe (
        "Egg Noodles", 
    ),
    new Recipe (
        "White Chocolate Cake", 
    ),
];

router.get("/api/recipes", (req, res) => {
    res.send({recipes});
})

module.exports = {
    router: router
}
