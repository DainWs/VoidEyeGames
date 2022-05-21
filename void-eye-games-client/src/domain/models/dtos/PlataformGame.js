import Game from "./Game";
import Plataform from "./Plataform";

class PlataformGame {
    constructor(builder = {plataformsId: -1, gamesId: -1, price: 0.0, priceUnit: 'EURO', discount: 0.0, isEnabled: false, games: new Game(), plataforms: new Plataform()}) {
        this.plataformsId = builder.plataformsId;
        this.gamesId = builder.gamesId;
        this.price = builder.price;
        this.priceUnit = builder.priceUnit;
        this.discount = builder.discount;
        this.isEnabled = (builder.isEnabled == true || builder.isEnabled == "1");
        this.games = new Game(builder.games);
        this.plataforms = new Plataform(builder.plataforms);
    }
}

export default PlataformGame;