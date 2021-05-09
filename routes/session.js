const router = require("express").Router();

router.get("/getsession", (req, res) => {
    console.log("getid", req.session.userId);
    if(typeof(req.session.id) == Number) {
        console.log("number");
    }
    res.send({id: req.session.userId});
})

router.post("/setsession", (req, res) => {
    console.log("session id",req.body.id);
    if (req.body.id) {
        req.session.userId = req.body.id;
        res.send({message: "Session set"});
    } else {
        res.send({message: "Session not set"});
    }
})

module.exports = {
    router: router
}
