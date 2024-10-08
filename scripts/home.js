let currentPage = 1;
let totalPages = 1;

$(async function () {

    initTooltips();
    loadApiControls();
    loadProfileMenuData();

    // Handle the set endpoint button click event
    $(document).on("click", "#set-endpoint-button", function () {
        var apiBaseUrlText = $("#api-base-url").val();
        useProxy = $("#use-proxy").is(":checked");
        storage.save('apiBaseUrl', apiBaseUrlText);
        storage.save('useProxy', useProxy);
        notificationManager.info(`API base URL updated to ${apiBaseUrlText} & use proxy set to ${useProxy}`);
    });

    // Handle the import data button click event
    $(document).on("click", "#import-data", function () {
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
                save: { label: "Save", className: 'btn-primary', callback: handleJsonImport() }
            }
        });
    });

    // Handle the profile menu item click event
    $(document).on("click", ".profile-menu-item", async function () {
        const profileName = $(this).attr('id');
        $('#profileDropdown').text(profileName);
        await loadActionbars(profileName);
    });

    $(document).on("contextmenu", ".CompoundItem", function (e) {
        e.preventDefault(); // Prevent the default context menu from appearing

        const slotIndex = $(this).attr('data-slot-index');
        const actionbarIndex = $(this).attr('data-actionbar-index');

        // Create a custom context menu (e.g., for editing, deleting items)
        showContextMenu(e, actionbarIndex, slotIndex);
    });

    $(document).on("contextmenu", ".ItemItem", function (e) {
        e.preventDefault(); // Prevent the default context menu from appearing

        const slotIndex = $(this).attr('data-slot-index');
        const actionbarIndex = $(this).attr('data-actionbar-index');
        const profileName = $('#profileDropdown').text();
        const actionIndex = $(this).attr('data-action-index');

        itemFetcher.fetchItemActions(profileName, actionbarIndex, slotIndex, actionIndex).then((actions) => {
            showContextMenu(e, actionbarIndex, slotIndex, actions, actionIndex);
        });

    });

    $(document).on("click", ".CompoundItem", function (e) {
        let $element = $(e.target).closest('.CompoundItem');

        if ($element.next('.actionbar-slot-details').length > 0) {
            $element.next('.actionbar-slot-details').slideUp(function () {
                $element.next('.actionbar-slot-details').remove();
            });
            return;
        }

        let profileName = $element.attr('data-profile-name');
        let actionbarId = $element.attr('data-actionbar-index');
        let slotIndex = $element.attr('data-slot-index');

        $element.find('.keybind').after('<div class="spinner-border text-primary" role="status" style="width:15px; height:15px;"><span class="visually-hidden">Loading...</span></div>');

        profileManager.getActionbarSlot(profileName, actionbarId, slotIndex).then((actionbarSlot) => {
            let promises = actionbarSlot.actions.map((action, actionIndex) =>
                profileManager.getActionbarSlot(profileName, actionbarId, slotIndex, actionIndex)
            );

            Promise.all(promises).then(actionsWithImages => {
                let actionbarSlotHtml = actionsWithImages.map(action => `
                    <div class="action-slot d-flex flex-column align-items-center justify-content-center mt-2 bg-dark-subtle ${action.type} sub-slot-container border border-2 rounded py-2 cursor-pointer"
                        data-actionbar-index="${actionbarId}" 
                        data-slot-index="${slotIndex}"
                        data-action-index="${action.actionIndex}">
                            <img class="slot-image" src="${action.imageLink}" alt="Item #${action.itemId}">
                            <div class="flavour-text">${action.flavourText}</div>
                    </div>
                `).join('');

                $element.after(`<div class="actionbar-slot-details">${actionbarSlotHtml}</div>`);
                $element.find('.spinner-border').remove();
                $element.next('.actionbar-slot-details').slideDown();
                initializeSortableContainer($element, profileName, actionbarId, slotIndex);
            });
        });
    });

    $(document).on("click", "#export-button", function () {
        const profileName = $(this).attr('data-profile-name');
        let json = profileManager.exportProfile(profileName);
        bootbox.alert(`<textarea class="form-control" rows="20">${json}</textarea>`);
    });

    $(document).on("click", ".search-result-item", function () {

        const profileName = $('#profileDropdown').text();
        const actionbarIndex = $(this).attr('data-actionbar-index');
        const slotIndex = $(this).attr('data-slot-index');
        const actionIndex = $(this).attr('data-action-index');
        const itemId = $(this).attr('data-item-id');
        const imageLink = $(this).find('.search-image').attr('src');

        itemFetcher.fetchItemActionsById(itemId).then((actions) => {

            if (actions.length === 1) {

                profileManager.updateItemAction(profileName, actionbarIndex, slotIndex, actions[0], actionIndex).then(() => {
                    uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, actions[0]);
                    uiManager.setSlotImage(actionbarIndex, slotIndex, imageLink);
                });

            } else {

                showActionSelectionDialog(actions, profileName, actionbarIndex, slotIndex, itemId, actionIndex, imageLink);

            }
        });
    });

    $(document).on("click", ".add-new-slot", function () {

        var actionbarIndex = $(this).attr('data-actionbar-index');
        var slotIndex = $(this).attr('data-slot-index');

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

                        const profileName = $('#profileDropdown').text();
                        const selectedType = $('#slot-type-select').val();

                        if(selectedType === "ItemItem") {
                            showItemSearchModal(actionbarIndex, slotIndex);
                        } else {
                        
                        }
                    }
                }
            }
        });

    });
});

function showActionSelectionDialog(actions, profileName, actionbarIndex, slotIndex, itemId, actionIndex, imageLink) {
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
                callback: function () {
                    const selectedAction = $('#action-select').val();

                    var actionbar = profileManager.getActionbar(profileName, actionbarIndex);
                    slotIndex = parseInt(slotIndex);
                    
                    if (slotIndex === actionbar.length) {

                        profileManager.addItemToActionbar(profileName, "ItemItem", actionbarIndex, slotIndex, -1, itemId, selectedAction);
                        var slot = profileManager.getActionbarSlot(profileName, actionbarIndex, slotIndex);
                        uiManager.addNewSlot(actionbarIndex, slotIndex, slot);

                    } else {

                        profileManager.updateItemAction(profileName, actionbarIndex, slotIndex, selectedAction, actionIndex, itemId).then(() => {
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

function showContextMenu(event, actionbarIndex, slotIndex, inventoryActions = null, actionIndex = -1) {
    // Remove existing context menu if present
    $('.custom-context-menu').remove();

    let actionHtml = '';

    if (inventoryActions) {
        actionHtml = inventoryActions.map((action) => `
            <li class="list-group-item context-menu-item cursor-pointer" data-action="change-action" data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" data-action-index="${actionIndex}">${action}</li>
        `).join('');
    }

    // Create the custom context menu
    const menuHtml = `
    <div class="custom-context-menu" style="position:absolute; top:${event.pageY}px; left:${event.pageX}px; z-index:1000;">
        <ul class="list-group">
            <li class="list-group-item context-menu-item cursor-pointer" data-action="edit" data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" data-action-index="${actionIndex}">Edit Item</li>
            <li class="list-group-item list-group-item-danger context-menu-item cursor-pointer" data-action="delete" data-actionbar-index="${actionbarIndex}" data-slot-index="${slotIndex}" data-action-index="${actionIndex}">Delete Item</li>
            ${inventoryActions ? actionHtml : ''}
        </ul>
    </div>
    `;

    $('body').append(menuHtml);

    // Handle context menu actions
    $('.context-menu-item').on('click', function () {
        const action = $(this).attr('data-action');
        const actionbarIndex = $(this).attr('data-actionbar-index');
        const slotIndex = $(this).attr('data-slot-index');
        const actionIndex = $(this).attr('data-action-index');

        if (action === 'edit') {
            showItemSearchModal(actionbarIndex, slotIndex, actionIndex);
        } else if (action === 'delete') {
            deleteItem(actionbarIndex, slotIndex);
        } else if (action === 'change-action') {
            const newAction = $(this).text();
            const profileName = $('#profileDropdown').text();
            profileManager.updateItemAction(profileName, actionbarIndex, slotIndex, newAction, actionIndex).then(() => {
                uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, newAction);
            });
        }

        // Remove the context menu after action
        $('.custom-context-menu').remove();
    });

    // Close the context menu if clicked outside
    $(document).on('click', function () {
        $('.custom-context-menu').remove();
    });
}

function showItemSearchModal(actionbarIndex, slotIndex, actionIndex = -1) {

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

// Function to render paginated results
function renderPaginatedSearchResults(results, page, actionbarIndex, slotIndex, actionIndex) {

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

    // Update pagination buttons
    updatePaginationButtons();
}

// Function to update pagination buttons
function updatePaginationButtons() {
    $('#paginationButtons').empty(); // Clear previous buttons

    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';

    $('#paginationButtons').append(`
        <button class="btn btn-secondary me-2" id="prevPage" ${prevDisabled}>Previous</button>
        <button class="btn btn-secondary" id="nextPage" ${nextDisabled}>Next</button>
    `);
}

function deleteItem(actionbarIndex, slotIndex) {
    // Logic to delete item from the slot
    alert(`Delete action triggered for actionbar: ${actionbarIndex}, slot: ${slotIndex}`);
}

function initializeSortableContainer($compoundSlot, profileName, actionbarId, slotIndex) {
    let sortableContainer = $compoundSlot.next('.actionbar-slot-details')[0];
    new Sortable(sortableContainer, {
        animation: 150,
        filter: ".add-new-slot",
        onEnd: function (evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            slotIndex = evt.item.getAttribute('data-slot-index');
            handleSlotActionReorder(profileName, actionbarId, slotIndex, oldIndex, newIndex);
        }
    });
}

function handleJsonImport() {
    return function () {
        const profileName = $('#profile-name').val().trim();
        var jsonData = $('#json-data').val().trim();
        profileManager.importProfile(profileName, jsonData);
    };
}

function loadApiControls() {
    var apiUrlWithoutProxy = endpointManager.getCurrentEndpoint(stripProxy = true);
    $("#api-base-url").val(apiUrlWithoutProxy);
    $("#use-proxy").prop("checked", useProxy);
}

function initTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function loadProfileMenuData() {
    const profileNames = profileManager.getProfileNames();
    const profileMenu = $('#profileDropdown ~ .dropdown-menu');
    profileMenu.empty();
    profileNames.forEach(profileName => {
        profileMenu.append(`<a id="${profileName}" class="dropdown-item profile-menu-item cursor-pointer">${profileName}</a>`);
    });
    $('#profileDropdown').text(`Select Profile (${profileNames.length})`);
    notificationManager.info(`Profile menu loaded with ${profileNames.length} profiles`);
}

async function loadActionbars(profileName) {

    // clear the actionbars container
    $('#actionbars-container').empty();

    // load actionbars
    var actionbars = profileManager.getActionbars(profileName);

    var keyBinds = keybindManager.getKeybinds(profileName);

    var keyBindsConverted = keyBinds.map(keyCode => keybindManager.convertKeyCode(keyCode));

    // loop through all actionbars
    for (var actionbarIndex in actionbars) {

        var titleNumber = parseInt(actionbarIndex) + 1;

        $('#actionbars-container').append(`<h5>Actionbar ${titleNumber}</h5>`);

        var actionbarRow = `<div class="row rounded border border-3 p-2 m-1 mb-3 bg-light-subtle actionbar-sortable" id="actionbar-${actionbarIndex}">`;

        $('#actionbars-container').append(actionbarRow);

        for (var slotIndex in actionbars[actionbarIndex]) {
            
            var placeholderColumn = templateProvider.getSlotLoadingTemplate(actionbarIndex, slotIndex);

            $(`#actionbar-${actionbarIndex}`).append(placeholderColumn);
        }
    }

    $('#actionbars-container').removeClass('d-none');

    let promises = [];

    for (let actionbarIndex in actionbars) {
        for (let slotIndex in actionbars[actionbarIndex]) {
            promises.push(
                profileManager.getActionbarSlot(profileName, actionbarIndex, slotIndex).then((actionbarSlot) => {
                    
                    let keybind = keyBindsConverted[slotIndex];

                    if(keybind === undefined){
                        keybind = "no keybind";
                    }

                    var slotColumn = templateProvider.getSlotTemplate(actionbarIndex, slotIndex, actionbarSlot, keybind, profileName);

                    $(`.loading-slot[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).replaceWith(slotColumn);
                })
            );
        }

        var addNewItemSlot = templateProvider.getNewSlotTemplate(actionbarIndex, actionbars[actionbarIndex].length);

        $(`#actionbar-${actionbarIndex}`).append(addNewItemSlot);
    }

    await Promise.all(promises);

    $('.actionbar-sortable').each(function () {
        var actionbarIndex = $(this).attr('id').split('-')[1];
        $(this).find('.slot-container').css('opacity', '1').css('pointer-events', 'auto');

        new Sortable(this, {
            animation: 150,
            filter: ".add-new-slot",
            onEnd: function (evt) {
                handleSlotReorder(profileName, actionbarIndex, evt.oldIndex, evt.newIndex);
            }
        });
    });

    loadExportButton($('#profileDropdown').text());
}

function handleSlotReorder(profileName, actionbarIndex, oldIndex, newIndex) {

    const profileData = profileManager.getProfile(profileName);
    const actionbars = profileManager.getActionbars(profileName);

    const movedItem = actionbars[actionbarIndex].splice(oldIndex, 1)[0];
    actionbars[actionbarIndex].splice(newIndex, 0, movedItem);

    profileData[1][0] = actionbars;

    profileManager.saveProfile(profileName, profileData);

    var $parentSlots = $(`.actionbar-sortable#actionbar-${actionbarIndex} .slot-container`);
    for (let i = 0; i < $parentSlots.length; i++) {

        let $parentSlot = $parentSlots.eq(i);
        $parentSlot.attr('data-slot-index', i);

        var keyBind = keybindManager.getSlotKeybind(profileName, i);
        $parentSlot.find('.keybind').text(keyBind);

        var $children = $parentSlots.eq(i).next('.actionbar-slot-details').find('.action-slot');
        for (let j = 0; j < $children.length; j++) {
            $children.eq(j).attr('data-slot-index', i);
            $children.eq(j).attr('data-action-index', j);
        }
        $parentSlot.find('img').attr('src', $children.first().find('img').attr('src'));
    }
}

function handleSlotActionReorder(profileName, actionbarIndex, slotIndex, oldIndex, newIndex) {

    const profileData = profileManager.getProfile(profileName);
    const actionbars = profileManager.getActionbars(profileName);

    const actionbarSlot = actionbars[actionbarIndex][slotIndex];
    const movedAction = actionbarSlot.actions.splice(oldIndex, 1)[0];
    actionbarSlot.actions.splice(newIndex, 0, movedAction);

    actionbars[actionbarIndex][slotIndex] = actionbarSlot;

    profileData[1][0] = actionbars;

    profileManager.saveProfile(profileName, profileData);

    var $parentSlots = $(`.actionbar-sortable#actionbar-${actionbarIndex} .slot-container`);
    for (let i = 0; i < $parentSlots.length; i++) {

        let $parentSlot = $parentSlots.eq(i);
        $parentSlot.attr('data-slot-index', i);

        var $children = $parentSlots.eq(i).next('.actionbar-slot-details').find('.action-slot');
        for (let j = 0; j < $children.length; j++) {
            $children.eq(j).attr('data-slot-index', i);
            $children.eq(j).attr('data-action-index', j);
        }
        $parentSlot.find('img').attr('src', $children.first().find('img').attr('src'));
    }
}

function loadExportButton(profileName) {
    $('#export-button-container').empty();
    $('#export-button-container').append(`
        <button class="btn btn-primary" id="export-button" data-profile-name="${profileName}">Export</button>
    `);
}