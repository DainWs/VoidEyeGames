import SocketRequest from "../services/socket/SocketRequest";

class RequestFactory {
    getGamesRequest(name = '', sort = 'name', categories = [], plataforms = []) {
        let request = new SocketRequest();
        request.setParams({name: name, sort: sort, categories: categories, plataforms: plataforms});
        return request;
    }
}
export default RequestFactory;