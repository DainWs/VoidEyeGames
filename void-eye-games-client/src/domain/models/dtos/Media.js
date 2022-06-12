/**
 * File: Media.js
 * Purpose: The model representation of a Media object.
 * DB Access: No
 * Used from:
 *  - MediasComponent.js
 *  - MediaListItemComponent.js
 *  - GameFormPage.js
 * Uses files:
 *  - The following imported files:
 */
import { ResourceManger } from "../../ResourceManager";
import MediaTypeEnum from "../MediaTypes";

class Media {
    constructor(builder = {id: -1, gamesId: -1, mediaType: null}) {
        this.id = builder.id;
        this.gamesId = builder.gamesId;
        this.mediaType = builder.mediaType;
        if (builder.src) {
            this.src = builder.src;
        }
    }
    
    getUrl() {
        if (this.src) return this.src;
        try {
            let type = MediaTypeEnum.getMediaTypeByType(this.mediaType);
            return ResourceManger.getImageUrl(`games/medias/${this.gamesId}-${this.id}.${type.getExtension()}`);
        } catch(ex) {
            return ResourceManger.getImageUrl('not-found.png');
        }
    }
}
export default Media;