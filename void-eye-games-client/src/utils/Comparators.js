const nameComparatorCallback = function(o1, o2) {
    if (o1.games.name < o2.games.name) return -1;
    else if (o1.games.name > o2.games.name) return 1;
    return 0;
}

const priceComparatorCallback = function(o1, o2) {
    return o1.price - o2.price;
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
    }

    get(key) {
        return this.callbacks.get(key);
    }
}

const ComparatorsInstance = new Comparators();
export { ComparatorsInstance as Comparators };