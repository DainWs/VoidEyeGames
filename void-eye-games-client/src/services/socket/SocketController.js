import axios from 'axios';
import { SocketDataProvideer } from './SocketDataProvider';
import SocketRequest from './SocketRequest';

export const API_URL = 'http://localhost/VoidEyeGames/void-eye-games-api';

class SocketController {
    send(destination) {
        this.sendCustom(new SocketRequest(), destination);
    }

    sendCustom(request, destination) {
        axios.request(API_URL + destination, request)
            .then(response => SocketDataProvideer.supply(destination, response.data))
            .catch(function (error) {console.error(error);});
    }
}

const SocketControllerInstance = new SocketController();
export {SocketControllerInstance as SocketController};