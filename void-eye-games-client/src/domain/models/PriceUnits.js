class PriceUnit {
    constructor(currencyId, currencyDescription, currencySymbol, euroMultiplier) {
        this.id = currencyId;
        this.symbol = currencySymbol;
        this.description = currencyDescription;
        this.euroMultiplier = euroMultiplier;
    }

    getId() {
        return this.id;
    }

    getDescription() {
        return this.description;
    }

    getSymbol() {
        return this.symbol;
    }

    getMultiplier() {
        return this.euroMultiplier;
    }
    
    equals(priceUnit) {
        return (priceUnit instanceof PriceUnit) &&
            (priceUnit.id === this.id);
    }

    toString() {
        return this.id;
    }
}

const CONCURRENCY_TYPES = new Map();
CONCURRENCY_TYPES.set('EUR', new PriceUnit('EUR', 'Euro', '€', 1));
CONCURRENCY_TYPES.set('USD', new PriceUnit('USD', 'US Dollar', '$', 0.93));

export default class PriceUnitEnum {
    static getPriceUnitById(id) {
        return CONCURRENCY_TYPES.get(id);
    }

    static getOptions() {
        var list = [];
        CONCURRENCY_TYPES.forEach(v => list.push({value: v.getId(), label: v.getDescription()}));
        return list;    
    }

    static getEuroPriceOf(plataformGame) {
        let priceType = PriceUnitEnum.getPriceUnitById(plataformGame.priceUnit);
        if (priceType == CONCURRENCY_TYPES.get('USD')) {

        }
    }
}