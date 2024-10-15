class ModalProvider {

    showPromptModal(promptMessage, callback) {
        bootbox.prompt({
            title: promptMessage,
            callback: function (result) {
                if (result) {
                    callback(result);
                }
            }
        }).on('shown.bs.modal', function () {
            $('#searchBox').focus();
        });
    }

    showAddNewSlotModal(actionbarIndex, slotIndex) {
        // show a context menu to select the type of slot to add: options are Item, Prayer, Spellbook and Compound
        bootbox.dialog({
            title: 'Add New Slot',
            message: `
                <div class="form-group">
                    <label for="option-select">Select Slot Type</label>
                    <select id="option-select" class="form-control">
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="ItemItem">Item</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="PrayerItem">Prayer</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="SpellBookItem">Spell</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="OrbItem">Orb</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="LastActorItem">Attack last actor</option>
                    </select>
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Choose",
                    className: 'btn-primary',
                    callback: async function () {

                        const selectedType = $('#option-select').val();

                        let actionbar = profileManager.getActionbar(profileManager.getCurrentProfileName(), actionbarIndex);

                        if (!slotIndex) {
                            slotIndex = actionbar.length;
                        }

                        if (selectedType == "ItemItem") {
                            modalProvider.showItemSearchModal(actionbarIndex, slotIndex);
                        } else if (selectedType == "PrayerItem") {
                            modalProvider.showPrayerSelectionModal(actionbarIndex, slotIndex);
                        } else if (selectedType == "OrbItem") {
                            modalProvider.showOrbSelectionModal(actionbarIndex, slotIndex);
                        } else if (selectedType == "LastActorItem") {

                            var slot = actionbar[slotIndex];

                            if (slot && slot.type == "CompoundItem") {
                                slot.actions.push({ type: selectedType, customSpriteId: -1 });
                                await modalProvider.updateCompoundChildSlot(actionbarIndex, slotIndex, slot);
                            } else {
                                await modalProvider.addNewSlotToActionbar(actionbarIndex, slotIndex, "LastActorItem", -1, -1, { name: "Attack Last Actor", customSpriteId: -1 });
                            }

                        } else if (selectedType == "SpellBookItem") {
                            modalProvider.showSpellbookSelectionModal(actionbarIndex, slotIndex);
                        }
                    }
                }
            }
        });
    }

    showItemSearchModal(actionbarIndex, slotIndex, actionIndex = -1) {

        // Show the Bootbox modal
        bootbox.dialog({
            title: 'Search Items',
            message: `
                <div>
                    <input type="text" id="searchBox" class="form-control" placeholder="Type at least 3 characters to search...">
                    <ul id="resultsList" class="list-group mt-3"></ul>
                    <div class="mt-3" id="paginationButtons"></div>
                </div>
            `,
            closeButton: true
        }).on('shown.bs.modal', function () {
            $('#searchBox').focus();
        });

        $(document).off('input', '#searchBox');
        $(document).off('click', '#prevPage');
        $(document).off('click', '#nextPage');

        let searchResults = []; // Store the full results

        let typingTimer;                 // Timer identifier
        const typingDelay = 300;         // Delay in milliseconds

        // Handle typing in the search box
        $(document).on('input', '#searchBox', function () {
            const query = $(this).val(); // Get the current input value

            // Clear the previous timer
            clearTimeout(typingTimer);

            if (query.length >= 3) {
                // Set a new timer for the delay
                typingTimer = setTimeout(() => {
                    // Call the search function after the delay
                    indexedDBHelper.searchByItemName(query).then(results => {
                        searchResults = results; // Store the full results
                        modalProvider.renderPaginatedSearchResults(searchResults, 1, actionbarIndex, slotIndex, actionIndex); // Render the first page of results
                    });
                }, typingDelay); // Wait before triggering the search
            } else {
                $('#resultsList').empty(); // Clear results if less than 3 characters are typed
                $('#paginationButtons').empty(); // Clear pagination buttons
            }
        });

        $(document).on('click', '#prevPage', function () {
            if (currentPage > 1) {
                modalProvider.renderPaginatedSearchResults(searchResults, currentPage - 1, actionbarIndex, slotIndex, actionIndex);
            }
        });

        $(document).on('click', '#nextPage', function () {
            if (currentPage < totalPages) {
                modalProvider.renderPaginatedSearchResults(searchResults, currentPage + 1, actionbarIndex, slotIndex, actionIndex);
            }
        });

    }

    showActionSelectionModal(actions, actionbarIndex, slotIndex, itemId, actionIndex, imageLink) {

        let profileName = profileManager.getCurrentProfileName();

        actions.push("Use");

        bootbox.dialog({
            title: 'Select Action',
            message: `
                        <div class="form-group">
                            <label for="option-select">Select an action</label>
                            <select id="option-select" class="form-control">
                                ${actions.map(action => `<option value="${action}">${action}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group mt-2 text-center" id="modifier-container" style="display: none;">
                            <label for="modifier-switch">Equip only (no un-equip)</label>
                            <input type="checkbox" id="modifier-switch" class="form-check-input" checked />
                        </div>
                    `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: async function () {
                        const selectedAction = $('#option-select').val();
                        const isModifierChecked = $('#modifier-switch').is(':checked');

                        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);

                        if (!slotIndex || slotIndex == "undefined") {
                            slotIndex = actionbar.length;
                        }

                        if (slotIndex == actionbar.length) {

                            profileManager.addItemToActionbar(profileName, "ItemItem", actionbarIndex, slotIndex, -1, itemId, selectedAction, isModifierChecked);
                            var slot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex);
                            var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, slot);
                            uiManager.addNewSlot(actionbarIndex, slotHtml);
                            bootbox.hideAll();

                        } else {

                            var slot = actionbar[slotIndex];

                            if (slot.type == "CompoundItem") {

                                if(actionIndex == -1) {

                                    slot.actions.push({ action: selectedAction, itemId: itemId, modifier: isModifierChecked, type: "ItemItem" });
                                    await modalProvider.updateCompoundChildSlot(actionbarIndex, slotIndex, slot);

                                } else {

                                    slot.actions[actionIndex] = { action: selectedAction, itemId: itemId, modifier: isModifierChecked, type: "ItemItem" };
                                    profileManager.updateSlotAction(actionbarIndex, slotIndex, selectedAction, actionIndex, itemId, isModifierChecked);
                                    uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, selectedAction);
                                    uiManager.setSlotImage(actionbarIndex, slotIndex, actionIndex, imageLink);
                                    bootbox.hideAll();

                                }

                            } else {

                                profileManager.updateSlotAction(actionbarIndex, slotIndex, selectedAction, actionIndex, itemId, isModifierChecked);
                                uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, selectedAction);
                                uiManager.setSlotImage(actionbarIndex, slotIndex, actionIndex, imageLink);
                                bootbox.hideAll();

                            }

                        }
                    }
                }
            }
        }).on('shown.bs.modal', function () {
            toggleModifierSwitch();
        });
    }

    showPrayerSelectionModal(actionbarIndex, slotIndex, actionIndex = -1) {

        const normalPrayers = widgetLookup.normalPrayers;

        bootbox.dialog({
            title: 'Select Prayer',
            message: `
                <div class="form-group">
                    <label for="option-select">Select a prayer</label>
                    <select id="option-select" class="form-control">
                        ${normalPrayers.map(prayer => `<option data-type="PrayerItem" value="${prayer.widgetId}">${prayer.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group mt-2 text-center" id="modifier-container" style="display: none;">
                    <label for="modifier-switch">Only turn prayer on (no toggling)</label>
                    <input type="checkbox" id="modifier-switch" class="form-check-input" />
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: async function () {

                        const isModifierChecked = $('#modifier-switch').is(':checked');
                        const selectedValue = $('#option-select').val();
                        const selectedLookupItem = widgetLookup.allWidgets.find(widget => widget.widgetId == selectedValue);
                        const profileName = profileManager.getCurrentProfileName();
                        const type = $('#option-select option:selected').attr('data-type');
                        const imageLink = await profileManager.getImageLinkById(type, selectedValue);

                        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);

                        await modalProvider.handleModalSave(actionbar, actionbarIndex, slotIndex, type, actionIndex, selectedValue, selectedLookupItem, imageLink, isModifierChecked);

                    }
                }
            }
        }).on('shown.bs.modal', function () {
            toggleModifierSwitch();
        });;
    }

    showSpellbookSelectionModal(actionbarIndex, slotIndex, actionIndex = -1) {
        const allSpells = widgetLookup.allSpells;

        bootbox.dialog({
            title: 'Select Spell',
            message: `
                <div class="form-group">
                    <label for="option-select">Select a spell</label>
                    <select id="option-select" class="form-control">
                        ${allSpells.map(spell => `<option data-type="SpellBookItem" value="${spell.widgetId}">${spell.name}</option>`).join('')}
                    </select>
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: async function () {

                        const selectedValue = $('#option-select').val();
                        const selectedLookupItem = widgetLookup.allWidgets.find(widget => widget.widgetId == selectedValue);
                        const profileName = profileManager.getCurrentProfileName();
                        const type = $('#option-select option:selected').attr('data-type');
                        const imageLink = await profileManager.getImageLinkById(type, selectedValue);

                        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);

                        await modalProvider.handleModalSave(actionbar, actionbarIndex, slotIndex, type, actionIndex, selectedValue, selectedLookupItem, imageLink);

                    }
                }
            }
        });
    }

    showOrbSelectionModal(actionbarIndex, slotIndex, actionIndex = -1) {
        const orbs = widgetLookup.orbs;

        bootbox.dialog({
            title: 'Select Orb',
            message: `
                <div class="form-group">
                    <label for="option-select">Select an orb type</label>
                    <select id="option-select" class="form-control">
                        ${orbs.map(orb => `<option data-type="OrbItem" value="${orb.widgetType}">${orb.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group mt-2 text-center" id="modifier-container" style="display: none;">
                    <label for="modifier-switch">Only turn orb on (no toggling)</label>
                    <input type="checkbox" id="modifier-switch" class="form-check-input" />
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: async function () {

                        const isModifierChecked = $('#modifier-switch').is(':checked');
                        const selectedValue = $('#option-select').val();
                        const selectedLookupItem = widgetLookup.allWidgets.find(widget => widget.widgetId == selectedValue);
                        const profileName = profileManager.getCurrentProfileName();
                        const type = $('#option-select option:selected').attr('data-type');
                        const imageLink = await profileManager.getImageLinkById(type, selectedValue);

                        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);

                        await modalProvider.handleModalSave(actionbar, actionbarIndex, slotIndex, type, actionIndex, selectedValue, selectedLookupItem, imageLink, isModifierChecked);

                    }
                }
            }
        }).on('shown.bs.modal', function () {
            toggleModifierSwitch();
        });
    }

    async handleModalSave(actionbar, actionbarIndex, slotIndex, type, actionIndex, selectedValue, selectedLookupItem, imageLink, modifier) {

        let profileName = profileManager.getCurrentProfileName();

        if (slotIndex == actionbar.length) {

            await modalProvider.addNewSlotToActionbar(actionbarIndex, slotIndex, type, actionIndex, selectedValue, selectedLookupItem, modifier);

        } else {

            var slot = profileManager.getActionbarSlot(profileName, actionbarIndex, slotIndex, actionIndex);

            if (slot.type == "CompoundItem") {

                if(type == "OrbItem") {
                    slot.actions.push({ widgetType: selectedValue, modifier: modifier, type: type });
                }else{
                    slot.actions.push({ widgetId: selectedValue, modifier: modifier, type: type });
                }

                await modalProvider.updateCompoundChildSlot(actionbarIndex, slotIndex, slot);

            } else {

                profileManager.updateSlotAction(actionbarIndex, slotIndex, selectedLookupItem, actionIndex, selectedValue, modifier)
                uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, `Toggle ${selectedLookupItem.name}`);
                uiManager.setSlotImage(actionbarIndex, slotIndex, actionIndex, imageLink);
                bootbox.hideAll();

            }
        }

    }

    async addNewSlotToActionbar(actionbarIndex, slotIndex, slotType, actionIndex = -1, actionId, slot, modifier) {
        var profileName = profileManager.getCurrentProfileName();
        profileManager.addItemToActionbar(profileName, slotType, actionbarIndex, slotIndex, -1, actionId, slot, modifier);
        var slot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex, actionIndex);
        var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, slot);
        uiManager.addNewSlot(actionbarIndex, slotHtml);
        bootbox.hideAll();
    }

    async updateCompoundChildSlot(actionbarIndex, slotIndex, slot) {
        let profileName = profileManager.getCurrentProfileName();
        let actionbar = profileManager.getActionbar(profileName, actionbarIndex);
        actionbar[slotIndex] = slot;
        profileManager.saveActionbar(profileName, actionbarIndex, actionbar);
        var totalActions = actionbar[slotIndex].actions.length - 1;
        var actionSlot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex, totalActions);
        var slotHtml = htmlTemplateProvider.getChildSlotTemplate(actionbarIndex, slotIndex, actionSlot);
        uiManager.addNewSlot(actionbarIndex, slotHtml, slotIndex);
        bootbox.hideAll();
    }

    showImportProfileModal() {
        bootbox.dialog({
            title: 'Import Data',
            message: `
            <div class="form-group">
                <label for="profile-name">Profile Name</label>
                <input type="text" id="profile-name" class="form-control" placeholder="Enter profile name">
            </div>
            <div class="form-group">
                <label for="json-data">JSON Data</label>
                <textarea id="json-data" class="form-control" rows="10" placeholder='Paste JSON data here'></textarea>
            </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: { label: "Save", className: 'btn-primary', callback: this.handleJsonImport() }
            }
        });
    }

    handleJsonImport() {
        return function () {
            const profileName = $('#profile-name').val().trim();
            var jsonData = $('#json-data').val().trim();
            profileManager.importProfile(profileName, jsonData);
            uiManager.loadProfileMenuData();
        };
    }

    renderPaginatedSearchResults(results, page, actionbarIndex, slotIndex, actionIndex) {

        const ITEMS_PER_PAGE = 10; // Number of items per page

        const resultsList = $('#resultsList');
        resultsList.empty(); // Clear previous results

        totalPages = Math.ceil(results.length / ITEMS_PER_PAGE); // Calculate total pages
        currentPage = page; // Set the current page

        // Get the results for the current page
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedResults = results.slice(start, end);

        if (paginatedResults.length > 0) {
            paginatedResults.forEach(item => {
                itemFetcher.fetchItemImage(item.id).then((image) => {
                    resultsList.append(`<li data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" data-action-index="${actionIndex}" data-item-id=${item.id} class="search-result-item list-group-item cursor-pointer"><img class="search-image" src="${image}"></img> ${item.name}</li>`);
                });
            });
        } else {
            resultsList.append('<li class="list-group-item text-muted">No results found</li>');
        }

        this.updatePaginationButtons();
    }

    updatePaginationButtons() {

        $('#paginationButtons').empty();

        const prevDisabled = currentPage == 1 ? 'disabled' : '';
        const nextDisabled = currentPage == totalPages ? 'disabled' : '';

        $('#paginationButtons').append(`
            <button class="btn btn-secondary me-2" id="prevPage" ${prevDisabled}>Previous</button>
            <button class="btn btn-secondary" id="nextPage" ${nextDisabled}>Next</button>
        `);

    }

    showKeybindModal(slotIndex) {

        bootbox.dialog({
            title: 'Set Keybind',
            message: `
                <div class="form-group">
                    <label for="keybind-input">Press a key to set the keybind</label>
                    <input type="text" id="keybind-input" class="form-control" readonly>
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: function () {
                        const keybind = $('#keybind-input').val();
                        if (keybind) {
                            const key = $('#keybind-input').attr('data-key');
                            const keyCode = $('#keybind-input').attr('data-keycode');
                            let keybindData = { key: slotIndex, keybind: `${keyCode}:0` };    
                            keybindManager.setSlotKeybind(profileManager.getCurrentProfileName(), slotIndex, keybindData);
                            uiManager.setSlotKeybind(slotIndex, key);
                        }
                    }
                }
            }
        });

        $(document).off('keydown').on('keydown', function (e) {
            const key = e.key.toUpperCase();
            const keyCode = e.keyCode;
            $('#keybind-input').attr('data-keycode', keyCode);
            $('#keybind-input').attr('data-key', key);
            $('#keybind-input').val(`${key} (KeyCode: ${keyCode})`);
        });

    }

}

var modalProvider = new ModalProvider();