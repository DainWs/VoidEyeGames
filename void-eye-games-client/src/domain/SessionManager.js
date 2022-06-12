/**
 * File: SessionManager.js
 * Purpose: Manages the sessions for the logged users.
 * DB Access: No
 * Used from:
 * - HeaderComponent.js
 * - GameDetailsPage.js
 * - HomePage.js
 * - LayoutPage.js
 * - LogInFormPage.js
 * - SignInFormPage.js
 * - CategoryFormPage.js
 * - PlataformFormPage.js
 * - SocketRequest.js
 * Uses files:
 *  - The following imported files:
 */
import { EventObserver } from "./EventObserver";
import { EVENT_SESSION_CHANGE } from "./EventsEnum";
import { ACCOUNT_TYPE_UNKNOWN } from "./models/AccountTypes";
import { StorageManager } from "./StorageManager";

const DEFAULT_SESSION = {token: null, user: null, expiration: null, accountType: ACCOUNT_TYPE_UNKNOWN.getId()};

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
        EventObserver.notify(EVENT_SESSION_CHANGE);
    }

    getSession() {
        return this.session;
    }

    has() {
        return (this.session.token !== null);
    }

    reload() {
        if (this.checkExpiration()) {
            this.setSession(DEFAULT_SESSION);
        }
    }

    checkExpiration() {
        return (!this.session.expiration || this.session.expiration < Date.now());
    }

    close() {
        this.setSession(DEFAULT_SESSION);
    }
}

const SessionManagerInstance = new SessionManager();
export {SessionManagerInstance as SessionManager};