(async function renderRecipe() {
    let fetchRecipe = `/api${window.location.pathname}`;
    const response = await fetch(fetchRecipe);
    const result = await response.json();
    console.log(result);
    if (result.message){
        $(".flex-container").append(`<h1 class="page-title" >${result.message}</h1>`);
    }
    
    $(".flex-container").append(`<h1 class="page-title" >${result.recipe.name}</h1>`);

    $(".flex-container").append(`
    <div id ="recipe-container" class="row">
        <div class="col-12 col-lg-8">
            <img class="recipe-img" src="./../global/images/${result.recipe.img}.jpg" alt="${result.recipe.name} image"}>
        </div>
        <div id ="ingredients" class=" col-12 col-lg-4 "></div>
    </div>`);


    $("#ingredients").append(`<h3 class="ingredients-headder">Ingredients List</h3><table class="table table-hover"><tbody></tbody></table>`)

    for(const i in result.ingredients){

        $(".table").append(`
        <tr>
            <th scope="col">${ result.ingredients[i].name}</th>
            <th scope="col">${ result.ingredients[i].amount}</th>
            <th scope="col">${ result.ingredients[i].measure}</th>
        </tr>`)
    }

    $(".flex-container").append(`
    <div id = "descripton">
        <h3 class="description-headder">Method</h3>
    </div>`);

    result.recipe.description.split(".").forEach(line => {
        $("#descripton").append(`<p>${line}.</p>`)})

})();