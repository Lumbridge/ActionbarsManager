class HtmlTemplateProvider {

    getSlotTemplate(actionbarIndex, slotIndex, slot) {

        if(!slot) {
            slot = profileManager.getActionbarSlot(profileManager.getCurrentProfileName(), actionbarIndex, slotIndex);
        }

        let keybind = keybindManager.getSlotKeybind(profileManager.getCurrentProfileName(), slotIndex);

        return `
            <div class="col-auto my-2 my-xxl-0">
                <div class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-1 my-1 cursor-pointer ${slot.type}"
                data-actionbar-index="${actionbarIndex}" 
                data-slot-index="${slotIndex}">
                    <img class="slot-image" src="${slot.imageLink}" alt="Item #${slot.itemId}">
                    <div class="flavour-text text-center">${slot.flavourText}</div>
                    <div class="keybind text-center">${keybind}</div>
                </div>
            </div>
        `;
    }

    getChildSlotTemplate(actionbarIndex, slotIndex, slot) {
        return `
            <div class="action-slot d-flex flex-column align-items-center justify-content-center mt-2 bg-dark-subtle ${slot.type} sub-slot-container border border-2 rounded py-2 cursor-pointer"
                data-actionbar-index="${actionbarIndex}" 
                data-slot-index="${slotIndex}" 
                data-action-index="${slot.actionIndex}">
                    <img class="sub-slot-image" src="${slot.imageLink}" alt="Item #${slot.itemId}">
                    <div class="flavour-text text-center">${slot.flavourText}</div>
            </div>
        `;
    }

    getSlotLoadingTemplate(actionbarIndex, slotIndex) {
        return `
            <div class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-2 my-1 cursor-not-allowed loading-slot" 
                    data-actionbar-index="${actionbarIndex}" 
                    data-slot-index="${slotIndex}" 
                    style="opacity: 0.5; pointer-events: none;">
                <div class="spinner-border text-primary loading-spinner" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }

}

var htmlTemplateProvider = new HtmlTemplateProvider();