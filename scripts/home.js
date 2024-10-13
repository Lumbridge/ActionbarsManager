let currentPage = 1;
let totalPages = 1;

$(async function () {

    uiManager.initTooltips();
    uiManager.loadApiControls();
    uiManager.loadProfileMenuData();

    $(document).on("click", "#set-endpoint-button", function () {
        var apiBaseUrlText = $("#api-base-url").val();
        useProxy = $("#use-proxy").is(":checked");
        storage.save('apiBaseUrl', apiBaseUrlText);
        storage.save('useProxy', useProxy);
        notificationManager.info(`API base URL updated to ${apiBaseUrlText} & use proxy set to ${useProxy}`);
    });

    $(document).on("click", "#import-data", function () {
        modalProvider.showImportProfileModal();
    });

    $(document).on("click", ".profile-menu-item", async function () {
        const profileName = $(this).attr('id');
        $('#profileDropdown').text(profileName);
        await loadActionbars();
    });

    $(document).on("contextmenu", ".PrayerItem", function (e) {
        
        e.preventDefault();

        const slotIndex = $(this).attr('data-slot-index');
        const actionbarIndex = $(this).attr('data-actionbar-index');
        const actionIndex = $(this).attr('data-action-index');

        let menuOptions = [{
                text: 'Edit',
                callback: function() { 
                    modalProvider.showPrayerSelectionModal(actionbarIndex, slotIndex, actionIndex);
                }
            }, {
                text: 'Delete',
                callback: confirmDeleteSlot(actionbarIndex, slotIndex, actionIndex),
                css: 'color:red;'
            }
        ]

        if(!actionIndex) {
            menuOptions.splice(1, 0, {
                text: 'Convert to compound',
                callback: function(){ 
                    convertToCompound(actionbarIndex, slotIndex);
                }
            });
        }

        contextMenuProvider.showContextMenu(e, menuOptions);
    });

    $(document).on("contextmenu", ".OrbItem", function (e) {
        
        e.preventDefault();

        const slotIndex = $(this).attr('data-slot-index');
        const actionbarIndex = $(this).attr('data-actionbar-index');
        const actionIndex = $(this).attr('data-action-index');

        let menuOptions = [{
                text: 'Edit',
                callback: function(){ 

                }
            }, {
                text: 'Delete',
                callback: function(){ 
                    profileManager.deleteActionbarSlot($('#profileDropdown').text(), actionbarIndex, slotIndex);
                    uiManager.removeSlot(actionbarIndex, slotIndex);
                },
                css: 'color:red;'
            }
        ]

        if(!actionIndex) {
            menuOptions.splice(1, 0, {
                text: 'Convert to compound',
                callback: function(){ 
                    convertToCompound(actionbarIndex, slotIndex);
                }
            });
        }

        contextMenuProvider.showContextMenu(e, menuOptions);
    });

    $(document).on("contextmenu", ".CompoundItem", function (e) {
        
        e.preventDefault();

        const slotIndex = $(this).attr('data-slot-index');
        const actionbarIndex = $(this).attr('data-actionbar-index');

        let menuOptions = [{
            text: 'Delete',
            callback: confirmDeleteSlot(actionbarIndex, slotIndex),
            css: 'color:red;'
        }, {
            text: 'Add slot',
            callback: function(){ 
                modalProvider.showAddNewSlotModal(actionbarIndex, slotIndex);
            }
        }]

        contextMenuProvider.showContextMenu(e, menuOptions);
    });

    $(document).on("contextmenu", ".ItemItem", function (e) {
        
        e.preventDefault();

        const slotIndex = $(this).attr('data-slot-index');
        const actionbarIndex = $(this).attr('data-actionbar-index');
        const actionIndex = $(this).attr('data-action-index');

        let menuOptions = [{
            text: 'Edit',
            callback: function(){modalProvider.showItemSearchModal(actionbarIndex, slotIndex, actionIndex) }
        }, 
        {
            text: 'Delete',
            callback: confirmDeleteSlot(actionbarIndex, slotIndex, actionIndex),
            css: 'color:red;border-bottom-width:5px;'
        }];

        if(!actionIndex) {
            menuOptions.splice(1, 0, {
                text: 'Convert to compound',
                callback: function(){ 
                    convertToCompound(actionbarIndex, slotIndex);
                }
            });
        }

        itemFetcher.fetchItemActions(actionbarIndex, slotIndex, actionIndex).then((actions) => {

            menuOptions.push({
                text: 'Use',
                callback: function() { 
                    const action = 'Use';
                    profileManager.updateSlotAction(actionbarIndex, slotIndex, action, actionIndex);
                    uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, action);
                }
            });

            actions.forEach(action => {
                menuOptions.push({
                    text: action,
                    callback: function() { 
                        profileManager.updateSlotAction(actionbarIndex, slotIndex, action, actionIndex);
                        uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, action);
                    }
                });
            });

            menuOptions.push({
                text: 'Custom Action',
                callback: function() { 
                    modalProvider.showPromptModal("Enter custom action (action must exist in the right click menu for the item when in inventory or equipped)", 
                    function(result) {
                        const action = result;
                        profileManager.updateSlotAction(actionbarIndex, slotIndex, action, actionIndex);
                        uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, action);
                    });
                },
                css: 'border-top-width:5px;'
            });
            
            contextMenuProvider.showContextMenu(e, menuOptions);
        });

    });

    $(document).on("click", ".CompoundItem", function (e) {

        let $compoundSlot = $(e.target).closest('.CompoundItem');
        let $compoundSlotChildrenContainer = $compoundSlot.next('.actionbar-slot-details');
        let elementDetailsDisplayed = $compoundSlotChildrenContainer.css('display') !== 'none';
    
        // If the slot details already exist and are hidden, slide them down
        if ($compoundSlotChildrenContainer.length > 0 && !elementDetailsDisplayed) {
            $compoundSlotChildrenContainer.slideDown();
            return;
        }
    
        // If the slot details already exist and are shown, toggle them with slideUp
        if ($compoundSlotChildrenContainer.length > 0 && elementDetailsDisplayed) {
            $compoundSlotChildrenContainer.slideUp();
            return;
        }
    
        let profileName = $('#profileDropdown').text();
        let actionbarIndex = $compoundSlot.attr('data-actionbar-index');
        let slotIndex = $compoundSlot.attr('data-slot-index');
    
        // Append a spinner while loading
        $compoundSlot.find('.keybind').after('<div class="spinner-border text-primary" role="status" style="width:15px; height:15px;"><span class="visually-hidden">Loading...</span></div>');
    
        // Placeholder HTML structure for slots (before data is loaded)
        let actionbarSlot = profileManager.getActionbarSlot(profileName, actionbarIndex, slotIndex);
        let actionbarSlotHtml = '';
        for (let actionIndex = 0; actionIndex < actionbarSlot.actions.length; actionIndex++) {
            let placeholderColumn = htmlTemplateProvider.getSlotLoadingTemplate(actionbarIndex, actionIndex); // Placeholder template
            actionbarSlotHtml += placeholderColumn;
        }
    
        // Append placeholders to DOM
        $compoundSlot.after(`<div class="actionbar-slot-details">${actionbarSlotHtml}</div>`);
    
        // Remove the spinner after adding placeholders
        $compoundSlot.find('.spinner-border').remove();
    
        let promises = [];
        for (let actionIndex = 0; actionIndex < actionbarSlot.actions.length; actionIndex++) {
            promises.push(
                profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex, actionIndex).then((actionWithImage) => {
                    let actionHtml = htmlTemplateProvider.getChildSlotTemplate(actionbarIndex, slotIndex, actionWithImage);
                    $(`.loading-slot[data-actionbar-index="${actionbarIndex}"][data-slot-index="${actionIndex}"]`).replaceWith(actionHtml);
                })
            );
        }
    
        // Once all promises are resolved, show the content with a slide-down animation
        Promise.all(promises).then(() => {
            $compoundSlot.next('.actionbar-slot-details').slideDown();
            let sortableContainer = $compoundSlot.next('.actionbar-slot-details')[0];
            sortableManager.initializeSortableContainer(sortableContainer, actionbarIndex, slotIndex);
        });
    });    

    $(document).on("click", "#export-button", function () {
        const profileName = $('#profileDropdown').text();
        let json = profileManager.exportProfile(profileName);
        bootbox.alert(`
            <h5 class="mb-4">To import this into the Actionbars plugin you can either shift & right click an existing actionbar slot or go got the Actionbar plugin settings > infoboxes section > import setup.</h5>
            <textarea class="form-control" rows="20">${json}</textarea>`);
    });

    $(document).on("click", ".search-result-item", function () {

        const actionbarIndex = $(this).attr('data-actionbar-index');
        const slotIndex = $(this).attr('data-slot-index');
        const actionIndex = $(this).attr('data-action-index');
        const itemId = $(this).attr('data-item-id');
        const imageLink = $(this).find('.search-image').attr('src');

        itemFetcher.fetchItemActionsById(itemId).then((actions) => {

            if (actions.length == 1) {

                profileManager.updateSlotAction(actionbarIndex, slotIndex, actions[0], actionIndex)
                uiManager.setSlotAction(actionbarIndex, slotIndex, actionIndex, actions[0]);
                uiManager.setSlotImage(actionbarIndex, slotIndex, imageLink);

            } else {

                modalProvider.showActionSelectionModal(actions, actionbarIndex, slotIndex, itemId, actionIndex, imageLink);

            }
        });
    });

    $(document).on("click", ".add-new-slot", function () {

        var actionbarIndex = $(this).attr('data-actionbar-index');
        var slotIndex = $(this).attr('data-slot-index');

        modalProvider.showAddNewSlotModal(actionbarIndex, slotIndex);
    });

    $(document).on("click", "#add-actionbar-button", function () {   
        var profileName = $('#profileDropdown').text();
        profileManager.addEmptyActionbar(profileName);
        loadActionbars();
    });

    $(document).on("click", ".delete-actionbar", function () {
        var actionbarIndex = $(this).attr('data-actionbar-index');
        var profileName = $('#profileDropdown').text();
        
        bootbox.confirm({
            title: `Delete actionbar ${parseInt(actionbarIndex) + 1}`,
            message: "Are you sure you want to delete this actionbar?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-danger'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-secondary'
                }
            },
            callback: function (result) {
                if (result) {
                    profileManager.deleteActionbar(profileName, actionbarIndex);
                    loadActionbars();
                }
            }
        });
    });

});

function convertToCompound(actionbarIndex, slotIndex) {
    var profileName = $('#profileDropdown').text();
    var actionbarSlot = profileManager.getActionbarSlot(profileName, actionbarIndex, slotIndex);
    var actions = [actionbarSlot];
    var compoundTemplate = jsonTemplateProvider.getCompoundTemplate();
    var newSlot = JSON.parse(compoundTemplate);
    newSlot.actions = actions;
    profileManager.saveActionbarSlot(profileName, actionbarIndex, slotIndex, newSlot);
    uiManager.updateActionbarSlots(actionbarIndex, profileName);
}

function confirmDeleteSlot(actionbarIndex, slotIndex, actionIndex = -1) {
    return function () {
        bootbox.confirm({
            title: "Delete Slot",
            message: "Are you sure you want to delete this slot?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-danger'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-secondary'
                }
            },
            callback: function (result) {
                if (result) {
                    profileManager.deleteActionbarSlot($('#profileDropdown').text(), actionbarIndex, slotIndex, actionIndex);
                    uiManager.removeSlot(actionbarIndex, slotIndex, actionIndex);
                }
            }
        });
    };
}

async function loadActionbars() {

    let profileName = profileManager.getCurrentProfileName();

    $('#actionbars-container').empty();

    var actionbars = profileManager.getActionbars(profileName);

    for (var actionbarIndex in actionbars) {

        var titleNumber = parseInt(actionbarIndex) + 1;

        $('#actionbars-container').append(`<h5>Actionbar ${titleNumber} 
            <button class="btn btn-sm btn-primary add-new-slot" data-actionbar-index="${actionbarIndex}"><i class="fa fa-plus"></i> Add new slot</button> 
            <button class="btn btn-sm btn-danger delete-actionbar" data-actionbar-index="${actionbarIndex}"><i class="fa fa-trash-can"></i></button> 
            </h5>`);

        var actionbarRow = `<div class="row rounded border border-3 p-2 m-1 mb-3 bg-light-subtle actionbar-sortable" id="actionbar-${actionbarIndex}">`;

        $('#actionbars-container').append(actionbarRow);

        for (var slotIndex in actionbars[actionbarIndex]) {
            
            var placeholderColumn = htmlTemplateProvider.getSlotLoadingTemplate(actionbarIndex, slotIndex);

            $(`#actionbar-${actionbarIndex}`).append(placeholderColumn);
        }
    }

    $('#actionbars-container').removeClass('d-none');

    let promises = [];

    for (let actionbarIndex in actionbars) {
        uiManager.updateActionbarSlots(actionbarIndex, profileName);
    }

    await Promise.all(promises);

    $('.actionbar-sortable').each(function () {
        var actionbarIndex = $(this).attr('id').split('-')[1];
        sortableManager.initializeSortableContainer(this, actionbarIndex);
    });
}