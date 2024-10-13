const profileKey = 'profileData';

class ProfileManager {

    constructor() {
        this.initProfileData();
    }

    initProfileData() {
        let profileData = storage.load(profileKey);
        if (!profileData) {
            storage.save(profileKey, []);
        }
    }

    // ====================
    // Actionbar operations
    // ====================
    
    addEmptyActionbar(profileName){
        let profileData = this.getProfile(profileName);
        profileData[1][0].push([]);
        this.saveProfile(profileName, profileData);
    }

    deleteActionbar(profileName, actionbarIndex){
        let profileData = this.getProfile(profileName);
        profileData[1][0].splice(actionbarIndex, 1);
        this.saveProfile(profileName, profileData);
    }

    getActionbar(profileName, actionbarIndex) {
        return this.getActionbars(profileName)[actionbarIndex];
    }

    saveActionbar(profileName, actionbarIndex, actionbarData) {
        let actionbars = this.getActionbars(profileName);
        actionbars[actionbarIndex] = actionbarData;
        this.saveActionbars(profileName, actionbars);
    }

    addItemToActionbar(profileName, type, actionbarIndex, slotIndex, actionIndex = -1, id = -1, action = "") {
        let template = jsonTemplateProvider.getTemplate(type, id, action);

        let slot = JSON.parse(template);
        if (actionIndex != -1) slot.actionIndex = actionIndex;

        this.saveActionbarSlot(profileName, actionbarIndex, slotIndex, slot, actionIndex);
    }

    // ==================
    // Profile operations
    // ==================

    getCurrentProfileName() {
        return $('#profileDropdown').text();
    }

    exportProfile(profileName) {
        return JSON.stringify(this.getProfile(profileName)[1]);
    }

    importProfile(profileName, jsonData) {
        if (!this.validateImportData(profileName, jsonData)) return;

        try {
            let profileData = storage.load(profileKey);
            profileData.push([profileName, JSON.parse(jsonData)]);
            storage.save(profileKey, profileData);

            notificationManager.success(`Profile ${profileName} imported successfully`);
        } catch (error) {
            console.error(error);
            notificationManager.error(`Error importing profile: ${error.message}`);
        }
    }

    getProfileNames() {
        return storage.load(profileKey).map(profile => profile[0]);
    }

    getProfile(profileName) {
        return storage.load(profileKey).find(profile => profile[0] === profileName);
    }

    saveProfile(profileName, profileData) {
        let profiles = storage.load(profileKey);
        const profileIndex = profiles.findIndex(profile => profile[0] === profileName);

        if (profileIndex != -1) {
            profiles[profileIndex] = profileData;
        } else {
            profiles.push([profileName, profileData]);
        }

        storage.save(profileKey, profiles);
    }

    // ===============
    // Slot operations
    // ===============

    saveActionbarSlot(profileName, actionbarIndex, slotIndex, slotData, actionIndex = -1) {
        let actionbar = this.getActionbar(profileName, actionbarIndex);

        if (actionIndex != -1) {
            actionbar[slotIndex].actions[actionIndex] = slotData;
        } else {
            actionbar[slotIndex] = slotData;
        }

        this.saveActionbar(profileName, actionbarIndex, actionbar);
    }

    getActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex = -1) {
        let slot = this.getActionbar(profileName, actionbarIndex)[slotIndex];

        if (actionIndex != -1) {
            slot = slot.actions[actionIndex];
            slot.actionIndex = actionIndex;
        }

        slot.flavourText = slot.name || slot.action || '';
        this.setSlotFlavourText(slot);

        return slot;
    }

    updateSlotId(slot, id) {
        switch (slot.type) {
            case "ItemItem":
                slot.itemId = id;
                break;
            case "PrayerItem":
            case "OrbItem":
            case "SpellbookItem":
                slot.widgetId = id;
                break;
        }
        return slot;
    }

    setSlotFlavourText(slot) {
        let widgetName = slot.widgetId ? widgetLookup.fetchWidgetName(slot.widgetId) : '';

        if (slot.type === 'LastActorItem') {
            slot.flavourText = 'Attack Last Actor';
        } else if (slot.type == 'PrayerItem') {
            slot.flavourText = `Toggle ${widgetName}`;
        } else if (slot.type == 'OrbItem') {
            slot.flavourText = slot.widgetType;
        }
    }

    getActionbars(profileName) {
        return this.getProfile(profileName)[1][0];
    }

    saveActionbars(profileName, actionbars) {
        let profileData = this.getProfile(profileName);
        profileData[1][0] = actionbars;
        this.saveProfile(profileName, profileData);
    }

    updateSlotAction(actionbarIndex, slotIndex, action, actionIndex = -1, id = -1) {
        let profileName = this.getCurrentProfileName();
        let slot = this.getActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex);

        if (slot.type == "ItemItem") slot.action = action;
        if (id != -1) slot = this.updateSlotId(slot, id);

        this.saveActionbarSlot(profileName, actionbarIndex, slotIndex, slot, actionIndex);
    }

    deleteActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex = -1) {
        let actionbar = this.getActionbar(profileName, actionbarIndex);
        if (actionIndex != -1) {
            actionbar[slotIndex].actions.splice(actionIndex, 1);
        } else {
            actionbar.splice(slotIndex, 1);
        }
        this.saveActionbar(profileName, actionbarIndex, actionbar);
    }

    // API and image data enrichment
    async getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex, actionIndex = -1, addApiData = true, addImageLink = true) {
        let slot = this.getActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex);

        if (addApiData && slot.itemId) {
            slot.apiData = await itemFetcher.fetchItem(slot.itemId);
        }

        if (addImageLink) {
            slot.imageLink = await this.getImageLink(slot.type, slot);
        }

        return slot;
    }

    async getImageLink(type, actionbarSlot) {
        if (type == "CompoundItem") {
            return this.getImageLink(actionbarSlot.actions[0].type, actionbarSlot.actions[0]);
        }

        let spriteItemId = actionbarSlot.customSprite == -1 || !actionbarSlot.customSprite ? actionbarSlot.itemId : actionbarSlot.customSprite;
        if (type == "ItemItem") {
            return await itemFetcher.fetchItemImage(spriteItemId);
        }

        return widgetLookup.fetchItemImage(actionbarSlot.widgetType || actionbarSlot.widgetId);
    }

    validateImportData(profileName, jsonData) {
        if (!profileName) {
            notificationManager.error('Profile name is required');
            return false;
        }

        if (this.getProfileNames().includes(profileName)) {
            notificationManager.error('Profile name already exists');
            return false;
        }

        if (!jsonData) {
            notificationManager.error('JSON data is required');
            return false;
        }

        return true;
    }

}

var profileManager = new ProfileManager();