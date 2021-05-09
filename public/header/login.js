const saltRounds = 15;

async function login(){
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    console.log("username",username,"password",password);
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
    const result = await response.json();
    console.log("RESUUUUUUUULT", result);
    await setSession(result);
}

async function setSession(loginResult) {
    if (loginResult.message) {
        $("#message").text(loginResult.message);
    } else if (loginResult.id) { //set session
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
        console.log("session", result);
        if (result.message === "Session set") {
            $('#loginModal').modal('hide');
        }
    }
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
    if (result.message) {
        $("#message").text(result.message);
    } else { 

    }
}