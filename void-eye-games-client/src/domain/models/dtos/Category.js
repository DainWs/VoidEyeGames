import CategoryGame from "./CategoryGame";
import Game from "./Game";

class Category {
    constructor(builder = {id: -1, name: '', categories_games: [], games: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.games = [];
        for (const game of builder.games) {
            this.games.push(new Game(game));
        }

        this.categories_games = [];
        for (const categoriesGame of builder.categories_games) {
            this.categories_games.push(new CategoryGame(categoriesGame));
        }
    }
    
    hasGame(id) {
        return this.games[id] !== undefined;
    }

    addGame(game) {
        if (!game) return;
        this.games.push(game);

        let newCategoryGame = new CategoryGame();
        newCategoryGame.gamesId = game.id;
        newCategoryGame.categoriesId = this.id;
        this.categories_games.push(newCategoryGame);
    }

    getGame(id) {
        return this.games.find(v => v.id === id);
    }

    removeGame(id) {
        let gameIndex = this.games.findIndex(v => v.id === id);
        this.games.splice(gameIndex, 1);

        let categoryGameIndex = this.categories_games.findIndex(v => v.gamesId === id);
        this.categories_games.splice(categoryGameIndex, 1);
    }
}

export default Category;