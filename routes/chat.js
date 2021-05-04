const router = require("express").Router();

class User {
    constructor (id, name) {
        this.id = id;
        this.name = name;
    }
}

//depending on parameters, modified array will be returned, but original one must remain unchanged
const users = [
    new User (
        1,
        "Chocolate Cake", 
    ),
    new User (
        2,
        "Butter-poached squid noodle", 
    ),
    new User (
        3,
        "Pork Meat Pie", 
    ),
    new User (
        4,
        "Egg Noodles", 
    ),
    new User (
        5,
        "White Chocolate Cake", 
    ),
];

router.get("/api/chat", (req, res) => {
    res.send({users});
})

module.exports = {
    router: router
}
