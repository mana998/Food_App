const router = require("express").Router();
const db = require("./../database/connection").connection; 
const bcrypt = require("bcrypt");

const saltRounds = 15;

router.post("/api/login", (req, res) => {
    db.query('SELECT * FROM user WHERE username=?;',[req.body.username], (error, result, fields) => {
        if (result && result.length === 1) {
            bcrypt.compare(req.body.password, result[0].password, (error, match) => {
                if (match) {
                    res.send({
                        id: result[0].user_id
                    });
                } else {
                    res.send({
                        message: "Incorrect username or password. Try again."
                    });
                }
            })
        } else {
            res.send({
                message: "Incorrect username or password. Try again."
            });
        }
    });  
})

router.patch("/api/login", (req, res) => {
    updateActive(req.body.id, 1, res);
})

router.patch("/api/logout", (req, res) => {
    updateActive(req.body.id, 0, res);
})

function updateActive(id, active, res) {
    db.query('UPDATE user SET active=? WHERE user_id=?;',[active, id], (error, result, fields) => {
        if (!result || result.changedRows > 1) {
            res.send({
                message: "Something went wrong. Try again."
            });
        } else {
            res.send({
                id: id
            });
        }
    }); 
}

router.post("/api/register", (req, res) => {
    db.query('SELECT * FROM user WHERE username=?;',[req.body.username], (error, result, fields) => {
        if (result && result.length === 1) {
            res.send({
                message: "User with the same username already exists. Try again."
            });
        } else if (result.length === 0) {
            bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
                if (!error) {
                    db.query('INSERT INTO user (username, password) VALUES (?, ?);',[req.body.username, hash], (error, result, fields) => {
                        if (result.affectedRows === 1) {
                            res.send({
                                message: "User added."
                            });
                        } else {
                            res.send({
                                message: "Something went wrong. Try again."
                            });
                        }
                    });
                } else {
                    res.send({
                        message: "Something went wrong. Try again."
                    });
                }
            });
        } else {
           res.send({
                message: "Something went wrong. Try again."
            });
        }
    });
})

module.exports = {
    router: router
}
