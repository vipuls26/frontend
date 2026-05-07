import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export const confirmAction = async ({
  title,
  text,
  confirmButtonText = 'Yes',
  icon = 'question',
  confirmButtonColor = '#2563eb',
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    confirmButtonColor,
    cancelButtonColor: '#64748b',
    reverseButtons: true,
  })

  return result.isConfirmed
}

export const showSuccessAlert = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'success',
    timer: 1600,
    showConfirmButton: false,
  })
