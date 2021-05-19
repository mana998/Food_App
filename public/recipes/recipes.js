
const lengths = [5, 10, 25, 50, 100];

let pageSort = {
    size: 10,
    page: 1,
    filter: "likes",
    direction: "desc"
}

function renderSortingPaging() {
    let result = '<div class="sorting-paging-buttons">';
    if (pageSort.page > 1) {
        result += renderPageButton("<--", -1);
    }
    result += renderPageButton(pageSort.page, 0);
    result += renderPageButton("-->", 1);
    result += "<br>";
    lengths.map((length) => {
        result += renderLengthButton(length);
    })
    result += renderSorting();
    result += '</div>';
    return result;
}


function renderPageButton(symbol, value) {
    return `<button class="page" onClick="pageSort.page += ${value}; renderRecipes();">${symbol}</button>`
}

function renderLengthButton(value) {
    return `<button class="size" onClick="pageSort.size = ${value}; renderRecipes();">${value}</button>`
}

function renderSorting() {
    return `<select class="sort-dropdown" onChange = "pageSort.filter = value.split('-')[0]; pageSort.direction = value.split('-')[1]; renderRecipes();">  
        <option value = 'recipe_id-desc' id = 'recipe_id-desc'>Newest to Oldest</option> 
        <option value = 'recipe_id-asc' id = 'recipe_id-asc'>Oldest to Newest</option> 
        <option value = 'likes-desc' id = 'likes-desc'>Most popular</option> 
        <option value = 'likes-asc' id = 'likes-asc'>Least popular</option> 
    </select>`
}

//render recipes automatically if on recipes page
if (window.location.pathname.match("recipes")) {
    renderMyRecipes('recipes-container');
}