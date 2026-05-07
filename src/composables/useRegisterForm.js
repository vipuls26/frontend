import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/authStore'
import { formatErrorMessage } from '@/utils/apiResponse'
import { validateSchema } from '@/utils/yupValidation'
import { registerSchema } from '@/validations/authSchemas'

export function useRegisterForm() {
  const router = useRouter()
  const auth = useAuthStore()

  const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'candidate',
  })

  const submit = async () => {
    try {
      auth.errors = {}

      const validation = await validateSchema(registerSchema, form)

      if (!validation.valid) {
        auth.errors = validation.errors
        toast.error('Please fix the highlighted fields', {
          id: 'register-validation-error',
        })
        return
      }

      await auth.register(form)

      toast.success(`Registered as ${auth.role}`, {
        id: 'register-success',
      })

      router.push(auth.homeRoute)
    } catch (error) {
      toast.error(formatErrorMessage(error.message, 'Registration failed'), {
        id: 'register-error',
      })
    }
  }

  return {
    form,
    submit,
    auth,
  }
}
