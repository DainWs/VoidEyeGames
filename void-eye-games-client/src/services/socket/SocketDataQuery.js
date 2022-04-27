import { FilterUtils } from "../../utils/FilterUtils";
import { SocketDataProvideer } from "./SocketDataProvider";
import { DESTINATION_GAMES, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES } from "./SocketDestinations";

class SocketDataQuery {
    getGameWithId(id) {
        var searchedGameId = id;
        let games = SocketDataProvideer.provide(DESTINATION_GAMES);
        return Array.from(games).find(v => {
            console.log(searchedGameId);
            return v.id === searchedGameId
        });
    }

    getPlataformsGamesWithGameId(gameId) {
        let plataformsGames = SocketDataProvideer.provide(DESTINATION_PLATAFORM_GAMES);
        console.log(plataformsGames);
        if (plataformsGames === null) return [];
        return Array.from(plataformsGames)
            .filter(v => v.gamesId = gameId);
    }

    getBestPlataformsIn(list) {
        let bestPlataformKeys = FilterUtils.getBestPlataforms(list);
        return this.getPlataformsIn(bestPlataformKeys);
    }
    
    getPlataformsIn(keyList) {
        let plataforms = SocketDataProvideer.provide(DESTINATION_PLATAFORMS);
        return FilterUtils.getPlataformsOfList(plataforms, keyList);
    }
}

const SocketDataQueryInstance = new SocketDataQuery();
export { SocketDataQueryInstance as SocketDataQuery };