import { ResourceManger } from "../../ResourceManager";
import MediaTypeEnum from "../MediaTypes";

class Media {
    constructor(builder = {id: -1, gamesId: -1, mediaType: null}) {
        this.id = builder.id;
        this.gamesId = builder.gamesId;
        this.mediaType = builder.mediaType;
    }
    
    getUrl() {
        try {
            let type = MediaTypeEnum.getMediaTypeByType(this.mediaType);
            return ResourceManger.getImageUrl(`games/medias/${this.gamesId}-${this.id}.${type.getExtension()}`);
        } catch(ex) {
            return ResourceManger.getImageUrl('not-found.png');
        }
    }
}
export default Media;