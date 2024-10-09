class ModalProvider {

    constructor() {
        
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