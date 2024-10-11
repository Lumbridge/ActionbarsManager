class UIManager {

    setSlotAction(actionbarIndex, slotIndex, actionIndex, newAction) {
        if (actionIndex && actionIndex !== undefined && actionIndex !== -1 && actionIndex !== "-1") {
            $(`.sub-slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"][data-action-index="${actionIndex}"]`).find('.flavour-text').text(newAction);
        } else {
            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).find('.flavour-text').text(newAction);
        }
    }

    setSlotImage(actionbarIndex, slotIndex, actionIndex, newImageLink) {
        if (actionIndex && actionIndex !== undefined && actionIndex !== -1 && actionIndex !== "-1") {

            // parse action index to a number
            actionIndex = parseInt(actionIndex);

            // if aciton index is 0 then set the parent slot image as well
            if (actionIndex === 0) {
                $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).find('.slot-image').attr('src', newImageLink);
            }
                
            $(`.sub-slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"][data-action-index="${actionIndex}"]`).find('.slot-image').attr('src', newImageLink);
            
        } else {
            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).find('.slot-image').attr('src', newImageLink);
        }
    }

    addNewSlot(actionbarIndex, slotHtml, slotIndex) {
        if (slotIndex) {
            $(`.slot-container[data-actionbar-index=${actionbarIndex}][data-slot-index="${slotIndex} ~ .actionbar-slot.details"]`).append(slotHtml);
        }else{
            $(`#actionbar-${actionbarIndex}`).append(slotHtml);
        }
    }

    removeSlot(actionbarIndex, slotIndex, actionIndex) {
        if(actionIndex){
            $(`.sub-slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"][data-action-index="${actionIndex}"]`).remove();
        }else{
            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).parent().remove();
        }
        this.refreshActionbar(actionbarIndex, $('#profileDropdown').text());
    }

    refreshActionbar(actionbarIndex, profileName) {

        var $parentSlots = $(`.actionbar-sortable#actionbar-${actionbarIndex} .slot-container`);
        
        for (let i = 0; i < $parentSlots.length; i++) {
    
            let $parentSlot = $parentSlots.eq(i);
            $parentSlot.attr('data-slot-index', i);
    
            var keyBind = keybindManager.getSlotKeybind(profileName, i);
            $parentSlot.find('.keybind').text(keyBind);
    
            var $children = $parentSlot.next('.actionbar-slot-details').find('.action-slot');
            for (let j = 0; j < $children.length; j++) {
                $children.eq(j).attr('data-slot-index', i);
                $children.eq(j).attr('data-action-index', j);
            }
    
            // Update the parent slot image to the first child image
            $parentSlot.find('img').attr('src', $children.first().find('img').attr('src'));
        }
    
    }

    updateActionbarSlots(actionbarIndex, profileName) {

        let promises = [];

        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);
        var keyBinds = keybindManager.getKeybinds(profileName).map(keyCode => keybindManager.convertKeyCode(keyCode));    

        for (let slotIndex in actionbar) {
            promises.push(
                profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex).then((actionbarSlot) => {
                    
                    let keybind = keyBinds[slotIndex];

                    if(keybind === undefined){
                        keybind = "no keybind";
                    }

                    var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, actionbarSlot);

                    $(`.loading-slot[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).parent().replaceWith(slotHtml);
                })
            );
        }
    }
    
}

var uiManager = new UIManager();