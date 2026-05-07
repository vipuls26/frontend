import { toast } from 'vue-sonner'

export const confirmAction = ({
  title,
  text,
  confirmButtonText = 'Confirm',
  id = `confirm-${Date.now()}`,
}) =>
  new Promise((resolve) => {
    let settled = false

    const finish = (confirmed) => {
      if (settled) {
        return
      }

      settled = true
      toast.dismiss(id)
      resolve(confirmed)
    }

    toast.warning(title, {
      id,
      description: text,
      duration: Infinity,
      dismissible: true,
      onDismiss: () => finish(false),
      action: {
        label: confirmButtonText,
        onClick: () => finish(true),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => finish(false),
      },
    })
  })
