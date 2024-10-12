class ModalProvider {

    showPromptModal(promptMessage, callback) {
        bootbox.prompt({
            title: promptMessage,
            callback: function (result) {
                if (result) {
                    callback(result);
                }
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
                                <label for="action-select">Select an action</label>
                                <select id="action-select" class="form-control">
                                    ${actions.map(action => `<option value="${action}">${action}</option>`).join('')}
                                </select>
                            </div>
                        `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: async function () {
                        const selectedAction = $('#action-select').val();

                        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);

                        if (!slotIndex || slotIndex == "undefined") {
                            slotIndex = actionbar.length;
                        }

                        if (slotIndex == actionbar.length) {

                            profileManager.addItemToActionbar(profileName, "ItemItem", actionbarIndex, slotIndex, -1, itemId, selectedAction);
                            var slot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex);
                            var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, slot);
                            uiManager.addNewSlot(actionbarIndex, slotHtml);
                            bootbox.hideAll();

                        } else {

                            var slot = actionbar[slotIndex];

                            if (slot.type == "CompoundItem") {
                                slot.actions.push({ action: selectedAction, itemId: itemId, modifier: true, type: "ItemItem" });
                                actionbar[slotIndex] = slot;
                                profileManager.saveActionbar(profileName, actionbarIndex, actionbar);
                                var actionIndex = actionbar[slotIndex].actions.length - 1;
                                var actionSlot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex, actionIndex);
                                var slotHtml = htmlTemplateProvider.getChildSlotTemplate(actionbarIndex, slotIndex, actionSlot);
                                uiManager.addNewSlot(actionbarIndex, slotHtml, slotIndex);
                                bootbox.hideAll();
                            } else {
                                profileManager.updateItemAction(actionbarIndex, slotIndex, selectedAction, actionIndex, itemId).then(() => {
                                    uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, selectedAction);
                                    uiManager.setSlotImage(actionbarIndex, slotIndex, actionIndex, imageLink);
                                    bootbox.hideAll();
                                });
                            }

                        }
                    }
                }
            }
        });

    }

    showAddNewSlotModal(actionbarIndex, slotIndex) {
        // show a context menu to select the type of slot to add: options are Item, Prayer, Spellbook and Compound
        bootbox.dialog({
            title: 'Add New Slot',
            message: `
                <div class="form-group">
                    <label for="slot-type-select">Select Slot Type</label>
                    <select id="slot-type-select" class="form-control">
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="ItemItem">Item</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="PrayerItem">Prayer</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="SpellbookItem">Spellbook</option>
                        <option data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" value="CompoundItem">Compound</option>
                    </select>
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Choose",
                    className: 'btn-primary',
                    callback: function () {

                        const selectedType = $('#slot-type-select').val();

                        if (selectedType == "ItemItem") {
                            modalProvider.showItemSearchModal(actionbarIndex, slotIndex);
                        } else if (selectedType == "PrayerItem") {
                            modalProvider.showPrayerSelectionModal(actionbarIndex, slotIndex);
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

    showPrayerSelectionModal(actionbarIndex, slotIndex, actionIndex = -1) {
        const normalPrayers = widgetLookup.normalPrayers;

        bootbox.dialog({
            title: 'Select Prayer',
            message: `
                <div class="form-group">
                    <label for="prayer-select">Select a prayer</label>
                    <select id="prayer-select" class="form-control">
                        ${normalPrayers.map(prayer => `<option value="${prayer.widgetId}">${prayer.name}</option>`).join('')}
                    </select>
                </div>
            `,
            buttons: {
                cancel: { label: "Cancel", className: 'btn-secondary' },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: async function () {

                        const selectedPrayerId = $('#prayer-select').val();
                        const selectedPrayer = normalPrayers.find(prayer => prayer.widgetId == selectedPrayerId);
                        const profileName = profileManager.getCurrentProfileName();
                        const imageLink = await profileManager.getImageLink("PrayerItem", {widgetId: selectedPrayerId});

                        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);

                        if (!slotIndex) {
                            slotIndex = actionbar.length;
                        }

                        if (slotIndex == actionbar.length) {

                            profileManager.addItemToActionbar(profileName, "PrayerItem", actionbarIndex, slotIndex, -1, selectedPrayerId, selectedPrayer);
                            var slot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex);
                            var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, slot);
                            uiManager.addNewSlot(actionbarIndex, slotHtml);
                            bootbox.hideAll();

                        } else {

                            var slot = actionbar[slotIndex];

                            if (slot.type == "CompoundItem") {
                                slot.actions.push({ widgetId: selectedPrayerId, modifier: true, type: "PrayerItem" });
                                actionbar[slotIndex] = slot;
                                profileManager.saveActionbar(profileName, actionbarIndex, actionbar);
                                var actionIndex = actionbar[slotIndex].actions.length - 1;
                                var actionSlot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex, actionIndex);
                                var slotHtml = htmlTemplateProvider.getChildSlotTemplate(actionbarIndex, slotIndex, actionSlot);
                                uiManager.addNewSlot(actionbarIndex, slotHtml, slotIndex);
                                bootbox.hideAll();
                            } else {
                                profileManager.updateItemAction(actionbarIndex, slotIndex, selectedPrayer, actionIndex, selectedPrayerId).then(() => {
                                    uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, `Toggle ${selectedPrayer.name}`);
                                    uiManager.setSlotImage(actionbarIndex, slotIndex, actionIndex, imageLink);
                                    bootbox.hideAll();
                                });
                            }

                        }

                    }
                }
            }
        });
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

}

var modalProvider = new ModalProvider();