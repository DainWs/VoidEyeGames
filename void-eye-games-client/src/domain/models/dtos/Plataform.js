import { ResourceManger } from "../../ResourceManager";
import Game from "./Game";
import PlataformGame from "./PlataformGame";

class Plataform {
    constructor(builder = {id: -1, name: '', url: '', games: [], plataformsGames: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.url = builder.url;
        this.games = builder.games;
        this.plataformsGames = builder.plataformsGames;
    }

    addGame(game) {
        this.games.push(game);
        let gamePlataform = new PlataformGame();
        gamePlataform.gamesId = game.id;
        gamePlataform.plataformId = this.id;
        this.plataformsGames.push(gamePlataform);
    }
    
    hasGame(id) {
        return this.getGame(id) !== undefined;
    }

    getGame(id) {
        return this.games.find(v => v.id === id);
    }

    hasPlataformGame(id) {
        return this.getPlataformGame(id) !== undefined;
    }

    getPlataformGame(id) {
        return this.plataformsGames.find(v => v.gamesId === id);
    }

    getLogo() {
        try {   
            return ResourceManger.getImageUrl(`plataforms/${this.name}.png`);
        } catch(ex) {
            return ResourceManger.getImageUrl('not-found.png');
        }
    }
}

export default Plataform;
