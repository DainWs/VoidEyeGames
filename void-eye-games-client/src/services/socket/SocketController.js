import axios from 'axios';
import { SocketDataProvideer } from './SocketDataProvider';
import SocketRequest from './SocketRequest';

export var API_URL = PUBLIC_URL + '/void-eye-games-api';
export const setUrl = (url) => API_URL = url;
console.log(API_URL);
class SocketController {
    send(destination, onError = onHandleError) {
        this.sendCustom(new SocketRequest(), destination, onError);
    }

    sendCustom(request, destination, onError = onHandleError) {
        axios.request(this.getUrlFor(destination), request)
            .then(response => {
                SocketDataProvideer.supply(destination, response.data);
            })
            .catch(onError);
    }

    sendCustomWithCallback(request, destination, callback, onError = onHandleError) {
        axios.request(this.getUrlFor(destination), request)
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