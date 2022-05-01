class PriceUnit {
    constructor(currencyId, currencyDescription, currencySymbol) {
        this.id = currencyId;
        this.symbol = currencySymbol;
        this.description = currencyDescription;
    }

    getId() {
        return this.id;
    }

    getDescription() {
        return description;
    }

    getSymbol() {
        return this.symbol;
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
CONCURRENCY_TYPES.set('EUR', new PriceUnit('EUR', 'Euro', '€'));
CONCURRENCY_TYPES.set('USD', new PriceUnit('USD', 'US Dollar', '$'));

export default class PriceUnitEnum {
    static getPriceUnitById(id) {
        return CONCURRENCY_TYPES.get(id);
    }
}