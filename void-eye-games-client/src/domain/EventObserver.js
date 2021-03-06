/**
 * File: EventObserver.js
 * Purpose: This file create a events observer that notify when a 
 * custom event of EventEnum is throwed, you throw it calling notify(Event).
 * DB Access: No
 * Used from:
 *  - HeaderComponent.js
 *  - ItemContextMenuComponent.js
 *  - WhileLoadingComponent.js
 *  - SessionManagerjs
 *  - CacheConfiguration.js
 *  - GamesPage.js
 *  - HomePage.js
 * Uses files:
 *  - The following imported files:
 */
class EventObserver {
    constructor() {
        this.listeners = new Map();
    }

    subscribe(event, className, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Map());
        }
        this.listeners
            .get(event)
            .set(className, callback);
    }

    unsubscribe(event, className) {
        if (this.listeners.has(event)) {
            this.listeners
                .get(event)
                .delete(className);
        }
    }

    notify(event, args = null) {
        if (this.listeners.has(event)) {
            this.listeners
                .get(event)
                .forEach(callback => callback(args));
        }
    }
}

const EventObserverInstance = new EventObserver();
export { EventObserverInstance as EventObserver }