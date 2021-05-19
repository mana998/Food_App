function generateIngredient(ingredient){
    return(
    `<div class="flex-item">
        <label for="${ingredient.name}">${ingredient.name}</label>
        <input type="checkbox" id="${ingredient.name}" name="${ingredient.name}" value="${ingredient.id}">
    </div`);
}

async function renderIngredients() {
    let fetchString = `/api2/ingredients`;
    const response = await fetch(fetchString);
    const result = await response.json();
    console.log(result);
    $(".flex-container").empty()
    if (result.ingredients && result.ingredients.length) {
        result.ingredients.map(ingredient => {
            $(".ingredients").append(generateIngredient(ingredient));
        });
        $(".ingredients").append(`<br><button onClick="findRecipes();">SEARCH</button>`);
    } else if (result.message) {
        $(".ingredients").append(`<h2>${result.message}</h2>`);
    } else {
        $(".ingredients").append(`<h2>Something went wrong</h2>`);
    }
};

function findRecipes() {
    console.log("looking for it");
}

//render recipes automatically if on recipes page
renderIngredients();