/**
 * File: CategoryGame.js
 * Purpose: The model representation of a CategoryGame object.
 * DB Access: No
 * Used from:
 *  - Game.js
 *  - Category.js
 * Uses files:
 *  - None
 */
class CategoryGame {
    constructor(builder = {gamesId: -1, categoriesId: -1, games: null, categories: null}) {
        this.gamesId = builder.gamesId;
        this.categoriesId = builder.categoriesId;
        this.games = builder.games;
        this.categories = builder.categories;
    }
}

export default CategoryGame;