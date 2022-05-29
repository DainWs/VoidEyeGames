import { EventObserver } from "../EventObserver";

export const USERS_COUNT = "table.users.count";
export const CATEGORIES_COUNT = "table.categories.count";
export const PLATAFORMS_COUNT = "table.plataforms.count";
export const GAMES_COUNT = "table.games.count";
export const GAMES_LIMIT_PER_PAGE = "table.games.limit-per-page";

export const ON_CACHE_LOAD = "cache";

var cache = new Map();

export class CacheConfiguration {
    static set(healthDetails) {
        for (const key in healthDetails) {
            cache[key] = healthDetails[key];
        }
        EventObserver.notify(ON_CACHE_LOAD);
    }

    static get(key) {
        return cache[key];
    }
}