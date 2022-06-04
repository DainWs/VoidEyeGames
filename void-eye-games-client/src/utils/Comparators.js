import PriceUnitEnum from "../domain/models/PriceUnits";

const nameComparatorCallback = function(o1, o2) {
    if (o1.games.name < o2.games.name) return -1;
    else if (o1.games.name > o2.games.name) return 1;
    return 0;
}

const priceComparatorCallback = function(o1, o2) {
    return o1.price - o2.price;
}

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

const plataformComaparatorCallback = function(o1, o2) {
    if (o1.plataforms.name < o2.plataforms.name) return -1;
    else if (o1.plataforms.name > o2.plataforms.name) return 1;
    return 0;
}

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