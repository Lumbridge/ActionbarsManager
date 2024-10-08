class TemplateProvider {
    constructor() {
        
    }

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