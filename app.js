const express = require("express");
const app = express();

//get the connection to db so yuo can run queries, connection fefined in folder database file connection.js
const db = require("./database/connection").connection; 


app.use(express.json());
//allow to pass form data
app.use(express.urlencoded({ extended: true}));

app.use(express.static(__dirname + '/public'));

const recipesRouter = require("./routes/recipes.js");

app.use(recipesRouter.router);


const fs = require('fs');

const recipes = fs.readFileSync(__dirname + '/public/recipes/recipes.html', 'utf8');

app.get("/recipes", (req, res) => {
    res.send(recipes);
});


//database example queries!! for USER table it will be run every time you run app.js

/*

//create check if user already exists
db.query(`INSERT INTO user (username, password, active) VALUES (?, ?, ?);`, ["Perdro", "Password",1], (error, result, fields) => {
    console.log(result);
});


//read
db.query('SELECT * FROM user;', (error, result, fields) => {
    console.log(result);
});


//update, we should check first if username already exists
db.query('UPDATE user SET username = "Dan", password="SecurePassword"  WHERE user_id = 1', (erro, result, fields) => {
    console.log(result);
})


//delete
db.query("DELETE FROM user WHERE username = 'Dan'", (error, result, fields) => {
    console.log(result);
})
;

*/

const server = app.listen(process.env.PORT || 8080, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});