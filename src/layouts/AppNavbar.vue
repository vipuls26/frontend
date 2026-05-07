<script setup>
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import DarkModeTheme from '@/components/baseui/DarkModeTheme.vue'
import { useAuthStore } from '@/stores/authStore'
import { confirmAction } from '@/utils/sweetAlert'

const router = useRouter()
const auth = useAuthStore()

const logout = async () => {
  const confirmed = await confirmAction({
    title: 'Logout?',
    text: 'You will need to sign in again to access your dashboard.',
    confirmButtonText: 'Logout',
    icon: 'warning',
    confirmButtonColor: '#dc2626',
  })

  if (!confirmed) {
    return
  }

  await auth.logout()
  toast.success('Logged out successfully', {
    id: 'logout-success',
  })
  router.push('/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-40 grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6 sm:py-4"
  >
    <div class="flex min-w-0 items-center gap-3">
      <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
        <i class="pi pi-briefcase" />
      </div>

      <div class="min-w-0">
        <h1 class="truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          Job Portal
        </h1>
        <p class="hidden text-xs capitalize text-slate-500 dark:text-slate-400 sm:block">
          {{ auth.role }} workspace
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
      <DarkModeTheme />

      <span
        class="hidden h-9 items-center rounded-full bg-blue-50 px-3 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 sm:inline-flex"
      >
        {{ auth.role }}
      </span>

      <button
        type="button"
        @click="logout"
        class="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 sm:px-4"
      >
        <span class="hidden sm:inline">Logout</span>
        <i class="pi pi-sign-out sm:hidden" />
      </button>
    </div>
  </header>
</template>
