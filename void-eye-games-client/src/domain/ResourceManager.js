/**
 * File: ResourceManger.js
 * Purpose: creates the images/media URL.
 * DB Access: No
 * Used from:
 *  - Game.js (Model)
 *  - Media.js (Model)
 *  - Plataform.js (Model)
 * Uses files:
 *  - The following imported files:
 */
import { API_URL } from "../services/socket/SocketController";

class ResourceManger {
    getImageUrl(image) {
        return `${API_URL}/assets/images/${image}`.replace(' ', '_');
    }
}

const ResourceMangerInstance = new ResourceManger();
export { ResourceMangerInstance as ResourceManger};