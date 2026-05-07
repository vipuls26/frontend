<script setup>
import AuthForm from '@/components/auth/AuthForm.vue'
import AuthSkeleton from '@/components/skeletons/AuthSkeleton.vue'
import { useRegisterForm } from '@/composables/useRegisterForm'
import { onMounted, ref } from 'vue'

const { form, submit, auth } = useRegisterForm()

const loadingPage = ref(true)

onMounted(() => {
  setTimeout(() => {
    loadingPage.value = false
  }, 1500)
})

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
  {
    name: 'password_confirmation',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm password',
  },
]
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-slate-100 px-4 py-8 dark:bg-slate-950">
    <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 sm:p-8">
      <AuthSkeleton v-if="loadingPage" :fields="4" />

      <div v-else>
        <div class="mb-7">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
            <i class="pi pi-user-plus" />
          </div>

          <p class="mt-5 text-sm font-medium text-blue-600">Create account</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Start using Job Portal
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Register as a candidate or recruiter. Your role controls the dashboard you see.
          </p>
        </div>

        <AuthForm
          :fields="fields"
          :form="form"
          :errors="auth.errors"
          :loading="auth.loading"
          button-text="Register"
          @submit="submit"
        >
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Register As
            </label>

            <select v-model="form.role" class="app-field">
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
        </AuthForm>

        <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?

          <RouterLink
            :to="{ name: 'login' }"
            class="font-medium text-blue-600 transition hover:text-blue-800 dark:text-blue-400"
          >
            Login
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
