class ContextMenuProvider {

    constructor() {

    }

    showContextMenu(rightClickEvent, menuOptions) {

        // Remove existing context menu if present
        $('.custom-context-menu').remove();

        let menuOptionsHtml = '';

        // loop through the menu options and create the html
        menuOptions.forEach(option => {
            if(option.css){
                menuOptionsHtml += `<li class="list-group-item context-menu-item cursor-pointer" style="${option.css}">${option.text}</li>`;
                return;
            }
            menuOptionsHtml += `<li class="list-group-item context-menu-item cursor-pointer">${option.text}</li>`;
        });

        // Create the custom context menu
        const menuHtml = `
            <div class="custom-context-menu" style="position:absolute; top:${rightClickEvent.pageY}px; left:${rightClickEvent.pageX}px; z-index:1000;">
                <ul class="list-group">
                    ${menuOptions ? menuOptionsHtml : ''}
                </ul>
            </div>
        `;

        $('body').append(menuHtml);

        // Remove existing click event handlers
        $(".context-menu-item").off('click');

        // Handle context menu actions
        $('.context-menu-item').on('click', function () {

            const action = $(this).text();

            // get menuoption where name matches action
            const actionIndex = menuOptions.findIndex(option => option.text === action);

            // call the callback function
            menuOptions[actionIndex].callback();

            // Remove the context menu after action
            $('.custom-context-menu').remove();
        });

        // Close the context menu if clicked outside
        $(document).on('click', function () {
            $('.custom-context-menu').remove();
        });
    }

}

var contextMenuProvider = new ContextMenuProvider();