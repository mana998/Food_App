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
//change the code, THE FILTERS!!!!!!!

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
    renderIngredients();
}



$(document).ready(function(){
    let state =0;
    $("#favorite").click(function(){
        $("#favorite-recipes").toggle(500, function(){
            
        });

        let active =  $("#add-icon").attr("src");
        if (active == "./../global/icons/hide.png"){
            $("#add-icon").attr("src","./../global/icons/spread.png");
        }
        else{
        $("#add-icon").attr("src","./../global/icons/hide.png");
        }
    });

});

function addIngredientField(){
    $("#ingredientsArray").append(`
    <div class="row row-style" >
        <select class="form-control col-6 ingredientsList" id="recipe_ingredients" placeholder="Enter ingredient">

        </select>
        <input type="number" class="form-control  col-3" name = "ingredient_amount" id="recipe_ingredients" placeholder="Amount">
        <select class="form-control  col-2" id="recipe_ingredients" placeholder="Choose measurement">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select> 
        <p onclick="removeIngredientField()" id="add-ingredient"><b>-</b></p>                             
    </div>
    `)
    renderIngredients();
}

function removeIngredientField(){
    $("#ingredientsArray").children().last().remove();
}

//get all ingredients options for form


async function renderIngredients() {

    
    let fetchString = `/api/ingredients`;
    const response = await fetch(fetchString);
    const result = await response.json(); 
    
    result.ingredients.map( ingredient => {
        $(".ingredientsList").append(`
        <option>${ingredient.name}</option>
        `)
    })
}