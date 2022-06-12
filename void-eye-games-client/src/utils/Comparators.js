/**
 * File: Comparators.js
 * Purpose: A file used to compare models with the purpose of filter or sorts its.
 * DB Access: No
 * Used from:
 *  - Pages
 *  - SocketDataFilter.js
 * Uses files:
 *  - The following imported files:
 */
import PriceUnitEnum from "../domain/models/PriceUnits";

/**
 * Compares two plataformsGames names
 * @param {*} o1 plataformsGames 1
 * @param {*} o2 plataformsGames 2
 * @returns -1 if o1 is lower than o2, 1 if o1 is bigger than o2, if both are equals return 0.
 */
const nameComparatorCallback = function(o1, o2) {
    if (o1.games.name < o2.games.name) return -1;
    else if (o1.games.name > o2.games.name) return 1;
    return 0;
}

/**
 * Compares two plataformsGames prices
 * @param {*} o1 plataformsGames 1
 * @param {*} o2 plataformsGames 2
 * @returns -1 if o1 is lower than o2, 1 if o1 is bigger than o2, if both are equals return 0.
 */
const priceComparatorCallback = function(o1, o2) {
    return o1.price - o2.price;
}

/**
 * Compares two plataformsGames prices applying its discount
 * @param {*} o1 plataformsGames 1
 * @param {*} o2 plataformsGames 2
 * @returns -1 if o1 is lower than o2, 1 if o1 is bigger than o2, if both are equals return 0.
 */
const priceWithDiscountComparatorCallback = function(o1, o2) {
    function calcPrice(o) {
        let oPrice = o.price;
        console.log(oPrice);
        let oPriceUnit = PriceUnitEnum.getPriceUnitById(o.priceUnit);
        if (oPriceUnit != null) {
            oPrice = oPrice * oPriceUnit.getMultiplier();
        }
        console.log(oPrice);
        let discount = oPrice * o.discount;
        return oPrice - discount;
    }
    return calcPrice(o1) - calcPrice(o2);
}

/**
 * Compares two plataforms names
 * @param {*} o1 plataforms 1
 * @param {*} o2 plataforms 2
 * @returns -1 if o1 is lower than o2, 1 if o1 is bigger than o2, if both are equals return 0.
 */
const plataformComaparatorCallback = function(o1, o2) {
    if (o1.plataforms.name < o2.plataforms.name) return -1;
    else if (o1.plataforms.name > o2.plataforms.name) return 1;
    return 0;
}

/**
 * Class used to provide comparator callbacks.
 */
class Comparators {
    constructor() {
        this.callbacks = new Map();
        this.callbacks.set('name', nameComparatorCallback);
        this.callbacks.set('price', priceComparatorCallback);
        this.callbacks.set('plataform', plataformComaparatorCallback);
        this.callbacks.set('priceAndDiscount', priceWithDiscountComparatorCallback);
    }

    get(key) {
        return this.callbacks.get(key);
    }
}

const ComparatorsInstance = new Comparators();
export { ComparatorsInstance as Comparators };