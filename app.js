const express = require("express");
const app = express();
const session = require("express-session");
const fs = require('fs');
//const bcrypt = require("bcrypt");

//get the connection to db so yuo can run queries, connection defined in folder database file connection.js
const db = require("./database/connection").connection; 

//setup sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(session({
    secret: 'keyboard cat', //will see later
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.json());
//allow to pass form data
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));

const recipesRouter = require("./routes/recipes.js");
const chatRouter = require("./routes/chat.js");
const loginRouter = require("./routes/login.js");
const sessionRouter = require("./routes/session.js");
const recipeRouter = require("./routes/recipe.js");

app.use(recipesRouter.router);
app.use(chatRouter.router);
app.use(loginRouter.router);
app.use(sessionRouter.router);
app.use(recipeRouter.router);

const homeRecipesRouter = require("./routes/homeRecipes.js");
app.use(homeRecipesRouter.router);


const header = fs.readFileSync(__dirname + '/public/header/header.html', 'utf8');
const recipes = fs.readFileSync(__dirname + '/public/recipes/recipes.html', 'utf8');
const chat = fs.readFileSync(__dirname + '/public/chat/chat.html', 'utf8');
const recipe = fs.readFileSync(__dirname + '/public/recipe/recipe.html', 'utf8');
const footer = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf8');
const homepage = fs.readFileSync(__dirname + '/public/homepage/homepage.html', 'utf8');

app.get("/recipes", (req, res) => {
    res.send(header + recipes + chat);
});

app.get("/recipes/:recipe_name", (req, res) => {
    res.send(header + recipe + chat + footer);
});

app.get("/", (req, res) => {
    res.send(header + homepage +footer +chat);
});

//chat management
io.on('connection', (socket) => { 
    socket.on("client send message", (data) => {
        //console.log(data);
        //send to everyone but sender
        //will receive depending on passed id
        socket.broadcast.emit(`server send message ${data.to}`, {to: data.to, from: data.from, message: data.message});
    })

    socket.on("online users change", (data) => {
        //send to all
        console.log("update server");
        io.emit("user list update", {message: "update"});
    })
});


server.listen(process.env.PORT || 8080, (error) => {

    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});