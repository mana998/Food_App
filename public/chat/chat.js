//save messages on page change
//classes only used here
class Message {
    constructor(from, sender, text) {
        this.from = from;
        this.sender = sender;
        this.text = text;
    }
}

class Chat {
    constructor(id, name, messages) {
        this.id = id;
        this.name = name;
        this.messages = messages || [];
    }
}


//setup socket
const socket = io();

let toggle = true;

const maxChats = 3;

let myId;

//whether chat has already been rendered
let rendered = false;

//show or hide chat window
function toggleChat(id) {
    //console.log("toggleChat");
    //console.log(id);
    //console.log("1",toggle);
    let className;
    let toggleChat;
    if (id) {
        //console.log("id", id);
        className = `.specific-user-chat.${id}`;
        //console.log("openchats2",openChats);
        let userId = openChats.findIndex(
            element => {
                //console.log("element", element);
                //console.log(Number(element.id) === Number(id));
                return Number(element.id) === Number(id)}
            );
        //console.log("finished user", user);
        user = openChats[userId];
        user.toggle = !user.toggle;
        //console.log("found ",openChats.indexOf(user));
        //console.log("toggleeee",openChats[userId].toggle);
        openChats[userId].toggle = user.toggle;
        toggleChat = user.toggle;
    } else {
        className = ".user-chat";
        toggle = !toggle;
        toggleChat = toggle;
    }
    //console.log("toggle2",toggle);
    //console.log("togglechat1",toggleChat);
    //console.log("className",className);
    if (toggleChat){
        //console.log("hide");
        $(className).hide();
    } else {
        //console.log("show");
        $(className).show();
    }
}

//opened single chat
let openChats = [];
//all selected chats by id
let chats = {}; 

//generate one user in chat list
function generateUser(user) {
    //console.log(user);
    return(
    `<div class="user-chat" onClick="openChat({id:${user.id}, name:'${user.name}'})">
        <p class="user-name">${user.name}</p>
</div>`);
}

//generate separate user chat
function generateUserChat(user, index) {
    //console.log(user);
    return(
        `<div class="user-chat-item chat ${user.id}" style="right: calc(15em * (${index >= 0 ? index + 1 : openChats.length}))">
            <div class="control-bar-user ${user.id}" onclick="toggleChat(${user.id})">${user.name}
                <button class="close-chat" onClick="closeChat(${user.id})">X</button>
            </div>
            <div class="specific-user-chat ${user.id}"> 
                <div class="user-messages ${user.id}">
                </div>
                <input id="message${user.id}" class="chat-input" type="text">
                <button onClick="sendMessage(${user.id})" class="chat-send">SEND</button>
            </div>
    </div>`);
}

function sendMessage(id) {
    let message = document.getElementById(`message${id}`).value;
    if (message) {
        //empty the box
        document.getElementById(`message${id}`).value = '';
        //console.log("sent msg");
        //console.log(message);
        //add your message to chat
        renderMessage(id, true, message);
        chats[id].messages.push(new Message(id, true, message));
        //console.log("messaaage",chats);
        //send message
        socket.emit("client send message", { to: id, from: myId , message : message})
    }
};

socket.on("user list update", (data) => {
    //console.log("update");
    renderChat();
})

function generateMessage(position, message) {
    return `<p class="user-message ${position} ${message.length <= 20 ? 'short' : 'long'}">${message}</p></br>`;
}

//generate message either by sender or recipient
function renderMessage(id, isSender, message) {
    let position = isSender ? "right" : "left";
    //console.log("position", position);
    $(`.user-messages.${id}`).append(generateMessage(position, message));
}


function openChat(user) {
    if (!openChats.find(element => element.id === user.id) && openChats.length < maxChats) {
        openChats.push({id: user.id, name: user.name, toggle: false});
        //console.log(user.id);
        $("body").append(generateUserChat(user));
        chats[user.id] = new Chat(user.id, user.name);
    }
}

async function renderChat() {
    //console.log("renderChat()");
    let response = await getSession();
    //console.log("response", response);
    if (response && response.length) {
        myId = response[0];
        chats = response[1] || {};
        openChats = response[2] || [];
    }
    //console.log("myId", myId);
    //console.log("chats", chats);
    //console.log("openChats", openChats);
    //console.log("myId", myId);
    if (myId) {
        if (!rendered) {
            //let server know that user is logged in
            //socket.emit("user connected", ({id: myId}));
            rendered = true;
            //setup socket
            socket.on(`server send message ${myId}`, (data) => {
                //console.log("received msg", data);
                chats[data.from].messages.push(new Message(data.from, false, data.message));
                //add message to chat
                renderMessage(data.from, false, data.message);
            });
        }
        //get only username and id except user with specified id
        let fetchString = `/api/chat?id=${myId}`;
        const response = await fetch(fetchString);
        const result = await response.json();
        $(".chat-container .user-chat").remove();
        $(".chat-container .no-users").remove();
        if (result.users && result.users.length) {
            result.users.map(user => {
                $(".chat-container").append(generateUser(user));
            });
        } else {
            $(".chat-container").append(`<p class="no-users">No users found</p>`);
        }
    }
    if (openChats && openChats.length) {
        openChats.map((chat, index) => {
            //console.log(chat);
            //chats[chat.id] = new Chat(chat.id, chat.name);
            //console.log("chat",chat,"index",index);
            $("body").append(generateUserChat(chat, index));
        })
    }
    if (chats) {
        for (let key in chats) {
            if (chats[key].messages && chats[key].messages.length) {
                chats[key].messages.map(message => {
                    //console.log("client 2",message);
                    renderMessage(message.from, message.sender, message.text);
                });
            }
        };
    }
};

async function getSession() {
    let fetchString = `/getsession`;
    const response = await fetch(fetchString);
    const result = await response.json();
    if (result.id) {
        return [result.id, result.chats, result.openChats];
    } else {
        console.log("Something went wrong");
    }

};

function closeChat(id) {
    $(`.user-chat-item.chat.${id}`).remove();
    //find index of element to remove
    let userId = openChats.findIndex(
        element => {
            return Number(element.id) === Number(id)}
    );
    //remove from open chats;
    openChats.splice(userId, 1);
    delete chats[id];
    //move all the other elements
    if (userId < openChats.length) {
        for (let i = userId; i < openChats.length; i++) {
            //set new position of chat window
            let pos = i + 1;
            $(`.user-chat-item.chat.${openChats[i].id}`).css("right", `calc(15em * (${pos}))`);
        }
    }
}

window.addEventListener("load", () => renderChat());


window.addEventListener("beforeunload", () => {
    saveChatSession();
});

async function saveChatSession() {
    const fetchString = `/setsession/chat`;
    //console.log("chats unload", chats);
    //console.log("openChats", openChats);
    const response = await fetch(fetchString, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chats: chats, openChats: openChats})
    });
    const result = await response.json();
    if (result.message === "Session not set") {
        alert("Something went wrong with loading chats.");
    }
}
