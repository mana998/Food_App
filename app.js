const express = require("express");
const app = express();

//get the connection to db so yuo can run queries, connection fefined in folder database file connection.js
const db = require("./database/connection").connection; 


app.use(express.json());
//allow to pass form data
app.use(express.urlencoded({ extended: true}));

//setup sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

const recipesRouter = require("./routes/recipes.js");

const chatRouter = require("./routes/chat.js");


app.use(recipesRouter.router);
app.use(chatRouter.router);


const recipeRouter = require("./routes/recipe.js");
app.use(recipeRouter.router);


const fs = require('fs');

const recipes = fs.readFileSync(__dirname + '/public/recipes/recipes.html', 'utf8');
const chat = fs.readFileSync(__dirname + '/public/chat/chat.html', 'utf8');

app.get("/recipes", (req, res) => {
    res.send(recipes + chat);
});

//chat management
io.on('connection', (socket) => { 
    socket.on("client send message", (data) => {
        //console.log(data);
        //send to everyone but sender
        //will receive depending on passed id
        socket.broadcast.emit(`server send message ${data.to}`, {to: data.to, from: data.from, message: data.message});
    })
});

const recipe = fs.readFileSync(__dirname + '/public/recipe/recipe.html', 'utf8');

app.get("/recipe/:recipe_name", (req, res) => {

    res.send(recipe);
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



server.listen(process.env.PORT || 8080, (error) => {

    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});