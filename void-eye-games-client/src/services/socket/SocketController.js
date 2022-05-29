import axios from 'axios';
import { SocketDataProvideer } from './SocketDataProvider';
import SocketRequest from './SocketRequest';

let host = process.env.REACT_APP_PUBLIC_API;
export const API_URL = host.replace('{host}', window.location.host);

class SocketController {
    send(destination, onError = onHandleError) {
        this.sendCustom(new SocketRequest(), destination, onError);
    }

    sendCustom(request, destination, onError = onHandleError) {
        axios.request(this.getUrlFor(destination), request, { rejectUnauthorized: false })
            .then(response => {
                SocketDataProvideer.supply(destination, response.data);
            })
            .catch(onError);
    }

    sendCustomWithCallback(request, destination, callback, onError = onHandleError) {
        axios.request(this.getUrlFor(destination), request, { rejectUnauthorized: false })
            .then(response => callback(response))
            .catch(onError);
    }

    getUrlFor(destination) {
        return API_URL + destination;
    }
}

function onHandleError(error) {
    console.error(error);
}

const SocketControllerInstance = new SocketController();
export {SocketControllerInstance as SocketController};