class TemplateProvider {
    constructor() {
        
    }

    //
    // HTML Templates
    //

    getSlotTemplate(actionbarIndex, slotIndex, actionbarSlot, keybind, profileName) {
        return `
            <div data-profile-name="${profileName}" data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-1 my-1 cursor-pointer ${actionbarSlot.type}">
                <img class="slot-image" src="${actionbarSlot.imageLink}" alt="Item #${actionbarSlot.itemId}">
                <div class="flavour-text text-center">${actionbarSlot.flavourText}</div>
                <div class="keybind text-center">${keybind}</div>
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

    // 
    // JSON Templates
    // 

    getItemTemplate(modifier, itemId, action, customSprite = -1) {
        return `
            {
                "type": "ItemItem",
                "modifier": ${modifier},
                "itemId": ${itemId},
                "action": "${action}",
                "customSprite": ${customSprite}
            }
        `;
    }

    getPrayerTemplate(modifier, widgetId, action, customSprite = -1) {
        return `
            {
                "type": "PrayerItem",
                "modifier": ${modifier},
                "widgetId": ${widgetId},
                "action": "${action}",
                "customSprite": ${customSprite}
            }
        `;
    }

    getOrbTemplate(modifier, widgetType, customSprite = -1) {
        return `
            {
                "type": "OrbItem",
                "modifier": ${modifier},
                "widgetType": "${widgetType}",
                "customSprite": ${customSprite}
            }
        `;
    }

    getSpellbookItemTemplate(widgetId, customSprite = -1) {
        return `
            {
                "type": "SpellbookItem",
                "widgetId": ${widgetId},
                "customSprite": ${customSprite}
            }
        `;
    }

    getCompoundTemplate(name = "Compound action", customSprite = -1) {
        return `
            {
                "type": "CompoundItem",
                "name": "${name}",
                "customSprite": ${customSprite},
                "actions": []
            }
        `;
    }

}

var templateProvider = new TemplateProvider();