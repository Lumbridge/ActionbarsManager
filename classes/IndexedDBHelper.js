class IndexedDBHelper {
    constructor() {
        this.dbPromise = this.openDatabase();
    }

    // purge database
    purgeDatabase() {
        return this.dbPromise.then(db => {
            db.close();
            return new Promise((resolve, reject) => {
                const request = indexedDB.deleteDatabase('ItemCacheDB');
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }

    // Open IndexedDB database
    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ItemCacheDB', 1);

            request.onupgradeneeded = function (event) {
                const db = event.target.result;

                // Create the object stores
                const itemStore = db.createObjectStore('items', { keyPath: 'id' });
                const metadataStore = db.createObjectStore('metadata', { keyPath: 'key' });
                itemStore.createIndex('itemNameIndex', 'name', { unique: false });
            };

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }


    // Save an item or metadata in IndexedDB
    saveToIndexedDB(storeName, data) {
        return this.dbPromise.then(db => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            store.put(data);

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject(event.target.error);
            });
        });
    }

    // Get an item or metadata from IndexedDB
    getFromIndexedDB(storeName, key) {
        return this.dbPromise.then(db => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);

            // parse key as integer if it is a number
            if (!isNaN(key)) {
                key = parseInt(key);
            }

            const request = store.get(key);

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }

    // update an item in indexedDB
    updateInIndexedDB(storeName, data) {
        return this.dbPromise.then(db => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            store.put(data);
        });
    }

    searchByItemName(itemName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ItemCacheDB', 1);

            request.onsuccess = function (event) {
                const db = event.target.result;

                // Start a transaction
                const transaction = db.transaction('items', 'readonly');
                const objectStore = transaction.objectStore('items');

                // Access the index
                const index = objectStore.index('itemNameIndex');

                const results = [];
                const seenNames = new Set(); // To track unique names
                const cursorRequest = index.openCursor();

                cursorRequest.onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        const item = cursor.value;
                        const itemNameLower = item.name.toLowerCase(); // Indexed name in lowercase
                        const searchTermLower = itemName.toLowerCase(); // Search term in lowercase

                        // Initialize score
                        let score = 0;

                        // Exact match gets the highest score
                        if (itemNameLower == searchTermLower) {
                            score = 100;
                        }
                        // Prefix match gets a high score
                        else if (itemNameLower.startsWith(searchTermLower)) {
                            score = 75;
                        }
                        // General substring match gets a moderate score
                        else if (itemNameLower.includes(searchTermLower)) {
                            score = 50;
                        }

                        // Penalize for difference in string length (closer length gets higher score)
                        const lengthDifference = Math.abs(itemNameLower.length - searchTermLower.length);
                        score -= lengthDifference;

                        // Check for uniqueness using the lowercase version of the name
                        if (score > 0 && !seenNames.has(itemNameLower)) {
                            seenNames.add(itemNameLower); // Mark this name as seen
                            results.push({ item, score });
                        }

                        cursor.continue(); // Continue to the next item
                    } else {
                        // Sort results by score in descending order
                        results.sort((a, b) => b.score - a.score);

                        // Return sorted items, removing the score metadata
                        resolve(results.map(result => result.item));
                    }
                };

                cursorRequest.onerror = function (event) {
                    reject(event.target.error);
                };
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }

}

var indexedDBHelper = new IndexedDBHelper();