import { API_URL } from "./SocketController";

class SocketRequest {
    constructor() {
        this.url =  API_URL;
        this.method = 'GET';
        this.params = {};
        this.headers = {'Access-Control-Allow-Origin': '*'};
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    setParams(params) {
        this.params = params;
    }

    setMethod(method) {
        this.method = method;
    }

    setBody(body) {
        this.body = body;
    }
}

export default SocketRequest;