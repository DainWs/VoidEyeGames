import { API_URL } from "../services/socket/SocketController";

class ResourceManger {
    getImageUrl(image) {
        return `${API_URL}/${image}`;
    }
}

const ResourceMangerInstance = new ResourceManger();
export { ResourceMangerInstance as ResourceManger};