/**
 * File: SocketRequest.js
 * Purpose: The model representation of a HTTP Request object.
 * DB Access: No
 * Used from:
 *  - SocketController.js
 * Uses files:
 *  - The following imported files:
 */
import qs from 'qs';
import { SessionManager } from "../../domain/SessionManager";
import { API_URL } from "./SocketController";

class SocketRequest {
    constructor() {
        this.url =  API_URL;
        this.method = 'GET';
        this.params = {};
        this.headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Content-Type': 'application/json'};
    }

    paramsSerializer(params) {
        return qs.stringify(params);
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    setContentType(contentType) {
        this.headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Content-Type': contentType};
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