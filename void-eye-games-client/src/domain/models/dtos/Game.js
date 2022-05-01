import { ResourceManger } from "../../ResourceManager";

class Game {
    constructor(builder = {id: -1, name: null, description: null, plataforms: [], plataformGames: [], categories: [], comments: [], medias: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.plataforms = builder.plataforms;
        this.plataformGames = builder.plataformGames;
        this.categories = builder.categories;
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

    getImageUrl() {
        try {
            return ResourceManger.getImageUrl(`games/${this.name}.png`);
        } catch(ex) {
            return ResourceManger.getImageUrl('not-found.png');
        }
    }
}

export default Game;