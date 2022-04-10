import Configuration from "../storage/Configuration";

class AjaxRequest {
    constructor() {
        this.url =  Configuration.getApiUrl();
        this.method = 'GET';
        this.params = {};
        this.headers = {};
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
}

export default AjaxRequest;