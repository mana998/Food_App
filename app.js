const express = require("express");
const app = express();
const session = require("express-session");
const fs = require('fs');
const fetch = require("node-fetch");
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




const header = fs.readFileSync(__dirname + '/public/header/header.html', 'utf8');
const recipes = fs.readFileSync(__dirname + '/public/recipes/recipes.html', 'utf8');
const chat = fs.readFileSync(__dirname + '/public/chat/chat.html', 'utf8');
const recipe = fs.readFileSync(__dirname + '/public/recipe/recipe.html', 'utf8');
const footer = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf8');
const homepage = fs.readFileSync(__dirname + '/public/homepage/homepage.html', 'utf8');
const myAccount = fs.readFileSync(__dirname + '/public/myAccount/myAccount.html', 'utf8');

app.get("/recipes", (req, res) => {
    res.send(header + chat + recipes + footer);
});

app.get("/recipes/:recipe_name", (req, res) => {
    res.send(header + chat + recipe + footer);
});

app.get("/", (req, res) => {
    res.send(header + chat + homepage + footer);
});

app.get("/myAccount/:user_id", (req, res) => {
    if (req.params.user_id) {
        res.send(header + chat + myAccount +footer);
    } else {
        res.send(header + chat + homepage + footer);
    }
});

//store active sockets
const sockets = {};

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
        io.emit("user list update", {message: "update"});
    })

    socket.on("user connected", (data) => {
        //store user id assigned to socket
        sockets[socket] = data.id;
    })

    socket.on("disconnect", () => {
        disconnect(socket);
    })
});

async function disconnect(socket) {
    //let fullURL =  req.protocol + '://' + req.get('host') + req.originalUrl;
    let fetchString = `http://localhost:8080/api/logout/${sockets[socket]}`;
    console.log(fetchString);
    let response = await fetch(fetchString);
    let result = await response.json();
    if (sockets[socket]) sockets[socket].delete;
    console.log("disconnect", result);
}

server.listen(process.env.PORT || 8080, (error) => {

    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});