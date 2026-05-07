<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const success = ref(false)
const message = ref('Verifying your email...')

const destination = computed(() => (auth.isAuthenticated ? auth.homeRoute : '/login'))
const id = computed(() => route.params.id || route.query.id)
const hash = computed(() => route.params.hash || route.query.hash)
const signedParams = computed(() => ({
  // Laravel signed URLs must receive id/hash only in the path, not duplicated here.
  expires: route.query.expires,
  signature: route.query.signature,
}))

onMounted(async () => {
  if (!id.value || !hash.value || !signedParams.value.expires || !signedParams.value.signature) {
    message.value = 'Invalid verification link.'
    loading.value = false
    return
  }

  try {
    message.value = await auth.verifyEmail(id.value, hash.value, signedParams.value)
    success.value = true

    setTimeout(() => {
      router.push(destination.value)
    }, 1200)
  } catch (error) {
    message.value = error.message || 'Unable to verify this email link.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-slate-100 px-4 py-8 dark:bg-slate-950">
    <section
      class="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-900 sm:p-8"
    >
      <div
        class="mx-auto grid h-12 w-12 place-items-center rounded-full"
        :class="
          success
            ? 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-300'
            : loading
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300'
              : 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300'
        "
      >
        <i v-if="success" class="pi pi-check" />
        <i v-else-if="loading" class="pi pi-spin pi-spinner" />
        <i v-else class="pi pi-times" />
      </div>

      <h1 class="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
        {{ success ? 'Email verified' : loading ? 'Verifying email' : 'Verification failed' }}
      </h1>

      <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {{ message }}
      </p>

      <RouterLink
        v-if="!loading"
        :to="destination"
        class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Continue
      </RouterLink>
    </section>
  </div>
</template>
