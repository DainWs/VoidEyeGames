import axios from 'axios';

class AjaxController {
    get(request, callback) {
        request.setMethod('GET');
        axios.request(request)
            .then(callback).catch(function (error) {
                console.error(error);
            });
    }
}

export default new AjaxController();