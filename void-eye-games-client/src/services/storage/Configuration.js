const API_URL_DEFAULT = 'https://localhost:8080/';
const API_URL_KEY = 'ApiUrl';

class Configuration {
    constructor() {
        if (this.getApiUrl() == null) {
            this.setApiUrl(API_URL_DEFAULT);
        }
    }

    getApiUrl() {
        localStorage.getItem(API_URL_KEY);
    }

    setApiUrl(value) {
        localStorage.setItem(API_URL_KEY, value);
    }
}

export default new Configuration();