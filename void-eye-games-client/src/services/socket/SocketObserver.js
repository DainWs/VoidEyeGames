/**
 * File: SocketObserver.js
 * Purpose: Use to notify subscribers object when a request
 * that go to a specific destination is completed.
 * DB Access: No
 * Used from:
 *  - GamesPage.js
 *  - SocketDataProvider.js
 *  - SocketObserver.js
 * Uses files:
 *  - The following imported files:
 */
import { ALL_DESTINATIONS } from "./SocketDestinations";

class SocketObserver {
    constructor() {
        this.listeners = new Map();
        for (const destination of ALL_DESTINATIONS) {
            this.listeners.set(destination, new Map());
        }
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