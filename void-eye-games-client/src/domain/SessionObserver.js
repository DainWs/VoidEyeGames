class SessionObserver {
    constructor() {
        this.listeners = new Map();
    }
    
    subscribe(className, callback) {
        this.listeners.set(className, callback);
    }

    unsubscribe(className) {
        this.listeners.delete(className);
    }

    notify() {
        this.listeners.forEach(callback => callback());
    }
}

const SessionObserverInstance = new SessionObserver();
export {SessionObserverInstance as SessionObserver}