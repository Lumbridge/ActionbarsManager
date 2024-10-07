
const profileKey = 'profileData';

class ProfileManager {

    constructor() {
        let profileData = storage.load(profileKey);
        if (!profileData) {
            storage.save(profileKey, []);
        }
    }

    // export profile as json
    exportProfile(profileName) {
        let profileData = this.getProfile(profileName);
        return JSON.stringify(profileData[1]);
    }
    
    // Get a list of profile names
    getProfileNames() {
        let profileData = storage.load(profileKey);
        return profileData.map(profile => profile[0]);
    }

    // Get a profile by name
    getProfile(profileName) {
        let profileData = storage.load(profileKey);
        return profileData.find(profile => profile[0] === profileName);
    }

    saveProfile(profileName, profileData) {
        let allProfiles = storage.load(profileKey);
        let profileIndex = allProfiles.findIndex(profile => profile[0] === profileName);
        allProfiles[profileIndex] = profileData;
        storage.save(profileKey, allProfiles);
    }

    // Method to import a profile
    importProfile(profileName, jsonData) {
        try {

            // Check if the profile name is empty
            if (!profileName) {
                notificationManager.error('Profile name is required');
                return;
            }

            // check if the profile name already exists
            const profileNames = this.getProfileNames();
            if (profileNames.includes(profileName)) {
                notificationManager.error('Profile name already exists');
                return;
            }

            // Check if the JSON data is empty
            if (!jsonData) {
                notificationManager.error('JSON data is required');
                return;
            }

            // get the profile data
            const profileData = storage.load(profileKey);

            // Parse the JSON data
            const newProfileData = JSON.parse(jsonData);

            // Add the new profile data to the existing profile data
            profileData.push([profileName, newProfileData]);

            // Save the profile data
            storage.save(profileKey, profileData);

            // Show a success message
            notificationManager.success(`Profile ${profileName} imported successfully`);

        } catch (error) {
            console.log(error);
            notificationManager.error('Error importing profile: ' + error.message);
        }
    }

    // Get Actionbars
    getActionbars(profileName) {
        let profileData = this.getProfile(profileName);
        return profileData[1][0];
    }

    // Get Actionbar
    getActionbar(profileName, actionbarIndex) {
        let actionbars = this.getActionbars(profileName);
        return actionbars[actionbarIndex];
    }

    // Get Actionbar Slot
    async getActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex = -1, addApiData = true, addImageLink = true) {

        // Get the actionbar
        let actionbar = this.getActionbar(profileName, actionbarIndex);

        // Get the slot from the actionbar
        var slot = actionbar[slotIndex];

        // Get the action from the slot
        if (actionIndex !== "-1" && actionIndex !== -1) {
            slot = slot.actions[actionIndex];
            slot.actionIndex = actionIndex;
        }

        // Get the item data for the slot
        if (addApiData && slot.itemId !== undefined) {
            slot.apiData = await itemFetcher.fetchItem(slot.itemId);
        }

        // Get the image link for the slot
        if (addImageLink) {
            if (addApiData && slot.apiData !== undefined || slot.type !== "ItemItem") {
                slot.imageLink = await this.getImageLink(slot.type, slot);
            }
        }

        // Set the text for the slot
        slot.flavourText = slot.name !== undefined ? slot.name : slot.action;
        if (slot.flavourText === undefined) {
            slot.flavourText = "";
        }

        slot.type === 'LastActorItem' ? slot.flavourText = 'Attack Last Actor' : slot.flavourText;

        slot.type === 'PrayerItem' ? slot.flavourText = 'Toggle Prayer' : slot.flavourText;

        slot.type === 'OrbItem' ? slot.flavourText = slot.widgetType : slot.flavourText;

        return slot;
    }

    async getImageLink(type, actionbarSlot) {

        var imageLink = "";
    
        if (type === "CompoundItem") {
            type = actionbarSlot.actions[0].type;
            return this.getImageLink(type, actionbarSlot.actions[0]);
        }
        else if (type === "ItemItem") {
            var spriteItemId = actionbarSlot.customSprite == '-1' || !actionbarSlot.customSprite ? actionbarSlot.itemId : actionbarSlot.customSprite;
            imageLink = await itemFetcher.fetchItemImage(spriteItemId);
        }
        else if (type === "OrbItem") {
            imageLink = widgetLookup.fetchItemImage(actionbarSlot.widgetType);
        }
        else {
            imageLink = widgetLookup.fetchItemImage(actionbarSlot.widgetId);
        }

        return imageLink;
    }

    // update ItemItem slot action
    async updateItemAction(profileName, actionbarIndex, slotIndex, action, actionIndex = -1, itemId = -1) {
        
        var slot = await this.getActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex, false, false);

        slot.action = action;

        if(itemId !== -1){
            slot.itemId = itemId;
        }

        var profileData = this.getProfile(profileName);
        var actionbars = this.getActionbars(profileName);
        var actionbar = this.getActionbar(profileName, actionbarIndex);

        if (actionIndex !== "-1" && actionIndex !== -1) {
            actionbar[slotIndex].actions[actionIndex] = slot;
        } else {
            actionbar[slotIndex] = slot;
        }
        
        actionbars[actionbarIndex] = actionbar;

        profileData[1][0] = actionbars;

        this.saveProfile(profileName, profileData);
    }
}

var profileManager = new ProfileManager();