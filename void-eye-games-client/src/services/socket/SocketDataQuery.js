import { FilterUtils } from "../../utils/FilterUtils";
import { SocketDataProvideer } from "./SocketDataProvider";
import { DESTINATION_GAMES, DESTINATION_PLATAFORMS } from "./SocketDestinations";

class SocketDataQuery {
    getGameWithId(id) {
        let games = SocketDataProvideer.provide(DESTINATION_GAMES);
        return Array.from(games).find(v => v.id === id);
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