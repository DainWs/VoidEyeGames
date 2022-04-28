import { StorageManager } from "./StorageManager";

const DEFAULT_SESSION = {token: null, user: null, exporation: null};

class SessionManager {
    constructor() {
        this.session = DEFAULT_SESSION;
        this.loadSession();
    }

    loadSession() {
        let newSession = StorageManager.getSession();
        if (newSession == null) {
            newSession = DEFAULT_SESSION;
        }
        this.session = newSession; 
    }

    saveSession() {
        StorageManager.setSession(this.session);
    }

    setSession(session) {
        if (session === null) return;
        this.session = session;
        this.saveSession();
    }

    getSession() {
        return this.session;
    }

    has() {
        return (this.session.token !== null);
    }

    reload() {
        if (this.session.expiration < Date.now()) {
            this.session = DEFAULT_SESSION;
        }
    }

    close() {
        this.setSession(DEFAULT_SESSION);
    }
}

const SessionManagerInstance = new SessionManager();
export {SessionManagerInstance as SessionManager};