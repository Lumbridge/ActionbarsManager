class SortableManager {

    initializeSortableContainer(sortableContainer, actionbarIndex, slotIndex) {
        new Sortable(sortableContainer, {
            animation: 150,
            filter: ".add-new-slot",
            onEnd: function (evt) {
                sortableManager.handleSlotReorder(evt.oldIndex, evt.newIndex, actionbarIndex, slotIndex);
            }
        });
    }

    handleSlotReorder(oldIndex, newIndex, actionbarIndex, slotIndex) {
        const profileName = profileManager.getCurrentProfileName();
        const actionbar = profileManager.getActionbar(profileName, actionbarIndex);
    
        if (slotIndex === undefined || slotIndex === null) {
            // Move actionbar items when slotIndex is not provided
            this.moveItems(actionbar, oldIndex, newIndex);
            profileManager.saveActionbar(profileName, actionbarIndex, actionbar);
        } else {
            // Move actionbarSlot actions when slotIndex is provided
            const actionbarSlot = actionbar[slotIndex];
            this.moveItems(actionbarSlot.actions, oldIndex, newIndex);
            profileManager.saveActionbarSlot(profileName, actionbarIndex, slotIndex, actionbarSlot);
        }
    
        uiManager.refreshActionbar(actionbarIndex, profileName);
    }
    
    moveItems(arr, fromIndex, toIndex) {
        const [movedItem] = arr.splice(fromIndex, 1); // Remove the item from the old index
        arr.splice(toIndex, 0, movedItem); // Insert the item at the new index
    }
    
}

var sortableManager = new SortableManager();