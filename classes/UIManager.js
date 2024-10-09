class UIManager {
    constructor() {
        
    }

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

    addNewSlot(actionbarIndex, slotHtml) {
        $(`#actionbar-${actionbarIndex}`).append(slotHtml);
    }

    removeSlot(actionbarIndex, slotIndex) {
        $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).parent().remove();
        refreshActionbar(actionbarIndex, $('#profileDropdown').text());
    }

}

var uiManager = new UIManager();