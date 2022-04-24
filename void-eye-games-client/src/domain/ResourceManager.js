import { API_URL } from "../services/ajax/AjaxController";

class ResourceManger {
    getImageUrl(image) {
        return `${API_URL}/${image}`;
    }
}

const ResourceMangerInstance = new ResourceManger();
export default ResourceMangerInstance;