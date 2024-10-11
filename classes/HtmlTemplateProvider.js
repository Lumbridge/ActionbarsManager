class HtmlTemplateProvider {

    getSlotTemplate(actionbarIndex, slotIndex, actionbarSlot) {

        if(!actionbarSlot){
            actionbarSlot = profileManager.getActionbarSlot(profileManager.getCurrentProfileName(), actionbarIndex, slotIndex);
        }

        let keybind = keybindManager.getSlotKeybind(profileManager.getCurrentProfileName(), slotIndex);

        return `
            <div class="col-auto my-2 my-xxl-0">
                <div class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-1 my-1 cursor-pointer ${actionbarSlot.type}"
                data-actionbar-index="${actionbarIndex}" 
                data-slot-index="${slotIndex}">
                    <img class="slot-image" src="${actionbarSlot.imageLink}" alt="Item #${actionbarSlot.itemId}">
                    <div class="flavour-text text-center">${actionbarSlot.flavourText}</div>
                    <div class="keybind text-center">${keybind}</div>
                </div>
            </div>
        `;
    }

    getChildSlotTemplate(actionbarIndex, slotIndex, action) {
        return `
            <div class="action-slot d-flex flex-column align-items-center justify-content-center mt-2 bg-dark-subtle ${action.type} sub-slot-container border border-2 rounded py-2 cursor-pointer"
                data-actionbar-index="${actionbarIndex}" 
                data-slot-index="${slotIndex}"
                data-action-index="${action.actionIndex}">
                    <img class="sub-slot-image" src="${action.imageLink}" alt="Item #${action.itemId}">
                    <div class="flavour-text">${action.flavourText}</div>
            </div>
        `;
    }

    getSlotLoadingTemplate(actionbarIndex, slotIndex) {
        return `
            <div class="col-auto my-2 my-xxl-0">
                <div class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-2 my-1 cursor-not-allowed loading-slot" 
                     data-actionbar-index="${actionbarIndex}" 
                     data-slot-index="${slotIndex}" 
                     style="opacity: 0.5; pointer-events: none;">
                    <div class="spinner-border text-primary loading-spinner" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        `;
    }

}

var htmlTemplateProvider = new HtmlTemplateProvider();