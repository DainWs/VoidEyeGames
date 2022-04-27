class Game {
    constructor(builder = {id: -1, name: null, description: null, plataforms: [], plataformGames: [], comments: [], medias: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.plataforms = builder.plataforms;
        this.plataformGames = builder.plataformGames;
        this.comments = builder.comments;
        this.medias = builder.medias;
    }

    getPlataform(key) {
        return Array.from(this.plataforms).find(v => v.id === key);
    }
    
    getPlataformGame(plataformKey) {
        return Array.from(this.plataforms).find(v => v.id === plataformKey);
    }

    getMainImage() {
        return `assets/images/games/${this.name}.png`;
    }
}

export default Game;