//setup socket
const socket = io();

//temporary placeholder user
let user = {
    id: 1
};


let toggle = true;

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

let openChats = [];

//generate one user in chat list
function generateUser(user) {
    //console.log(user);
    return(
    `<div class="user-chat" onClick="openChat({id:${user.id}, name:'${user.name}'})">
        <p class="user-name">${user.name}</p>
</div>`);
}

//generate separate user chat
function generateUserChat(user) {
    //console.log(user);
    return(
        `<div class="user-chat-item chat ${user.id}" style="right: calc(15em * (${openChats.length}))">
            <div class="control-bar-user ${user.id}" onclick="toggleChat(${user.id})">${user.name}
                
            </div>
            <button onClick="closeChat(${user.id})">X</button>
            <div class="specific-user-chat ${user.id}"> 
                <div class="user-messages ${user.id}">
                    <p class="user-name">${user.name}</p>
                </div>
                <input id="message${user.id}" type="text">
                <button onClick="sendMessage(${user.id})">SEND</button>
            </div>
    </div>`);
}

function sendMessage(id) {
    let message = document.getElementById(`message${id}`).value;
    //empty the box
    document.getElementById(`message${id}`).value = '';
    //console.log("sent msg");
    //console.log(message);
    //add your message to chat
    renderMessage(id, true, message)
    //send message
    socket.emit("client send message", { to: id, from: user.id , message : message})
};
//receive message - store id from login
socket.on(`server send message ${user.id}`, (data) => {
    console.log("received msg", data);
    //add message to chat
    renderMessage(data.from, false, data.message);
})

function generateMessage(position, message) {
    return `<p class="user-message ${position}">${message}</p>`;
}

//generate message either by sender or recipient
function renderMessage(id, isSender, message) {
    let position = isSender ? "right" : "left";
    //console.log("position", position);
    $(`.user-messages.${id}`).append(generateMessage(position, message));
}


function openChat(user) {
    if (!openChats.find(element => element.id === user.id)) {
        openChats.push({id: user.id, name: user.name, toggle: false});
        //console.log(user.id);
        $("body").append(generateUserChat(user));
    }
}

async function renderChat() {
    let fetchString = `/api/chat`;
    const response = await fetch(fetchString);
    const result = await response.json();
    if (result.users.length) {
        result.users.map(user => {
            $(".chat-container").append(generateUser(user));
        });
    } else {
        $(append).append("<h2>No users found</h2>");
    }
};

function closeChat(id) {
    $(`.user-chat-item.chat.${id}`).remove();
    //find index of element to remove
    let userId = openChats.findIndex(
        element => {
            //console.log("element",element);
            return Number(element.id) === Number(id)}
    );
    //remove
    openChats.splice(userId, 1);
    //move all the other elements
    if (userId < openChats.length) {
        for (let i = userId; i < openChats.length; i++) {
            //set new position of chat window
            let pos = i + 1;
            $(`.user-chat-item.chat.${openChats[i].id}`).css("right", `calc(15em * (${pos}))`);
        }
    }
}

renderChat();