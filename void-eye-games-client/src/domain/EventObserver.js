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
        console.log(args);
        if (this.listeners.has(event)) {
            console.log(args);
            this.listeners
                .get(event)
                .forEach(callback => callback(args));
        }
    }
}

const EventObserverInstance = new EventObserver();
export { EventObserverInstance as EventObserver }