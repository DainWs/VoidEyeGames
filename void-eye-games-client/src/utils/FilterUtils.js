import { IMAGE_ALLOWED_MEDIAS_TYPES, VIDEO_ALLOWED_MEDIAS_TYPES } from "../domain/models/MediaTypes";
import { Comparators } from "./Comparators";

class FilterUtils {
    getVideoMediasFrom(list) {
        return Array.from(list)
            .filter( v => VIDEO_ALLOWED_MEDIAS_TYPES.has(v.mediaType) );
    }

    getImageMediasFrom(list) {
        return Array.from(list)
            .filter( v => IMAGE_ALLOWED_MEDIAS_TYPES.has(v.mediaType) );
    }

    getBestPlataforms(list) {
        return Array.from(list)
            .sort(Comparators.get('priceAndDiscount'))
            .slice(0, 3);
    }

    getPlataformsOfList(plataformList, keyList) {
        var listOfKeys = new Set(keyList);
        return Array.from(plataformList)
            .filter( v => listOfKeys.has(v.id) );
    }
}

const FilterUtilsInstance = new FilterUtils();
export {FilterUtilsInstance as FilterUtils};