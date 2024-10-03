
const defaultApiBaseUrl = 'https://osrsplugins.xyz/api';
const proxyUrl = 'https://cors-proxy.fringe.zone/';
const imageBaseUrl = 'https://oldschool.runescape.wiki/images';

var currentApiUrl = '';
var useProxy = true;

const cacheRefreshInterval = 30; // 30 days

class ItemFetcher {
    constructor() {
        currentApiUrl = storage.load('apiBaseUrl') || defaultApiBaseUrl;
        useProxy = storage.load('useProxy');

        if (useProxy) {
            currentApiUrl = proxyUrl + currentApiUrl;
        }

        this.cacheItemCatalogue();
    }

    async cacheItemCatalogue() {
        try {
            // Get metadata from IndexedDB (including cacheLastUpdated)
            const metadata = await indexedDBHelper.getFromIndexedDB('metadata', 'cacheLastUpdated');

            if (metadata) {
                const cacheLastUpdated = metadata.value;
                const cacheAge = new Date().getTime() - cacheLastUpdated;
                const cacheAgeDays = cacheAge / (1000 * 60 * 60 * 24);

                if (cacheAgeDays < cacheRefreshInterval) {
                    console.log(`Cache is ${cacheAgeDays} days old, skipping refresh`);
                    return;
                }
            }

            console.log('Refreshing cache');
            const response = await fetch(`${currentApiUrl}/items`);

            if (!response.ok) {
                notificationManager.error(`HTTP error! Status: ${response.status}`);
                return;
            }

            const data = await response.json();

            if (_.isEmpty(data)) {
                notificationManager.error('No data returned from API');
                return;
            }

            console.log(`Got ${data.length} items from API`);

            // Loop through the items and cache them in IndexedDB
            for (var item of data) {
                await indexedDBHelper.saveToIndexedDB('items', item);
            }

            // Update the cacheLastUpdated metadata
            await indexedDBHelper.saveToIndexedDB('metadata', { key: 'cacheLastUpdated', value: new Date().getTime() });

            return data;

        } catch (error) {
            console.log(error);
            notificationManager.error('Error fetching item data: ' + error.message);
        }
    }

    async fetchItem(itemId) {
        try {
            // Check if the item is already in IndexedDB
            const cachedItem = await indexedDBHelper.getFromIndexedDB('items', itemId);

            if (cachedItem) {
                return cachedItem;
            }

            // Fetch item from API if not in cache
            const response = await fetch(`${currentApiUrl}/items/${itemId}`);

            if (!response.ok) {
                notificationManager.error(`HTTP error! Status: ${response.status}`);
                return;
            }

            const data = await response.json();

            if (_.isEmpty(data)) {
                //notificationManager.error('No data returned from API for ID ' + itemId);
                return;
            }

            // Cache the fetched item in IndexedDB
            await indexedDBHelper.saveToIndexedDB('items', data);

            return data;

        } catch (error) {
            console.log(error);
            notificationManager.error('Error fetching item data: ' + error.message);
        }
    }

    async fetchItemImage(itemId) {
        try {
            var item = await this.fetchItem(itemId);

            if (!item) {
                return;
            }

            var itemName = item.name.replace(/ /g, '_');
            itemName = encodeURIComponent(itemName);
            itemName = itemName.replace(/'/g, '%27');
            itemName = itemName.replace(/_100$|_75$|_50$|_25$/, '');

            var imageLink = `${imageBaseUrl}/${itemName}.png`;
            return imageLink;            

        } catch (error) {
            console.log(error);
            notificationManager.error(`Error fetching item ${itemId} image: ` + error.message);
        }
    }
}

var itemFetcher = new ItemFetcher();
