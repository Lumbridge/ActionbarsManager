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
    
        if (!slotIndex || !slotIndex) {
            this.moveSlot(actionbar, oldIndex, newIndex);
            profileManager.saveActionbar(profileName, actionbarIndex, actionbar);
        } else {
            const actionbarSlot = actionbar[slotIndex];
            this.moveSlot(actionbarSlot.actions, oldIndex, newIndex);
            profileManager.saveActionbarSlot(profileName, actionbarIndex, slotIndex, actionbarSlot);
        }
    
        uiManager.refreshActionbar(actionbarIndex, profileName);
    }
    
    moveSlot(arr, fromIndex, toIndex) {
        const [movedItem] = arr.splice(fromIndex, 1); // Remove the item from the old index
        arr.splice(toIndex, 0, movedItem); // Insert the item at the new index
    }
    
}

var sortableManager = new SortableManager();