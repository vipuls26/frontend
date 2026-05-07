<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import DarkModeTheme from '@/components/baseui/DarkModeTheme.vue'
import { useAuthStore } from '@/stores/authStore'
import { confirmAction } from '@/utils/confirmToast'

const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)

const initials = computed(() =>
  (auth.user?.name || auth.role || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(''),
)

const closeMenu = () => {
  menuOpen.value = false
}

const goToProfile = () => {
  closeMenu()
  router.push('/profile')
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

window.addEventListener('keydown', handleEscape)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})

const logout = async () => {
  closeMenu()

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

      <div class="relative">
        <button
          type="button"
          @click="menuOpen = !menuOpen"
          class="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
        >
          <span
            class="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white"
          >
            {{ initials }}
          </span>

          <span class="hidden max-w-28 truncate sm:inline">
            {{ auth.user?.name || auth.role }}
          </span>

          <i class="pi pi-chevron-down text-xs" />
        </button>

        <div
          v-if="menuOpen"
          class="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          role="menu"
        >
          <div class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {{ auth.user?.name || 'Profile' }}
            </p>
            <p class="truncate text-xs capitalize text-slate-500 dark:text-slate-400">
              {{ auth.role }} workspace
            </p>
          </div>

          <button
            type="button"
            @click="goToProfile"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            role="menuitem"
          >
            <i class="pi pi-user-edit text-slate-500" />
            Edit profile
          </button>

          <button
            type="button"
            @click="goToProfile"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            role="menuitem"
          >
            <i class="pi pi-lock text-slate-500" />
            Change password
          </button>

          <button
            type="button"
            @click="logout"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
            role="menuitem"
          >
            <i class="pi pi-sign-out" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
