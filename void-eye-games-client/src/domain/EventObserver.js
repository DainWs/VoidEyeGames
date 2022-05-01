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

    notify(event) {
        if (this.listeners.has(event)) {
            this.listeners
                .get(event)
                .forEach(callback => callback());
        }
    }
}

const EventObserverInstance = new EventObserver();
export { EventObserverInstance as EventObserver }