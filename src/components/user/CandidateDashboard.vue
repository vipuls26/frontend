<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/sweetAlert'

const {
  applications,
  clearNotifications,
  loadApplications,
  loadNotifications,
  loadPublicJobs,
  notifications,
  publishedJobs,
  savedJobs,
  stats,
} = useJobPortal()

const loading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([loadApplications(), loadNotifications(), loadPublicJobs()])
  } catch (error) {
    toast.error(error.message || 'Unable to load dashboard', {
      id: 'candidate-dashboard-load-error',
    })
  } finally {
    loading.value = false
  }
})

const clearUserNotifications = async () => {
  const confirmed = await confirmAction({
    title: 'Clear notifications?',
    text: 'This will delete all notifications from your account.',
    confirmButtonText: 'Clear',
    icon: 'warning',
    confirmButtonColor: '#dc2626',
  })

  if (!confirmed) {
    return
  }

  try {
    const message = await clearNotifications()

    toast.success(message, {
      id: 'notifications-cleared',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to clear notifications', {
      id: 'notifications-clear-error',
    })
  }
}
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Candidate Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track applications, saved jobs, and published opportunities.
        </p>
      </div>

      <RouterLink
        to="/jobs"
        class="w-fit rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition hover:bg-blue-600"
      >
        Browse Jobs
      </RouterLink>
    </div>

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <CardSkeleton v-for="item in 3" :key="item" />
    </div>

    <div v-else class="grid gap-4 md:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
            <h2 class="mt-2 text-3xl font-bold dark:text-white">{{ stat.value }}</h2>
          </div>

          <i :class="[stat.icon, stat.color]" class="text-3xl" />
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold dark:text-white">Notifications</h2>

          <button
            v-if="notifications.length"
            type="button"
            @click="clearUserNotifications"
            class="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>

        <div v-if="!notifications.length" class="text-sm text-gray-500 dark:text-gray-400">
          No notifications yet.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="notification in notifications.slice(0, 3)"
            :key="notification.id"
            class="rounded-lg border p-3"
            :class="
              notification.read
                ? 'border-gray-200 dark:border-gray-700'
                : 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
            "
          >
            <h3 class="font-medium dark:text-white">{{ notification.title }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
          </div>
        </div>
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        <h2 class="mb-4 text-lg font-semibold dark:text-white">Recent Applications</h2>

        <div v-if="!applications.length" class="text-sm text-gray-500 dark:text-gray-400">
          No applications yet.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="application in applications.slice(0, 3)"
            :key="application.id"
            class="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
          >
            <h3 class="font-medium dark:text-white">{{ application.job_title }}</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ application.company }} • {{ application.status }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        <h2 class="mb-4 text-lg font-semibold dark:text-white">Job Snapshot</h2>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
            <p class="text-sm text-blue-700 dark:text-blue-300">Published Jobs</p>
            <p class="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
              {{ publishedJobs.length }}
            </p>
          </div>

          <div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/30">
            <p class="text-sm text-purple-700 dark:text-purple-300">Saved Jobs</p>
            <p class="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-100">
              {{ savedJobs.length }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
