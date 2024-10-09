class HtmlTemplateProvider {
    constructor() {
        
    }

    getSlotTemplate(actionbarIndex, slotIndex, actionbarSlot, keybind, profileName) {
        return `
            <div data-profile-name="${profileName}" data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-1 my-1 cursor-pointer ${actionbarSlot.type}">
                <img class="slot-image" src="${actionbarSlot.imageLink}" alt="Item #${actionbarSlot.itemId}">
                <div class="flavour-text text-center">${actionbarSlot.flavourText}</div>
                <div class="keybind text-center">${keybind}</div>
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

    getNewSlotTemplate(actionbarIndex, slotIndex) {
        return `
            <div class="col-auto my-2 my-xxl-0">
                <div class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-2 my-1 cursor-pointer add-new-slot" 
                    data-actionbar-index="${actionbarIndex}" 
                    data-slot-index="${slotIndex}">
                    <span class="text-muted">Add New Slot</span>
                </div>
            </div>
        `;
    }

}

var htmlTemplateProvider = new HtmlTemplateProvider();