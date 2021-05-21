const router = require("express").Router();
const db = require("./../database/connection").connection; 
const bcrypt = require("bcrypt");
const saltRounds = 15;



router.post("/api/login", (req, res) => {
    
    //console.log(req.body.username);

    db.query('SELECT * FROM user WHERE username=?;',[req.body.username], (error, result, fields) => {
        //console.log("error", error)
        //console.log("field", fields)
        //console.log("result", result)
        if (result && result.length === 1) {
            //console.log("result", result[0].user_id)
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

router.get("/api/login/:id", (req, res) => {
    updateActive(req.params.id, 1, res);
})

router.get("/api/logout/:id", (req, res) => {
    console.log('here');
    updateActive(req.params.id, 0, res);
})

function updateActive(id, active, res) {
    db.query('UPDATE user SET active=? WHERE user_id=?;',[active, id], (error, result, fields) => {
        if (!result || result.changedRows > 1) {
            //console.log("false");
            res.send({message: "Something went wrong. Try again."});
            //return false
        } else {
            //console.log("true");
            res.send({id: id});
            //return true;
        }

    }); 
}

router.post("/api/register", (req, res) => {
    
    //console.log(req.body.username);

    db.query('SELECT * FROM user WHERE username=?;',[req.body.username], (error, result, fields) => {
        //console.log("error", error)
        //console.log("field", fields)
        //console.log("result", result)
        if (result && result.length === 1){
            //console.log("result", result[0].user_id);
            res.send({message: "User with the same username already exists. Try again."});
        } else if (result.length === 0) {
            bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
                if (!error) {
                    db.query('INSERT INTO user (username, password) VALUES (?, ?);',[req.body.username, hash], (error, result, fields) => {
                        //console.log("insert")
                        //console.log("error", error)
                        //console.log("field", fields)
                        //console.log("result", result)
                        //console.log("result", result.affectedRows)
                        //console.log("result", typeof(result.affectedRows))
                        if (result.affectedRows === 1) {
                            res.send({message: "User added."});
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
