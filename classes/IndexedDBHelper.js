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

            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                db.createObjectStore('items', { keyPath: 'id' }); // Create object store with 'id' as keyPath
                db.createObjectStore('metadata', { keyPath: 'key' }); // Store metadata like 'cacheLastUpdated'
            };

            request.onsuccess = function(event) {
                resolve(event.target.result);
            };

            request.onerror = function(event) {
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
            const request = store.get(key);

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }
}

var indexedDBHelper = new IndexedDBHelper();