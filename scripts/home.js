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
        // Show the Bootbox modal with input fields for profile name and JSON data
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
                cancel: {
                    label: "Cancel",
                    className: 'btn-secondary'
                },
                save: {
                    label: "Save",
                    className: 'btn-primary',
                    callback: handleJsonImport()
                }
            }
        });
    });

    // Handle the profile menu item click event
    $(document).on("click", ".profile-menu-item", async function () {
        const profileName = $(this).attr('id');
        $('#profileDropdown').text(profileName);
        await loadActionbars(profileName);
    });

    $(document).on("click", ".CompoundItem", function (e) {

        let $element = $(e.target).closest('.CompoundItem');

        // if the actionbar slot details are already visible, hide them
        if ($element.next('.actionbar-slot-details').length > 0) {
            $element.next('.actionbar-slot-details').slideUp(function () {
                $element.next('.actionbar-slot-details').remove();
            });
            return;
        }

        let profileName = $element.attr('data-profile-name');
        let actionbarId = $element.attr('data-actionbar-id');
        let slotIndex = $element.attr('data-slot-index');

        // show a loader while fetching the actionbar slot details
        $element.find('.flavour-text').after('<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');

        // Fetch the actionbar slot
        profileManager.getActionbarSlot(profileName, actionbarId, slotIndex).then((actionbarSlot) => {

            // Collect all promises to fetch actions
            let promises = actionbarSlot.actions.map((action, actionIndex) =>
                profileManager.getActionbarSlot(profileName, actionbarId, slotIndex, actionIndex)
            );

            // Once all actions are fetched
            Promise.all(promises).then(actionsWithImages => {
                let actionbarSlotHtml = actionsWithImages.map(action => `
                    <div class="action-slot d-flex flex-column align-items-center justify-content-center mt-2 bg-dark-subtle sub-slot-container center-block border border-2 rounded py-2 cursor-pointer"
                        data-actionbar-index="${actionbarId}" 
                        data-slot-index="${slotIndex}"
                        data-action-index="${action.actionIndex}"
                        style="max-width:130px;">
                            <img src="${action.imageLink}" alt="Unknown Item (ID: ${action.itemId})">
                            <div>${action.flavourText}</div>
                    </div>
                `).join('');

                // Append the generated actionbar slots after the current element
                $element.after(`
                    <div class="actionbar-slot-details">
                        ${actionbarSlotHtml}
                    </div>
                `);

                // Remove the loader
                $element.find('.spinner-border').remove();

                // Slide down the actionbar slot details
                $element.next('.actionbar-slot-details').slideDown();

                // Initialize SortableJS for the new container
                initializeSortableContainer($element, profileName, actionbarId, slotIndex);
            });
        });
    });

});

function initializeSortableContainer($compoundSlot, profileName, actionbarId, slotIndex) {
    let sortableContainer = $compoundSlot.next('.actionbar-slot-details')[0];
    new Sortable(sortableContainer, {
        animation: 150,
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

    const imgHeight = 60;
    const slotWidth = 130;
    const slotHeight = 130;
    const spinnerSize = 3.5;

    // clear the actionbars container
    $('#actionbars-container').empty();

    // load actionbars
    var actionbars = profileManager.getActionbars(profileName);

    // loop through all actionbars
    for (var actionbarIndex in actionbars) {

        // get actionbar as a number starting at 1 for the sub-titles
        var titleNumber = parseInt(actionbarIndex) + 1;

        // add a title for each actionbar
        $('#actionbars-container').append(`<h5>Actionbar ${titleNumber}</h5>`);

        // add a row for each actionbar
        var actionbarRow = `<div class="row rounded border border-3 p-2 m-1 mb-3 bg-light-subtle actionbar-sortable" id="actionbar-${actionbarIndex}">`;

        // add the row to the actionbars container
        $('#actionbars-container').append(actionbarRow);

        // create placeholders for each slot with a greyed-out state
        for (var slotIndex in actionbars[actionbarIndex]) {
            var placeholderColumn = `
            <div class="col-auto my-2 my-xxl-0">
                <div class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container center-block border border-2 rounded p-2 cursor-not-allowed loading-slot" 
                     data-actionbar-index="${actionbarIndex}" 
                     data-slot-index="${slotIndex}" 
                     style="width: ${slotWidth}px; height: ${slotHeight}px; opacity: 0.5; pointer-events: none;">
                    <div class="spinner-border text-primary" role="status" style="width: ${spinnerSize}rem; height: ${spinnerSize}rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>`;
            $(`#actionbar-${actionbarIndex}`).append(placeholderColumn);
        }
    }

    $('#actionbars-container').removeClass('d-none');

    // Collect all promises for loading slots concurrently
    let promises = [];

    // asynchronously load and replace placeholders with actual actionbars
    for (let actionbarIndex in actionbars) {
        for (let slotIndex in actionbars[actionbarIndex]) {
            promises.push(
                profileManager.getActionbarSlot(profileName, actionbarIndex, slotIndex).then((actionbarSlot) => {
                    var slotColumn = `
                    <div data-profile-name="${profileName}" data-actionbar-id="${actionbarIndex}" data-slot-index="${slotIndex}" class="d-flex flex-column justify-content-center align-items-center bg-dark-subtle slot-container border border-2 rounded p-1 cursor-pointer ${actionbarSlot.type}" style="width: ${slotWidth}px; height: ${slotHeight}px;">
                        <img height="${imgHeight}" src="${actionbarSlot.imageLink}" alt="Unknown Item (ID: ${actionbarSlot.itemId})">
                        <div class="flavour-text text-center">${actionbarSlot.flavourText}</div>
                    </div>
                    `;

                    // Replace the correct placeholder using the data attributes
                    $(`.loading-slot[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).replaceWith(slotColumn);
                })
            );
        }
    }

    // Wait for all promises to resolve
    await Promise.all(promises);

    // After all slots are loaded, enable sorting and remove greyed-out effect
    $('.actionbar-sortable').each(function () {
        var actionbarIndex = $(this).attr('id').split('-')[1];
        $(this).find('.slot-container').css('opacity', '1').css('pointer-events', 'auto'); // Remove greyed-out state

        // Enable Sortable once the items are fully loaded
        new Sortable(this, {
            animation: 150,
            onEnd: function (evt) {
                handleSlotReorder(profileName, actionbarIndex, evt.oldIndex, evt.newIndex);
            }
        });
    });
}

function handleSlotReorder(profileName, actionbarIndex, oldIndex, newIndex) {
    
    const profileData = profileManager.getProfile(profileName);
    const actionbars = profileManager.getActionbars(profileName);

    // Reorder the slots in the actionbar
    const movedItem = actionbars[actionbarIndex].splice(oldIndex, 1)[0]; // Remove item from oldIndex
    actionbars[actionbarIndex].splice(newIndex, 0, movedItem); // Insert item at newIndex

    // add actionbars back into profileData
    profileData[1][0] = actionbars;

    // Save the updated profile data
    profileManager.saveProfile(profileName, profileData);

    // update parent slots indices
    var $parentSlots = $(`.actionbar-sortable#actionbar-${actionbarIndex} .slot-container`);
    for (let i = 0; i < $parentSlots.length; i++) {

        let $parentSlot = $parentSlots.eq(i);
        $parentSlot.attr('data-slot-index', i);

        // update the action index for all children
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

    // Reorder the actions in the slot
    const actionbarSlot = actionbars[actionbarIndex][slotIndex];
    const movedAction = actionbarSlot.actions.splice(oldIndex, 1)[0]; // Remove action from oldIndex
    actionbarSlot.actions.splice(newIndex, 0, movedAction); // Insert action at newIndex

    // add actionbarSlot back into actionbars
    actionbars[actionbarIndex][slotIndex] = actionbarSlot;

    // add actionbars back into profileData
    profileData[1][0] = actionbars;

    // Save the updated profile data
    profileManager.saveProfile(profileName, profileData);

    // update parent slots indices
    var $parentSlots = $(`.actionbar-sortable#actionbar-${actionbarIndex} .slot-container`);
    for (let i = 0; i < $parentSlots.length; i++) {

        let $parentSlot = $parentSlots.eq(i);
        $parentSlot.attr('data-slot-index', i);

        // update the action index for all children
        var $children = $parentSlots.eq(i).next('.actionbar-slot-details').find('.action-slot');
        for (let j = 0; j < $children.length; j++) {
            $children.eq(j).attr('data-slot-index', i);
            $children.eq(j).attr('data-action-index', j);
        }
        $parentSlot.find('img').attr('src', $children.first().find('img').attr('src'));
    }
}