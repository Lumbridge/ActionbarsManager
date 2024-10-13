class JsonTemplateProvider {

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

    getTemplate(type, id, action) {
        switch (type) {
            case "ItemItem":
                return jsonTemplateProvider.getItemTemplate(false, id, action);
            case "PrayerItem":
                return jsonTemplateProvider.getPrayerTemplate(false, id, action);
            case "OrbItem":
                return jsonTemplateProvider.getOrbTemplate(false, id);
            case "SpellbookItem":
                return jsonTemplateProvider.getSpellbookItemTemplate(id);
            case "CompoundItem":
                return jsonTemplateProvider.getCompoundTemplate();
            default:
                return '';
        }
    }

}

var jsonTemplateProvider = new JsonTemplateProvider();