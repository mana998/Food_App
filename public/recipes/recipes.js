function generateRecipe(recipe){
    return(
    `<div class="flex-item">
    <a class="recipe-link" href="/recipe/${recipe.name.toLowerCase()}">
        <h2 class="recipe-name">${recipe.name}</h2>
        <img class="recipe-img" src="/recipes/img/${recipe.name.toLowerCase()}.png">
    </a>
</div>`);
}

async function renderRecipes(size, page, filter) {
    size = size || 10;
    page = page || 1;
    filter = filter || "likes";
    let fetchString = `/api/recipes?size=${size}&page=${page}&filter=${filter}`;
    const response = await fetch(fetchString);
    const result = await response.json();
    if (result.recipes.length) {
        result.recipes.map(recipe => {
            $(".flex-container").append(generateRecipe(recipe));
        });
    } else {
        $(append).append("<h2>No recipes found</h2>");
    }
};

//render recipes automatically if on recipes page
if (window.location.pathname.match("recipes")) {
    renderRecipes();
}