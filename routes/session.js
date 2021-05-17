const router = require("express").Router();

router.get("/getsession", (req, res) => {
    //console.log("getid", req.session.userId);
    /*if(typeof(req.session.id) == Number) {
        console.log("number");
    }*/
    //console.log("session", req.session);
    res.send({
        id: req.session.userId, 
        chats: req.session.chats, 
        openChats: req.session.openChats
    });
})

router.post("/setsession/id", (req, res) => {
    //console.log("session id",req.body.id);
    if (req.body.id) {
        req.session.userId = req.body.id;
        res.send({id: req.body.id, message: "Session set"});
    } else {
        res.send({message: "Session not set"});
    }
})

router.post("/setsession/chat", (req, res) => {
    //console.log("session id",req.body.id);
    //console.log(req.body);
    if (req.body.chats && req.body.openChats) {
        req.session.chats = req.body.chats;
        req.session.openChats = req.body.openChats;
        //console.log("session chats", req.session.chats)
        /*if (req.session.chats) {
            console.log("is iterable");
            for (id in req.session.chats) {
                let tempMessages = [];
                console.log("one chat", id);
                if (req.session.chats[id].messages && req.session.chats[id].messages.length) {
                    req.session.chats[id].messages.map(message => {
                        console.log("messaage", message);
                        tempMessages.push(new Message(message.from, message.sender, message.text));
                    })
                    req.session.chats[id].messages = tempMessages;
                    console.log(req.session.chats[id].messages);
                }
            }
        }*/
        //console.log("session body chats", req.body.chats)
        res.send({message: "Session set"});
    } else {
        res.send({message: "Session not set"});
    }
})

router.get("/destroysession", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.send({ message: "Something went wrong"});
        } else {
            res.send({ message: "Session destroyed"});
        }
    });
})

module.exports = {
    router: router
}
