const express = require("express");
const app = express();

app.use(express.json());
//allow to pass form data
app.use(express.urlencoded({ extended: true}));

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 8080, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});