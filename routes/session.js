const router = require("express").Router();

router.get("/getsession", (req, res) => {
    res.send({id: req.session.id});
})

router.post("/setsession", (req, res) => {
    console.log("session id",req.body.id);
    req.session.id = req.body.id;
    res.send({message: "Session set"});
})

module.exports = {
    router: router
}
