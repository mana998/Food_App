const express = require("express");
const app = express();

app.use(express.json());
//allow to pass form data
app.use(express.urlencoded({ extended: true}));

app.use(express.static(__dirname + '/public'));

const recipesRouter = require("./routes/recipes.js");
const chatRouter = require("./routes/chat.js");

app.use(recipesRouter.router);
app.use(chatRouter.router);


const fs = require('fs');

const recipes = fs.readFileSync(__dirname + '/public/recipes/recipes.html', 'utf8');
const chat = fs.readFileSync(__dirname + '/public/chat/chat.html', 'utf8');

app.get("/recipes", (req, res) => {
    res.send(recipes + chat);
});

const server = app.listen(process.env.PORT || 8080, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});