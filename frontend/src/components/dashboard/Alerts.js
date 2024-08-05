import Swal from 'sweetalert2'

export function sweetToast(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#1E1E1E",
        color: "white",
        
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: title,
    });
}

export function sweetAlert(title, text, icon, iconToast, toastText) {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: "#1E1E1E",
            cancelButtonColor: "#DF3562",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                sweetToast(iconToast, toastText)
                resolve(result);
            }
        });
    });
}