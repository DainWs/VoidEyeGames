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
    
    getMainImage() {
        return `assets/images/games/${this.name}.png`;
    }
}

export default Game;