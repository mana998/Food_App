//function to create recipe container
function generateRecipe(recipe, container){
    return(  
    `<div class="col-12 account-recipe-item">
        <div class="img-size">
            <a href="/recipes/${recipe.name}" >
                <img class="home-image" src="./../global/images/${recipe.img}.jpg" alt="">
            </a>
        </div>
        <div class="image-name">
            <p>${recipe.name}</p>
            <img onclick="addOrDeleteFromFavorite(${recipe.id}, 'heart-icon-${container}-${recipe.id}')" id="heart-icon-${container}-${recipe.id}" class="icon" src="./../global/icons/heart.png" alt="heart icon"></img>
            <img id="update-icon" class="icon" src="./../global/icons/update.png" alt="update icon"></img>
        </div>
        <p id="recipe_id" hidden>${recipe.id}</p>
    </div>`
    )
    
};

//get logged in user rcipes and add them to the page
async function renderMyRecipes(container,filter = "") {
    const user_id = 6;
    let fetchString = `/api/recipes/${user_id}?filter=${filter}`;
    const response = await fetch(fetchString);
    const result = await response.json();
  
    if (result.recipes && result.recipes.length) {
        result.recipes.map(recipe => {
            $(`#${container}`).append(generateRecipe(recipe,container));
            checkFavorite(recipe.id, container);
        });
    } else if (result.message) {
        $(`#${container}`).append(`<h2>${result.message}</h2>`);
    } else {
        $(`#${container}`).append(`<h2>Something went wrong</h2>`);
    }

};

//render recipes automatically if on recipes page
if (window.location.pathname.match("myAccount")) {
    const user_id = getSession();

    renderMyRecipes("your-recipes"); 
    renderMyRecipes("favorite-recipes","favorite");
}

//allow to show/hide favorite recipes
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

//add one field for ingredient
function addIngredientField(){
    let numberOfNextContainer;

    if ($("#ingredientsArray").children().length != 0){
        numberOfNextContainer =  Number($("#ingredientsArray").children().last().attr("id").split("-")[1]) + 1;
    }else{
        numberOfNextContainer = 0;
    }
    
    $("#ingredientsArray").append(`
    <div id="box-${numberOfNextContainer}" class="row row-style" >
        <select class="form-control col-6 ingredientsList" id="select-${numberOfNextContainer}" required placeholder="Enter ingredient">

        </select>
        <input type="hidden" class="form-control  col-2" name="user_id" value="${myId}">
        <input type="hidden" class="form-control  col-2" id="selected-ingredient-${numberOfNextContainer}" name="ingredients[ingredient${numberOfNextContainer}][id]">
        <input type="number" class="form-control  col-3" name = "ingredients[ingredient${numberOfNextContainer}][amount]" id="recipe_ingredients" required placeholder="Amount">
        <input type="text" class="form-control  col-2" id="input-${numberOfNextContainer}" disabled placeholder="">

        <p onclick="removeIngredientField('box-${numberOfNextContainer}')" id="add-ingredient"><b>-</b></p>                             
    </div>
    `)

    renderIngredients(`input-${numberOfNextContainer}`,`selected-ingredient-${numberOfNextContainer}`);
}

//remove given ingredient container 
function removeIngredientField(boxId){
    $(`#${boxId}`).remove();
}

//get all ingredients options for form
async function renderIngredients(inputId, selectId) {

    
    let fetchString = `/api/ingredients`;
    const response = await fetch(fetchString);
    const result = await response.json(); 

    
    result.ingredients.map( (ingredient,index) => {
        $(".ingredientsList").append(`
        <option onclick="setMeasure('${ingredient.measure}', '${inputId}', '${selectId}', '${ingredient.id}')">${ingredient.name}</option>
        `)

        if (index==0){
            setMeasure(`${ingredient.measure}`, `${inputId}`,`${selectId}`, `${ingredient.id}`);
        }
    })
};

//set measure according to waht we have in db and set ingredient id which we send to db to ad to table with recipes and ingredients
function setMeasure(measure, inputId, selectId, ingredient_id){

    $(`#${inputId}`).attr("value", measure);
    $(`#${selectId}`).attr("value", ingredient_id);
    
}

//send form information to the server and dispaly return message

$('#recipeForm').on('submit', submitForm);

async function submitForm(e){
    e.preventDefault();
    const formData = new FormData(document.getElementById('recipeForm'));

    const response = await fetch("/api/recipeAdd", {
        method: 'post',
        body: formData
    });
    const result = await response.json();

    if (result.message == "Image uploaded."){
        $('#your-recipes').empty();
        renderMyRecipes("your-recipes");
        alert("Recipe added.");
        document.getElementById('recipeForm').reset();
        $('#img-response').text("");
    }else{
        $('#img-response').text(result.message);
    };
     
};

//add/delete recipe to favorite for the user who is logged in

async function addOrDeleteFromFavorite(recipe_id, heart_id){
    if ($(`#${heart_id}`).attr('src') == './../global/icons/heart.png'){
        const response = await fetch(`/api/addToFavorite`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({recipe_id: recipe_id, user_id: 6})
            });
        const result = await response.json();
        if (result.message == "Like added."){

            $('#favorite-recipes').empty();
            renderMyRecipes("favorite-recipes","favorite");
            $('#your-recipes').empty();
            renderMyRecipes("your-recipes");
        }else{
            $(`#${recipe_id}`).removeAttr('hidden');
            $(`#${recipe_id}`).text("Sorry, try to add the recipe to your favorites later.");
        }
        

    }else{
        const response = await fetch(`/api/deleteFromFavorite`, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipe_id: recipe_id, user_id: 6})
        });
        const result = await response.json();
        if (result.message == "Like deleted."){

            $('#favorite-recipes').empty();
            renderMyRecipes("favorite-recipes","favorite");
            $('#your-recipes').empty();
            renderMyRecipes("your-recipes");
        }else{
            $(`#${recipe_id}`).removeAttr('hidden');
            $(`#${recipe_id}`).text("Sorry, try to delete the recipe from your favorites later.");
        }
    }  
};

//check if recipe is liked by the user
//fetch all favorite and check if recipe id is there if yes give heart filled 
async function checkFavorite(recipe_id, container) {
    const user_id = 6;
    let fetchString = `/api/recipes/${user_id}?filter=favorite`;
    const response = await fetch(fetchString);
    const result = await response.json();
    if (result && result.recipes){
        const idRecipes = result.recipes.map(recipe => {
            return recipe.id;
        })
        console.log(idRecipes);
        if (idRecipes.includes(recipe_id)) {
                $(`#heart-icon-${container}-${recipe_id}`).attr('src','./../global/icons/LikedHeart.png');
        }
    }
    
};