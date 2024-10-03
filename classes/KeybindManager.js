class KeybindManager {

    constructor() {
        
    }

    // convert keycode to corresponding key
    convertKeyCode(keyCode) {
        return String.fromCharCode(keyCode);
    }

}

var keybindManager = new KeybindManager();