import Configuration from "../storage/Configuration";

class SocketRequest {
    constructor() {
        this.url =  Configuration.getApiUrl();
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