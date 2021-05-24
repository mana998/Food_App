const router = require("express").Router();
const db = require("./../database/connection").connection; 
const User = require("./../models/User").User;

router.get("/api/chat", (req, res) => {
    let id = req.query.id || -1;
    let query = 'SELECT user_id, username FROM user WHERE user_id != ? && active = 1;'
    db.query(query, [id], (error, result, fields) => {
    
        //this part should be outside
        if (result && result.length) {
            
            //write user to object
            const users = [];
            for (const user of result) {
                users.push(new User(user.user_id, user.username));
            }
            res.send({users});
        } else {
            res.send({
                message: "No users found"
            });
        }
    });
})

module.exports = {
    router: router
}
