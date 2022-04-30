import Game from "../../domain/models/dtos/Game";
import { IMAGE_ALLOWED_MEDIAS_TYPES, VIDEO_ALLOWED_MEDIAS_TYPES } from "../../domain/models/MediaTypes";
import { Comparators } from "../../utils/Comparators";

class SocketDataFilter {
    getVideoMediasFrom(list) {
        if (!list) return [];
        return Array.from(list)
            .filter( v => VIDEO_ALLOWED_MEDIAS_TYPES.has(v.mediaType) );
    }

    getImageMediasFrom(list) {
        if (!list) return [];
        return Array.from(list)
            .filter( v => IMAGE_ALLOWED_MEDIAS_TYPES.has(v.mediaType) );
    }

    getBestPlataforms(list) {
        if (!list) return [];
        return Array.from(list)
            .sort(Comparators.get('priceAndDiscount'))
            .slice(0, 3);
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
            .filter( v => {
                console.log(v);
                return !(new Game(v)).hasCategory(categoryId);
            });
    }

    getGamesNotIn(games, excludedGames) {
        if (!games || !excludedGames) return [];
        var excluded = Array.from(excludedGames);
        return Array.from(games)
            .filter( game => {
                var searchGame = game;
                return excluded.find( v => {
                    console.log(v);
                    return v.id === searchGame.id;
                 } ) !== null;
            });
    }
}

const SocketDataFilterInstance = new SocketDataFilter();
export {SocketDataFilterInstance as SocketDataFilter};