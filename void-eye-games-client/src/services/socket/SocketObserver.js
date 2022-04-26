import { DESTINATION_CATEGORIES, DESTINATION_GAMES, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES } from "./SocketDestinations";

class SocketObserver {
    constructor() {
        this.listeners = new Map();
        this.listeners.set(DESTINATION_GAMES, new Map());
        this.listeners.set(DESTINATION_CATEGORIES, new Map());
        this.listeners.set(DESTINATION_PLATAFORMS, new Map());
        this.listeners.set(DESTINATION_PLATAFORM_GAMES, new Map());
    }

    subscribe(endPoint, className, callback) {
        this.listeners.get(endPoint)
            .set(className, callback);
    }

    unsubscribe(endPoint, className) {
        this.listeners.get(endPoint)
            .delete(className);
    }

    notify(endPoint) {
        Array.from(this.listeners.get(endPoint).values())
            .forEach(callback => callback());
    }
}

const SocketObserverInstance = new SocketObserver();
export {SocketObserverInstance as SocketObserver};