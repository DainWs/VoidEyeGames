import { SessionManager } from "../../domain/SessionManager";
import { API_URL } from "./SocketController";

class SocketRequest {
    constructor() {
        this.url =  API_URL;
        this.method = 'GET';
        this.params = {};
        this.headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'};
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    setContentType(contentType) {
        this.headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': contentType};
    }

    setParams(params) {
        this.params = params;
    }

    setMethod(method) {
        this.method = method;
    }

    setBody(body) {
        let credentials = JSON.stringify(SessionManager.getSession());
        this.data = `{"credentials": ${credentials}, "data": ${body} }`;
    }
}

export default SocketRequest;