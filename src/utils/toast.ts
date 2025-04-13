import withReactContent from "sweetalert2-react-content"
import SweetAlert, { SweetAlertIcon } from "sweetalert2"

export const showToast = (icon: SweetAlertIcon, title: string, duration?: number) => {
    const Swal = withReactContent(SweetAlert)
    Swal.fire({
        icon,
        title,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: duration || 3000,
    })
}