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
                    db.query('UPDATE user SET active=1 WHERE user_id=?;',[result[0].user_id], (error, updateResult, fields) => {
                        //console.log(result);
                        if (updateResult.changedRows !==1) {
                            res.send({
                                message: "Something went wrong. Try again."
                            });
                         } else {
                            res.send({id: result[0].user_id});
                         }
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


router.post("/api/register", (req, res) => {
    
    console.log(req.body.username);

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
