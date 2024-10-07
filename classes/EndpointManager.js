
var useProxy = true;

const defaultApiBaseUrl = 'https://osrsplugins.xyz/api';
const proxyUrl = 'https://cors-proxy.fringe.zone/';

class EndpointManager {
    constructor() {
        if (!storage.load('savedApiDefaults')) {
            this.saveEndpointDefaults();
        }
    }
    
    saveEndpointDefaults() {
        storage.save('apiBaseUrl', defaultApiBaseUrl);
        storage.save('useProxy', useProxy);
        storage.save('savedApiDefaults', true);
    }

    getCurrentEndpoint(stripProxy = false) {
        var apiBaseUrl = storage.load('apiBaseUrl');
        var useProxy = storage.load('useProxy');
        var endpoint = useProxy === true ? proxyUrl + apiBaseUrl : apiBaseUrl;
        return stripProxy ? endpoint.replace(proxyUrl, '') : endpoint;
    }
}

const endpointManager = new EndpointManager();