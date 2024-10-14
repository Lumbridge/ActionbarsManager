
class NotificationManager {

    constructor() {

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "2500",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

    }

    success(message, title = 'Success') {
        toastr.success(message, title);
    }

    info(message, title = 'Info') {
        toastr.info(message, title);
    }

    warning(message, title = 'Warning') {
        toastr.warning(message, title);
    }

    error(message, title = 'Error') {
        toastr.error(message, title);
    }

    configure(options) {
        toastr.options = { ...toastr.options, ...options };
    }
}

const notificationManager = new NotificationManager();