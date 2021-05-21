function generateIngredient(ingredient){
    return(
    `<div class="flex-item">
        <label for="${ingredient.name}">${ingredient.name}</label>
        <input type="checkbox" onClick="this.value=${ingredient.id}" id="${ingredient.name}" name="${ingredient.name}" value="${ingredient.id}">
    </div`);
}

async function renderIngredients() {
    let fetchString = `/api/ingredients`;
    const response = await fetch(fetchString);
    const result = await response.json();
    console.log(result);
    $(".flex-container").empty()
    if (result.ingredients && result.ingredients.length) {
        result.ingredients.map(ingredient => {
            $(".ingredients").append(generateIngredient(ingredient));
        });
        $(".ingredients").append(`<br><button type="submit">SEARCH</button>`);
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
        $('#recipes').text(result.message);
    } else {
        console.log(result.recipes);
        $('#recipes').empty();
        result.recipes.map(recipe => $('#recipes').append(generateRecipe(recipe, 'recipes')))
    }
};

//render recipes automatically if on recipes page
renderIngredients();