/**
 * File: SocketDataProvideer.js
 * Purpose: Provides data from requests dones.
 * DB Access: No
 * Used from:
 *  - GamesPage.js
 *  - SocketController.js
 *  - SocketDataQuery.js
 * Uses files:
 *  - The following imported files:
 */
import { SocketObserver } from "./SocketObserver";

class SocketDataProvideer {
    constructor() {
        this.data = new Map();
    }

    supply(endPoint, data) {
        this.data.set(endPoint, data);
        SocketObserver.notify(endPoint);
    }

    provide(endPoint) {
        return this.data.get(endPoint);
    }
}

const SocketDataProvideerInstance = new SocketDataProvideer();
export {SocketDataProvideerInstance as SocketDataProvideer};
