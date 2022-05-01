class MediaType {
    constructor(type, extension) {
        this.type = type;
        this.extension = extension;
    }
    
    getType() {
        return this.type;
    }

    getExtension() {
        return this.extension;
    }

    equals(mediaType) {
        return (mediaType instanceof MediaType) &&
            (mediaType.type === this.type);
    }

    toString() {
        return this.type;
    }
}

const MEDIA_TYPES_VIDEOS = [];
MEDIA_TYPES_VIDEOS.push(new MediaType('video/avi', 'avi'));
MEDIA_TYPES_VIDEOS.push(new MediaType('video/mpeg', 'mpeg'));
MEDIA_TYPES_VIDEOS.push(new MediaType('video/mp4', 'mp4'));
MEDIA_TYPES_VIDEOS.push(new MediaType('video/ogg', 'ogg'));
MEDIA_TYPES_VIDEOS.push(new MediaType('video/webm', 'webm'));
MEDIA_TYPES_VIDEOS.push(new MediaType('video/x-flv', 'flv'));

const MEDIAS_TYPES_IMAGES = [];
MEDIAS_TYPES_IMAGES.push(new MediaType('image/gif', 'gif'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/jpeg', 'jpeg'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/jpg', 'jpg'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/pjpeg', 'pjpeg'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/png', 'png'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/bmp', 'bmp'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/tiff', 'tiff'));
MEDIAS_TYPES_IMAGES.push(new MediaType('image/x-xcf', 'xcf'));

export default class MediaTypeEnum {
    static getMediaTypeByType(type) {
        let searchType = type + '';
        let typeOfMedia = searchType.slice(0, searchType.indexOf('/'));
        console.log(type);
        console.log(typeOfMedia);
        if (typeOfMedia === 'image') 
            return getMediaTypeFromTypeOf(MEDIAS_TYPES_IMAGES, type);
        if (typeOfMedia === 'video') 
            return getMediaTypeFromTypeOf(MEDIA_TYPES_VIDEOS, type);
        return undefined;
    }

    static isImageMediaType(mediaType) {
        return isMediaTypeOf(MEDIAS_TYPES_IMAGES, mediaType);
    }

    static isVideoMediaType(mediaType) {
        return isMediaTypeOf(MEDIA_TYPES_VIDEOS, mediaType);
    }
}

function getMediaTypeFromTypeOf(list, mediaType) {
    return list.find(v => v.getType() === mediaType);
}

function isMediaTypeOf(list, mediaType) {
    return getMediaTypeFromTypeOf(list, mediaType) !== undefined;
}