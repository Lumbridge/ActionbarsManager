class StorageManager {
    constructor(storageType = 'localStorage') {
      this.storage = window[storageType];
      if (!this.storage) {
        throw new Error('Storage type not supported.');
      }
    }
  
    // Save data to storage
    save(key, data) {
      const serializedData = JSON.stringify(data);
      this.storage.setItem(key, serializedData);
    }
  
    // Load data from storage
    load(key) {
      const serializedData = this.storage.getItem(key);
      return serializedData ? JSON.parse(serializedData) : null;
    }
  
    // Remove data from storage
    remove(key) {
      this.storage.removeItem(key);
    }
  
    // Clear all data from storage
    clear() {
      this.storage.clear();
    }
  }
  
  const storage = new StorageManager();