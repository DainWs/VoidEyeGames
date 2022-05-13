import Game from "../../domain/models/dtos/Game";
import MediaTypeEnum from "../../domain/models/MediaTypes";
import { Comparators } from "../../utils/Comparators";

class SocketDataFilter {
    getVideoMediasFrom(list) {
        if (!list) return [];
        return Array.from(list)
            .filter( v => MediaTypeEnum.isVideoMediaType(v.mediaType) );
    }

    getImageMediasFrom(list) {
        if (!list) return [];
        return Array.from(list)
            .filter( v => MediaTypeEnum.isImageMediaType(v.mediaType) );
    }

    getBestPlataforms(list, requireDiscount = false) {
        if (!list) return [];
        let result = Array.from(list)
            .sort(Comparators.get('priceAndDiscount'));
        if (requireDiscount) {
            result = result.filter(v => v.discount > 0);
        }
        return result.slice(0, 3);
    }

    getPlataformsOfList(plataformList, keyList) {
        if (!plataformList) return [];
        var listOfKeys = new Set(keyList);
        return Array.from(plataformList)
            .filter( v => listOfKeys.has(v.id) );
    }

    getGamesWithoutCategory(gamesList, categoryId) {
        if (!gamesList) return [];
        return Array.from(gamesList)
            .filter( v => !(new Game(v)).hasCategory(categoryId));
    }

    getGamesNotIn(games, excludedGames) {
        if (!games || !excludedGames) return [];
        var excluded = Array.from(excludedGames);
        return Array.from(games)
            .filter( game => {
                var searchGame = game;
                return (excluded.find( v => v.id == searchGame.id )) !== null;
            });
    }
}

const SocketDataFilterInstance = new SocketDataFilter();
export {SocketDataFilterInstance as SocketDataFilter};