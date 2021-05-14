const saltRounds = 15;

async function login(){
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let fetchString = `/api/login`;
    const response = await fetch(fetchString, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username.value, password: password.value})
    });
    username.value="";
    password.vaule="";
    let result = await response.json();
    if (result.id) {
        result = await setSession(result);
        if (result.id) {
            console.log(result.id);
            result = await updateLoginStatus(result.id);
            if (result.id) {
                await renderChat();
                await socket.emit("online users change");
                $('#loginModal').modal('hide');
            }
        }
    }
    $("#message").text(result.message);
}

async function setSession(loginResult) {
    //console.log("result session", result);
    const fetchString = `/setsession`;
    const response = await fetch(fetchString, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: loginResult.id})
    });
    const result = await response.json();
    return result;
}

async function updateLoginStatus(id) {
    const fetchString = `/api/login/${id}`;
    const response = await fetch(fetchString);
    const result = await response.json();
    return result;
}

function registerStart(){
    $("#repeatPasswordLabel").show();
    $("#repeatPassword").show();
    $("#register").attr("onclick","register()").removeClass("btn-secondary").addClass("btn-primary")
    $("#loginButton").attr("onclick", "loginStart()").addClass("btn-secondary").removeClass("btn-primary");
    $(".modal-title").text("Register");
}

function loginStart(){
    $("#repeatPasswordLabel").hide();
    $("#repeatPassword").hide();
    //$("#repeatPassword").remove();
    $("#register").attr("onclick","registerStart()").addClass("btn-secondary").removeClass("btn-primary")
    $("#loginButton").attr("onclick", "login()").removeClass("btn-secondary").addClass("btn-primary");
    $(".modal-title").text("Login");
}

async function register(){
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let repeatPassword = document.getElementById("repeatPassword");
    //console.log("username",username,"password",password, "repeatPassword", repeatPassword);
    if (password.value !== repeatPassword.value) {
        $("#message").text("Passwords do not match. Try again");
        password.value = '';
        repeatPassword.value = '';
        return;
    }
    let fetchString = `/api/register`;
    const response = await fetch(fetchString, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username.value, password: password.value})
    });
    const result = await response.json();
    $("#message").text(result.message);
}