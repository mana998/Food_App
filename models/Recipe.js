class Recipe {
    constructor (id, name, description, user_id, img) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.user_id = user_id;
        this.img = img;
    }
}

module.exports = {
    Recipe: Recipe
}