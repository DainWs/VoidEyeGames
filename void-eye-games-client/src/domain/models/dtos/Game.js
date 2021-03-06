/**
 * File: Game.js
 * Purpose: The model representation of a Game object.
 * DB Access: No
 * Used from:
 *  - DetailsHeaderComponent.js
 *  - Category.js
 *  - PlataformGame.js
 *  - GameDetailsPage.js
 *  - GameFormPage.js
 *  - SocketDataFilter.js
 * Uses files:
 *  - The following imported files:
 */
import { ResourceManger } from "../../ResourceManager";
import CategoryGame from "./CategoryGame";

class Game {
    constructor(builder = {id: -1, name: null, descripcion: null, plataforms: [], plataforms_games: [], categories: [], categories_games:[], comments: [], medias: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.descripcion = builder.descripcion;
        this.plataforms = builder.plataforms;
        this.plataforms_games = builder.plataforms_games;
        this.categories = builder.categories;
        this.categories_games = builder.categories_games;
        this.comments = builder.comments;
        this.medias = builder.medias;
    }

    getPlataform(key) {
        return Array.from(this.plataforms).find(v => v.id === key);
    }
    
    getPlataformGame(plataformKey) {
        return Array.from(this.plataforms).find(v => v.id === plataformKey);
    }

    hasCategory(categoryKey) {
        return Array.from(this.categories).find(v => v.id == categoryKey) !== null;
    }

    addCategory(category) {
        if (!category) return;
        this.categories.push(category);

        let newCategoryGame = new CategoryGame();
        newCategoryGame.categoriesId = category.id;
        newCategoryGame.gamesId = this.id;
        this.categories_games.push(newCategoryGame);
    }

    getCategory(id) {
        return this.games.find(v => v.id === id);
    }

    removeCategory(id) {
        let categoryIndex = this.categories.findIndex(v => v.id === id);
        this.categories.splice(categoryIndex, 1);

        let categoryGameIndex = this.categories_games.findIndex(v => v.categoriesId === id);
        this.categories_games.splice(categoryGameIndex, 1);
    }

    getImageUrl() {
        try {
            return ResourceManger.getImageUrl(`games/game-${this.id}.png`);
        } catch(ex) {
            return ResourceManger.getImageUrl('not-found.png');
        }
    }
}

export default Game;