class Category {
    constructor(builder = {id: -1, name: null, games: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.games = builder.games;
    }
    
    hasGame(id) {
        return this.games[id] !== undefined;
    }

    getGame(id) {
        return this.games[id];
    }
}

export default Category;