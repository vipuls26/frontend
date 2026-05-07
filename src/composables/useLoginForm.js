import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/authStore'
import { formatErrorMessage } from '@/utils/apiResponse'
import { validateSchema } from '@/utils/yupValidation'
import { loginSchema } from '@/validations/authSchemas'

export function useLoginForm() {
  const router = useRouter()

  const auth = useAuthStore()

  const form = reactive({
    email: '',
    password: '',
  })

  const submit = async () => {
    try {
      auth.errors = {}

      const validation = await validateSchema(loginSchema, form)

      if (!validation.valid) {
        auth.errors = validation.errors
        toast.error('Please fix the highlighted fields', {
          id: 'login-validation-error',
        })
        return
      }

      await auth.login(form)

      toast.success(`Logged in as ${auth.role}`, {
        id: 'login-success',
      })

      router.push(auth.homeRoute)
    } catch (error) {
      toast.error(formatErrorMessage(error.message, 'Login failed'), {
        id: 'login-error',
      })
    }
  }

  return {
    form,
    submit,
    auth,
  }
}
