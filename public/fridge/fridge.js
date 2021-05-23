function generateIngredient(ingredient){
    return(
    `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <label for="${ingredient.name}">${ingredient.name}</label>
        <input class="checkbox-style" type="checkbox" onClick="this.value=${ingredient.id}" id="${ingredient.name}" name="${ingredient.name}" value="${ingredient.id}">
    </div`);
}

async function renderIngredients() {
    let fetchString = `/api/ingredients`;
    const response = await fetch(fetchString);
    const result = await response.json();
    console.log(result);
    $(".ingredients").empty()
    if (result.ingredients && result.ingredients.length) {
        result.ingredients.map(ingredient => {
            $(".ingredients").append(generateIngredient(ingredient));
        });
        $(".ingredients").append(`<div class="col-12" ><button class=" btn search-button" type="submit">SEARCH</button></div>`);
    } else if (result.message) {
        $(".ingredients").append(`<h2>${result.message}</h2>`);
    } else {
        $(".ingredients").append(`<h2>Something went wrong</h2>`);
    }
};

$('#ingredients-form').on('submit', findRecipes);
async function findRecipes(e){
    e.preventDefault();
    let form = document.getElementById('ingredients-form');
    form = new FormData(form);
    let fetchString = '/api/recipes/ingredients?';
    form.forEach(ingredient => fetchString += `ingredients=${ingredient}&`);
    //console.log(fetchString);
    const response = await fetch(fetchString)
    const result = await response.json();
    if (result && result.message) {
        $('#fridge-recipes-container').text(result.message);
    } else {
        console.log(result.recipes);
        $('#fridge-recipes-container').empty();
        result.recipes.map(recipe => {
            $('#fridge-recipes-container').append(generateRecipe(recipe, 'fridge-recipes-container'))
            $(`#update-icon-fridge-recipes-container-${recipe.id}`).css('display','none');
        })
        
    }
};

//render recipes automatically if on recipes page
renderIngredients();

$(document).ready(function(){

    $("#ingredient-head").click(function(){
        $("#ingredients-form").toggle(500, function(){
            
        });

        let active =  $("#spread-icon").attr("src");
        if (active == "./../global/icons/hide.png"){
            $("#spread-icon").attr("src","./../global/icons/spread.png");
        }
        else{
        $("#spread-icon").attr("src","./../global/icons/hide.png");
        }
    });

});