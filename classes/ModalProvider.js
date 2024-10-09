class ModalProvider {

    constructor() {
        
    }

    showPromptModal(promptMessage, callback) {
        bootbox.prompt({
            title: promptMessage,
            callback: function(result) {
                if (result !== null) {
                    callback(result);
                }
            }
        });
    }

    showActionSelectionModal(actions, actionbarIndex, slotIndex, itemId, actionIndex, imageLink) {

        let profileName = profileManager.getCurrentProfileName();

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

                        if (!slotIndex || slotIndex === "undefined"){
                            slotIndex = actionbar.length;
                        }

                        slotIndex = parseInt(slotIndex);
                        
                        if (slotIndex === actionbar.length) {
    
                            profileManager.addItemToActionbar(profileName, "ItemItem", actionbarIndex, slotIndex, -1, itemId, selectedAction);
                            var slot = await profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex);
                            var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, slot);
                            uiManager.addNewSlot(actionbarIndex, slotHtml);
    
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

                        if(selectedType === "ItemItem") {
                            modalProvider.showItemSearchModal(actionbarIndex, slotIndex);
                        } else {
                        
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
        const typingDelay = 300;         // Delay in milliseconds (0.75 seconds)
    
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
                        renderPaginatedSearchResults(searchResults, 1, actionbarIndex, slotIndex, actionIndex); // Render the first page of results
                    });
                }, typingDelay); // Wait 300ms before triggering the search
            } else {
                $('#resultsList').empty(); // Clear results if less than 3 characters are typed
                $('#paginationButtons').empty(); // Clear pagination buttons
            }
        });
    
        // Handle pagination button clicks
        $(document).on('click', '#prevPage', function () {
            if (currentPage > 1) {
                renderPaginatedSearchResults(searchResults, currentPage - 1, actionbarIndex, slotIndex, actionIndex);
            }
        });
    
        $(document).on('click', '#nextPage', function () {
            if (currentPage < totalPages) {
                renderPaginatedSearchResults(searchResults, currentPage + 1, actionbarIndex, slotIndex, actionIndex);
            }
        });
    
    }
    

    showImportProfileModal(){
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

}

var modalProvider = new ModalProvider();