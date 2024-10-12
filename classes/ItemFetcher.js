const cacheRefreshInterval = 30; // 30 days
const imageBaseUrl = 'https://oldschool.runescape.wiki/images/thumb/${itemName}_detail.png/800px-${itemName}_detail.png';

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

            if (!itemId) {
                return;
            }

            // Check if the item is already in IndexedDB
            const cachedItem = await indexedDBHelper.getFromIndexedDB('items', itemId);

            if (cachedItem) {
                return cachedItem;
            }

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

            if (!itemId) {
                return "";
            }

            var item = await this.fetchItem(itemId);

            if (!item) {
                return "";
            }

            if(item.imageLink){
                return item.imageLink;
            }

            var itemName = item.name.replace(/ /g, '_');
            itemName = encodeURIComponent(itemName);
            itemName = itemName.replace(/'/g, '%27');
            itemName = itemName.replace(/_100$|_75$|_50$|_25$/, '');

            var imageLink = imageBaseUrl.replaceAll('${itemName}', itemName);

            item.imageLink = imageLink;

            indexedDBHelper.updateInIndexedDB('items', item);

            return imageLink;

        } catch (error) {
            console.log(error);
            notificationManager.error(`Error fetching item ${itemId} image: ` + error.message);
        }
    }

    async fetchItemActions(actionbarId, slotIndex, actionIndex = -1) {
        try {

            let profileName = profileManager.getCurrentProfileName();

            if (!actionbarId || !slotIndex) {
                return "";
            }

            var actionbar = profileManager.getActionbar(profileName, actionbarId);

            if (!actionbar) {
                return "";
            }

            let itemId = -1;
            if(actionIndex != -1){
                itemId = actionbar[slotIndex].actions[actionIndex].itemId;
            }else{
                itemId = actionbar[slotIndex].itemId;
            }

            var item = await this.fetchItem(itemId);

            if(!item){
                return [];
            }

            // remove null values
            item.inventoryActions = item.inventoryActions.filter(function (el) {
                return el != null;
            });

            return item.inventoryActions;

        } catch (error) {
            console.log(error);
            notificationManager.error(`Error fetching actionbar ${actionbarId} slot ${slotIndex} action: ` + error.message);
        }
    }

    async fetchItemActionsById(itemId){
        try {

            if (!itemId) {
                return "";
            }

            var item = await this.fetchItem(itemId);

            // remove null values
            item.inventoryActions = item.inventoryActions.filter(function (el) {
                return el != null;
            });

            return item.inventoryActions;

        } catch (error) {
            console.log(error);
            notificationManager.error(`Error fetching item ${itemId} actions: ` + error.message);
        }
    }

}

var itemFetcher = new ItemFetcher();
