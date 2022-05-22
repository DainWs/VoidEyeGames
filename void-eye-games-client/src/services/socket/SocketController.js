import axios from 'axios';
import { SocketDataProvideer } from './SocketDataProvider';
import SocketRequest from './SocketRequest';

export const API_URL = process.env.REACT_APP_PUBLIC_API;

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
        console.log(request);
        console.log(this.getUrlFor(destination));
        axios.request(this.getUrlFor(destination), request)
            .then(response => callback(response))
            .catch(onError);
    }

    getUrlFor(destination) {
        return API_URL + destination;
    }
}

function onHandleError(error) {
    console.log(error);
}

const SocketControllerInstance = new SocketController();
export {SocketControllerInstance as SocketController};