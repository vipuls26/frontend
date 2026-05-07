<script setup>
import { onMounted } from 'vue'

import { Toaster } from 'vue-sonner'

import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const authStore = useAuthStore()

onMounted(async () => {
  themeStore.initializeTheme()

  if (localStorage.getItem('token') && !authStore.tokenVerified) {
    await authStore.verifyToken()
  }
})
</script>

<template>
  <Toaster richColors closeButton position="top-center" />

  <router-view />
</template>
