function generateRecipe(recipe){
    return(
    `<div class="col-12 account-recipe-item">
        <div class="img-size">
            <a href="/recipes/${recipe.name}" >
                <img class="home-image" src="./../global/images/${recipe.img}.jpg" alt="">
            </a>
        </div>
        <div class="image-name">
            <p>${recipe.name}</p>
            <img class="icon" src="./../global/icons/heart.png" alt="heart icon"></img>
            <img class="icon" src="./../global/icons/update.png" alt="update icon"></img>
        </div>
    
    </div>`);
}

async function renderMyRecipes(filter1, filter2) {

    
    let fetchString = `/api/recipes?user_id=${filter1}`;
    const response = await fetch(fetchString);
    const result = await response.json();

    if (result.recipes && result.recipes.length) {
        result.recipes.map(recipe => {
            $("#your-recipes").append(generateRecipe(recipe));
        });
    } else if (result.message) {
        $(append).append(`<h2>${result.message}</h2>`);
    } else {
        $(append).append(`<h2>Something went wrong</h2>`);
    }

    let fetchString2 = `/api/recipes?filter=${filter2}`;
    const response2 = await fetch(fetchString2);
    const result2 = await response2.json();

    if (result2.recipes && result2.recipes.length) {
        result2.recipes.map(recipe => {
            $("#favorite-recipes").append(generateRecipe(recipe));
        });
    } else if (result2.message) {
        $(append).append(`<h2>${result2.message}</h2>`);
    } else {
        $(append).append(`<h2>Something went wrong</h2>`);
    }
};

//render recipes automatically if on recipes page
if (window.location.pathname.match("myAccount")) {
    renderMyRecipes(1, "favorites"); //session user id
}



$(document).ready(function(){
    $("#favorite").click(function(){
      $("#favorite-recipes").toggle(500, function(){
        alert("Click again to see/hide recipes");
      });
    });

});