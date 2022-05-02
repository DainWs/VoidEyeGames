import axios from 'axios';
import { SocketDataProvideer } from './SocketDataProvider';
import SocketRequest from './SocketRequest';

export const API_URL = 'http://localhost/VoidEyeGames/void-eye-games-api';

class SocketController {
    send(destination, onError = onHandleError) {
        console.log(new SocketRequest());
        this.sendCustom(new SocketRequest(), destination, onError);
    }

    sendCustom(request, destination, onError = onHandleError) {
        console.log(request);
        axios.request(this.getUrlFor(destination), request)
            .then(response => {
                SocketDataProvideer.supply(destination, response.data);
            })
            .catch(onError);
    }

    sendCustomWithCallback(request, destination, callback, onError = onHandleError) {
        console.log(request);
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