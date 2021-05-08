async function renderHomepageRecipes() {

    let fetchRecipe = `/api/homeRecipes`;
    const response = await fetch(fetchRecipe);
    const result = await response.json();

    result.recipes.map((recipe,index) => {
        
        let current = 0;
        if (index % 3 == 0){
            $(".carousel-inner").append(`
    
            <div  class="carousel-item  col-12 item-container">
                <div id = "block${index}" class="row item-container-row">
                </div>
                
            </div>  
            `);
            current = index;
        }

        $(`#block${current}`).append(`
        <div class="col-3 recipe-carusel-item">
                <div class="img-size">
                    <a href="./recipe/${recipe.name}" ><img class="home-image active image-style" src="${recipe.recipe_img}" alt=""></a>
                </div>
                <div class="image-name">
                    <p>${recipe.name}</p>
                </div>
        </div>
        `)

        if (index == 0){
            $(".carousel-item").addClass("active");
        }
    })
    
    


}