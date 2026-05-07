<script setup>
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const sending = ref(false)

const showBanner = computed(
  () => auth.isAuthenticated && auth.user && auth.user.email_verified_at === null,
)

const resendVerification = async () => {
  try {
    sending.value = true
    const message = await auth.resendVerificationEmail()

    toast.success(message, {
      id: 'verification-email-sent',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to send verification email', {
      id: 'verification-email-error',
    })
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div
    v-if="showBanner"
    class="mb-5 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex min-w-0 items-start gap-3">
      <i class="pi pi-envelope mt-0.5 text-amber-600 dark:text-amber-300" />

      <div class="min-w-0">
        <h2 class="text-sm font-semibold">Verify your email</h2>
        <p class="mt-1 text-sm text-amber-800 dark:text-amber-200">
          Check your inbox for the verification link.
        </p>
      </div>
    </div>

    <button
      type="button"
      :disabled="sending"
      @click="resendVerification"
      class="inline-flex w-fit items-center justify-center rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {{ sending ? 'Sending...' : 'Resend' }}
    </button>
  </div>
</template>
