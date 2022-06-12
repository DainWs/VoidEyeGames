/**
 * File: EventDataProvider.js
 * Purpose: provides event data.
 * DB Access: No
 * Used from:
 *  - HeaderComponent.js
 *  - GamesPage.js
 * Uses files:
 *  - The following imported files:
 */
class EventDataProvider {
    constructor() {
        this.data = new Map();
    }

    supply(endPoint, data) {
        this.data.set(endPoint, data);
    }

    provide(endPoint) {
        return this.data.get(endPoint);
    }
}

const EventDataProviderInstance = new EventDataProvider();
export { EventDataProviderInstance as EventDataProvider }