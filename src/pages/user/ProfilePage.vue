<script setup>
import { computed, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'

import BaseButton from '@/components/baseui/BaseButton.vue'
import BaseInput from '@/components/baseui/BaseInput.vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const sendingVerification = ref(false)

const form = reactive({
  name: auth.user?.name || '',
  email: auth.user?.email || '',
  password: '',
  password_confirmation: '',
})

const emailVerified = computed(() => Boolean(auth.user?.email_verified_at))
const initials = computed(() =>
  (auth.user?.name || auth.role || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(''),
)

const resendVerification = async () => {
  try {
    sendingVerification.value = true
    const message = await auth.resendVerificationEmail()

    toast.success(message, {
      id: 'profile-verification-email-sent',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to send verification email', {
      id: 'profile-verification-email-error',
    })
  } finally {
    sendingVerification.value = false
  }
}

const submit = async () => {
  const payload = {
    name: form.name,
    email: form.email,
  }

  if (form.password || form.password_confirmation) {
    payload.password = form.password
    payload.password_confirmation = form.password_confirmation
  }

  try {
    await auth.updateProfile(payload)

    form.password = ''
    form.password_confirmation = ''

    toast.success('Profile updated successfully', {
      id: 'profile-updated',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to update profile', {
      id: 'profile-update-error',
    })
  }
}
</script>

<template>
  <section class="mx-auto max-w-5xl space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account identity, email verification, and password.
        </p>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center gap-4">
          <div class="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {{ initials }}
          </div>

          <div class="min-w-0">
            <h2 class="truncate font-semibold text-slate-900 dark:text-white">
              {{ auth.user?.name || 'User' }}
            </h2>
            <p class="truncate text-sm text-slate-500 dark:text-slate-400">
              {{ auth.user?.email }}
            </p>
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
            <p class="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Role</p>
            <p class="mt-1 capitalize text-slate-900 dark:text-white">{{ auth.role }}</p>
          </div>

          <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
            <p class="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Email</p>
            <div class="mt-2 flex items-center justify-between gap-3">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  emailVerified
                    ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                "
              >
                {{ emailVerified ? 'Verified' : 'Unverified' }}
              </span>

              <button
                v-if="!emailVerified"
                type="button"
                :disabled="sendingVerification"
                @click="resendVerification"
                class="text-sm font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ sendingVerification ? 'Sending...' : 'Resend' }}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <form
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        @submit.prevent="submit"
      >
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">Account details</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Changing email will require verification again.
          </p>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="form.name"
              label="Name"
              placeholder="Your name"
              :error="auth.errors.name"
            />

            <BaseInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              :error="auth.errors.email"
            />
          </div>
        </div>

        <div class="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">Change password</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Leave both fields empty to keep your current password.
          </p>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="form.password"
              label="New password"
              type="password"
              placeholder="New password"
              :error="auth.errors.password"
            />

            <BaseInput
              v-model="form.password_confirmation"
              label="Confirm password"
              type="password"
              placeholder="Confirm password"
              :error="auth.errors.password_confirmation"
            />
          </div>
        </div>

        <div
          class="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Your changes are saved to your backend profile.
          </p>

          <div class="w-full sm:w-44">
            <BaseButton :loading="auth.loading" text="Save changes" />
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
