import { ResourceManger } from "../../ResourceManager";
import PlataformGame from "./PlataformGame";

class Plataform {
    constructor(builder = {id: -1, name: '', url: '', games: [], plataforms_games: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.url = builder.url;
        this.games = builder.games;
        this.plataforms_games = builder.plataforms_games;
        if (builder.src) {
            this.src = builder.src;
        }
    }

    addGame(game) {
        if (!game) return;
        this.games.push(game);
    }
    
    removeGame(id) {
        let gameIndex = this.games.findIndex(v => v.id === id);
        this.games.splice(gameIndex, 1);

        let plataformGameIndex = this.plataforms_games.findIndex(v => v.gamesId === id);
        this.plataforms_games.splice(plataformGameIndex, 1);
    }

    addPlataformGame(gamePlataform) {
        if (!gamePlataform) return;
        gamePlataform.plataformsId = this.id;
        this.plataforms_games.push(gamePlataform);
    }
    
    hasGame(id) {
        return this.games[id] !== undefined;
    }

    getGame(id) {
        return this.games.find(v => v.id === id);
    }

    setPlataformGame(plataformGame) {
        if (this.hasPlataformGame(plataformGame.gamesId)) {
            let index = this.plataforms_games.findIndex(v => v.gamesId == plataformGame.gamesId);
            this.plataforms_games[index] = plataformGame;
        }
    }

    hasPlataformGame(id) {
        return this.getPlataformGame(id) !== undefined;
    }

    getPlataformGame(id) {
        return this.plataforms_games.find(v => v.gamesId === id);
    }

    getLogo() {
        try {   
            return ResourceManger.getImageUrl(`plataforms/plataform-${this.id}.png`);
        } catch(ex) {
            return ResourceManger.getImageUrl('not-found.png');
        }
    }
}

export default Plataform;
