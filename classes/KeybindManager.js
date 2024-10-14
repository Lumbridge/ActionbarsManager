class KeybindManager {

    // get keybinds from storage
    getKeybinds(profileName) {
        var profileData = profileManager.getProfile(profileName);
        return profileData[1][1];
    }

    // get keybind for a slot index
    getSlotKeybind(profileName, slotIndex) {
        var keybinds = this.getKeybinds(profileName);
        return this.convertKeyCode(keybinds[slotIndex]);
    }

    setSlotKeybind(profileName, slotIndex, keybind) {
        var profileData = profileManager.getProfile(profileName);
        var keybinds = profileData[1][1];
        keybinds[slotIndex] = keybind;
        profileData[1][1] = keybinds;
        profileManager.saveProfile(profileName, profileData);
    }

    // convert keycode to corresponding key
    convertKeyCode(keyCode) {
        if (!keyCode || keyCode.keybind.length != 4) {
            return "";
        }
        keyCode = keyCode.keybind.slice(0, -2);
        return String.fromCharCode(keyCode);
    }

}

var keybindManager = new KeybindManager();