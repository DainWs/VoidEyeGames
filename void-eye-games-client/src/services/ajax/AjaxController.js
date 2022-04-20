import axios from 'axios';

const API_URL = 'http://localhost/VoidEyeGames/void-eye-games-api';

class AjaxController {
    send(request, destination, callback) {
        axios.request(API_URL + destination, request)
            .then(callback).catch(function (error) {
                console.error(error);
            });
    }
}

export default new AjaxController();