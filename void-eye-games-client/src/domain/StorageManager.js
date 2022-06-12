/**
 * File: StorageManager.js
 * Purpose: Manage the localstore data.
 * DB Access: No
 * Used from:
 *  - SessionManager.js
 * Uses files:
 *  - The following imported files:
 */
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