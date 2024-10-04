const cacheRefreshInterval = 30; // 30 days

class ItemFetcher {
    constructor() {
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

            const response = await fetch(`${endpointManager.getCurrentEndpoint()}/items`);

            if (!response.ok) {
                console.error(`Unable to fetch item ${itemId} from API - Status: ${response.status} (${response.statusText})`);
                return;
            }

            const data = await response.json();

            if (_.isEmpty(data)) {
                notificationManager.error('No data returned from API');
                return;
            }

            console.log(`Got ${data.length} items from API`);

            // Loop through the items and cache them in IndexedDB and update loading bar progress
            for (let i = 0; i < data.length; i++) {
                await indexedDBHelper.saveToIndexedDB('items', data[i]);
            }

            // Update the cacheLastUpdated metadata
            await indexedDBHelper.saveToIndexedDB('metadata', { key: 'cacheLastUpdated', value: new Date().getTime() });

            return data;

        } catch (error) {

            console.log(error);

            notificationManager.error('Error fetching item data when caching item catalogue: ' + error.message);

        }
    }

    async fetchItem(itemId) {
        try {

            if (itemId === undefined) {
                return;
            }

            // Check if the item is already in IndexedDB
            const cachedItem = await indexedDBHelper.getFromIndexedDB('items', itemId);

            if (cachedItem) {
                return cachedItem;
            }

            console.info(`fetching using ${endpointManager.getCurrentEndpoint()}`);

            // Fetch item from API if not in cache
            const response = await fetch(`${endpointManager.getCurrentEndpoint()}/items/${itemId}`);

            if (!response.ok) {
                console.error(`Unable to fetch item ${itemId} from API - Status: ${response.status} (${response.statusText})`);
                return "";
            }

            const data = await response.json();

            if (_.isEmpty(data)) {
                return "";
            }

            // Cache the fetched item in IndexedDB
            await indexedDBHelper.saveToIndexedDB('items', data);

            return data;

        } catch (error) {

            console.log(error);

            notificationManager.error(`${error}`);

        }
    }

    async fetchItemImage(itemId) {
        try {

            if (itemId === undefined) {
                return "";
            }

            var item = await this.fetchItem(itemId);

            if (!item) {
                return "";
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
