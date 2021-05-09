(async function renderHomepageRecipes() {

    let fetchRecipe = `/api/recipes?size=3`;
    const response = await fetch(fetchRecipe);
    const result = await response.json();
  
    result.recipes.map((recipe,index) => {

        let currentForBig = 0;
        //big size carousel
        if (index % 3 == 0){
            $(".carousel-inner").append(`
    
            <div id = "item${index}"  class="carousel-item  col-12 big-item-container">
                <div id = "block${index}" class="row item-container-row">
                </div>
                
            </div>  
            `);
            currentForBig = index;
        }

        $(`#block${currentForBig}`).append(`
        <div class="col-3 recipe-carusel-item">
                <div class="img-size">
                    <a href="./recipes/${recipe.name}" ><img class="home-image active image-style" src="./../global/images/${recipe.img}.jpg" alt=""></a>
                </div>
                <div class="image-name">
                    <p>${recipe.name}</p>
                </div>
        </div>
        `)
        $("#item0").addClass("active");

        //medium size carousel
        
      
            $(".carousel-inner-medium").append(`
    
            <div id = "medium-item${index}" class="carousel-item col-11 medium-carousel-style">
               
                    <div class=" recipe-carusel-item">
                        <div class="img-size">
                            <a href="./recipes/${recipe.name}" ><img class="home-image active image-style" src="./../global/images/${recipe.img}.jpg" alt=""></a>
                        </div>
                        <div class="image-name">
                            <p>${recipe.name}</p>
                        </div>
                    </div>
               
                
            </div>  
            `);
        
      
        $("#medium-item0").addClass("active");
        
    })
    

})();