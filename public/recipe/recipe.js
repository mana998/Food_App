async function renderRecipe(recipeName) {
    let fetchRecipe = `/api/recipe/${recipeName}`;
    const response = await fetch(fetchRecipe);
    const result = await response.json();

   
    
    $(".flex-container").append(`
        <h1>${result.recipe.name}</h1>
        <div class="col-12 image-container">
            <img class="recipe-img" src="./../recipes/img/chocolate cake.png" alt="${result.recipe.name} image"}>
        </div>
        <div class="col-12">
            ${result.recipe.description}
        </div>
    `);

};