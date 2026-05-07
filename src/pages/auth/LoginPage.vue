<script setup>
import AuthForm from '@/components/auth/AuthForm.vue'
import AuthSkeleton from '@/components/skeletons/AuthSkeleton.vue'
import { useLoginForm } from '@/composables/useLoginForm'
import { onMounted, ref } from 'vue'

const { form, submit, auth } = useLoginForm()

const loadingPage = ref(true)

onMounted(() => {
  setTimeout(() => {
    loadingPage.value = false
  }, 1500)
})

const fields = [
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
]
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-slate-100 px-4 py-8 dark:bg-slate-950">
    <div
      class="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900 md:grid-cols-[1fr_420px]"
    >
      <section class="hidden bg-slate-900 p-8 text-white md:flex md:flex-col md:justify-between">
        <div>
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-blue-600">
            <i class="pi pi-briefcase text-xl" />
          </div>

          <h1 class="mt-8 text-3xl font-bold">Job Portal</h1>
          <p class="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Manage candidate applications and recruiter hiring workflows from one focused workspace.
          </p>
        </div>

        <div class="grid gap-3 text-sm text-slate-300">
          <div class="flex items-center gap-3">
            <i class="pi pi-check-circle text-blue-400" />
            Candidate job tracking
          </div>
          <div class="flex items-center gap-3">
            <i class="pi pi-check-circle text-blue-400" />
            Recruiter company and job posting
          </div>
        </div>
      </section>

      <section class="p-6 sm:p-8">
        <AuthSkeleton v-if="loadingPage" :fields="2" />

        <div v-else>
          <p class="text-sm font-medium text-blue-600">Welcome back</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Login to continue</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Use your backend account credentials to open the right dashboard.
          </p>

          <div class="mt-6">
            <AuthForm
              :fields="fields"
              :form="form"
              :errors="auth.errors"
              :loading="auth.loading"
              button-text="Login"
              @submit="submit"
            />
          </div>

          <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            Don't have an account?

            <RouterLink
              :to="{ name: 'register' }"
              class="font-medium text-blue-600 transition hover:text-blue-800 dark:text-blue-400"
            >
              Register
            </RouterLink>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
