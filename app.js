const express = require("express");
const app = express();

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

server.listen(process.env.PORT || 8080, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});