import { SocketObserver } from "./SocketObserver";

class SocketDataProvideer {
    constructor() {
        this.data = new Map();
    }

    supply(endPoint, data) {
        console.log(data);
        this.data.set(endPoint, data);
        SocketObserver.notify(endPoint);
    }

    provide(endPoint) {
        return this.data.get(endPoint);
    }
}

const SocketDataProvideerInstance = new SocketDataProvideer();
export {SocketDataProvideerInstance as SocketDataProvideer};
