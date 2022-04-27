const SESSION_KEY = 'session';

class StorageManager {
    constructor() {}

    getSession() {
        let sessionJson = localStorage.getItem(SESSION_KEY);
        let sessionObject = JSON.parse(sessionJson);
        return sessionObject;
    }

    setSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
}

const StorageManagerInstance = new StorageManager();
export {StorageManagerInstance as StorageManager};