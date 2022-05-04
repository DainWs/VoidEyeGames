import { SocketDataFilter } from "./SocketDataFilter";
import { SocketDataProvideer } from "./SocketDataProvider";
import { DESTINATION_CATEGORIES, DESTINATION_GAMES, DESTINATION_LIST_OF_GAMES, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES } from "./SocketDestinations";

class SocketDataQuery {
    getGameWithId(id) {
        var searchedId = id;
        let games = SocketDataProvideer.provide(DESTINATION_GAMES);
        return Array.from(games).find(v => v.id === searchedId);
    }

    getGamesNotIn(gamesList) {
        let games = SocketDataProvideer.provide(DESTINATION_LIST_OF_GAMES);
        return SocketDataFilter.getGamesNotIn(games, gamesList);
    }

    getCategoryWithId(id) {
        var searchedId = id;
        let categories = SocketDataProvideer.provide(DESTINATION_CATEGORIES);
        return Array.from(categories).find(v => v.id === searchedId)
    }

    getPlataformWithId(id) {
        var searchedId = id;
        let plataforms = SocketDataProvideer.provide(DESTINATION_PLATAFORMS);
        return Array.from(plataforms).find(v => v.id === searchedId)
    }

    getPlataformsGamesWithGameId(gameId) {
        let plataformsGames = SocketDataProvideer.provide(DESTINATION_PLATAFORM_GAMES);
        if (plataformsGames === null) return [];
        return Array.from(plataformsGames)
            .filter(v => v.gamesId = gameId);
    }

    getBestPlataformsIn(list) {
        let bestPlataformKeys = SocketDataFilter.getBestPlataforms(list);
        return this.getPlataformsIn(bestPlataformKeys);
    }
    
    getPlataformsIn(keyList) {
        let plataforms = SocketDataProvideer.provide(DESTINATION_PLATAFORMS);
        return SocketDataFilter.getPlataformsOfList(plataforms, keyList);
    }
}

const SocketDataQueryInstance = new SocketDataQuery();
export { SocketDataQueryInstance as SocketDataQuery };