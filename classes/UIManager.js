class UIManager {

    setSlotAction(actionbarIndex, slotIndex, actionIndex, newAction) {
        if (actionIndex && actionIndex != -1) {
            $(`.sub-slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"][data-action-index="${actionIndex}"]`).find('.flavour-text').text(newAction);
        } else {
            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).find('.flavour-text').text(newAction);
        }
    }

    setSlotImage(actionbarIndex, slotIndex, actionIndex, newImageLink) {
        if (actionIndex && actionIndex != -1) {

            // if aciton index is 0 then set the parent slot image as well
            if (actionIndex == 0) {
                $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).find('.slot-image').attr('src', newImageLink);
            }

            $(`.sub-slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"][data-action-index="${actionIndex}"]`).find('.sub-slot-image').attr('src', newImageLink);

        } else {

            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).find('.slot-image').attr('src', newImageLink);

        }
    }

    addNewSlot(actionbarIndex, slotHtml, slotIndex) {
        if (slotIndex) {
            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"] ~ .actionbar-slot-details`).append(slotHtml);
        } else {
            $(`#actionbar-${actionbarIndex}`).append(slotHtml);
        }
    }

    removeSlot(actionbarIndex, slotIndex, actionIndex = -1) {
        if (actionIndex != -1) {
            $(`.sub-slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"][data-action-index="${actionIndex}"]`).remove();
        } else {
            $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).parent().remove();
        }
        this.refreshActionbar(actionbarIndex, $('#profileDropdown').text());
    }

    refreshActionbar(actionbarIndex, profileName) {

        var $parentSlots = $(`.actionbar-sortable#actionbar-${actionbarIndex} .slot-container`);

        for (let i = 0; i < $parentSlots.length; i++) {

            let $parentSlot = $parentSlots.eq(i);
            $parentSlot.attr('data-slot-index', i);

            var keyBind = keybindManager.getSlotKeybind(profileName, i);
            $parentSlot.find('.keybind').text(keyBind);

            var $children = $parentSlot.next('.actionbar-slot-details').find('.action-slot');
            for (let j = 0; j < $children.length; j++) {
                $children.eq(j).attr('data-slot-index', i);
                $children.eq(j).attr('data-action-index', j);
            }

            // Update the parent slot image to the first child image
            $parentSlot.find('img').attr('src', $children.first().find('img').attr('src'));
        }

    }

    updateActionbarSlots(actionbarIndex, profileName) {

        let promises = [];

        var actionbar = profileManager.getActionbar(profileName, actionbarIndex);
        var keyBinds = keybindManager.getKeybinds(profileName);
        var convertedKeyBinds = keyBinds.map(keyCode => keybindManager.convertKeyCode(keyCode));

        for (let slotIndex in actionbar) {
            promises.push(
                profileManager.getActionbarSlotWithApiDataAndImageLink(profileName, actionbarIndex, slotIndex).then((actionbarSlot) => {

                    let keybind = convertedKeyBinds[slotIndex];

                    if (!keybind) {
                        keybind = "no keybind";
                    }

                    var slotHtml = htmlTemplateProvider.getSlotTemplate(actionbarIndex, slotIndex, actionbarSlot);

                    const loadingSelector = `.loading-slot[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`;

                    if ($(loadingSelector).length) {
                        $(loadingSelector).replaceWith(slotHtml);
                    } else {
                        $(`.slot-container[data-actionbar-index="${actionbarIndex}"][data-slot-index="${slotIndex}"]`).parent().replaceWith(slotHtml);
                    }
                })
            );
        }
    }

    loadApiControls() {

        var apiUrlWithoutProxy = endpointManager.getCurrentEndpoint(true);

        $("#api-base-url").val(apiUrlWithoutProxy);

        $("#use-proxy").prop("checked", useProxy);

    }

    initTooltips() {

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

    }

    loadProfileMenuData() {

        const profileNames = profileManager.getProfileNames();
        const profileMenu = $('#profileDropdown ~ .dropdown-menu');

        profileMenu.empty();

        profileNames.forEach(profileName => {
            profileMenu.append(`<a id="${profileName}" class="dropdown-item profile-menu-item cursor-pointer">${profileName}</a>`);
        });

        $('#profileDropdown').text(`Select Profile (${profileNames.length})`);

        notificationManager.info(`Profile menu loaded with ${profileNames.length} profiles`);

    }

}

var uiManager = new UIManager();