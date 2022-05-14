class EventDataProvider {
    constructor() {
        this.data = new Map();
    }

    supply(endPoint, data) {
        this.data.set(endPoint, data);
    }

    provide(endPoint) {
        return this.data.get(endPoint);
    }
}

const EventDataProviderInstance = new EventDataProvider();
export { EventDataProviderInstance as EventDataProvider }