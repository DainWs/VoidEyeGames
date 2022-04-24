class Plataform {
    constructor(builder = {id: -1, name: null, url: null, games: [], plataformsGames: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.url = builder.url;
        this.games = builder.games;
        this.plataformsGames = builder.plataformsGames;
    }
    
    hasGame(id) {
        return this.games[id] !== undefined;
    }

    getGame(id) {
        return this.games[id];
    }

    hasPlataformGame(id) {
        return this.plataformsGames[id] !== undefined;
    }

    getPlataformGame(id) {
        return this.plataformsGames[id];
    }

    getLogo() {
        return `assets/images/plataforms/${this.name}.png`;
    }
}

export default Plataform;
