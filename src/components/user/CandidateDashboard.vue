<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import PageHeader from '@/components/baseui/PageHeader.vue'
import StatGrid from '@/components/dashboard/StatGrid.vue'
import NotificationPanel from '@/components/notifications/NotificationPanel.vue'
import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/confirmToast'

const {
  applications,
  clearNotifications,
  deleteNotification,
  loadApplications,
  loadNotifications,
  loadPublicJobs,
  markNotificationRead,
  markNotificationsRead,
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
    text: 'This will permanently delete all notifications from your account.',
    confirmButtonText: 'Clear',
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

const markUserNotificationsRead = async () => {
  const confirmed = await confirmAction({
    title: 'Mark notifications as read?',
    text: 'This will keep notifications in your account and remove unread highlights.',
    confirmButtonText: 'Mark read',
  })

  if (!confirmed) {
    return
  }

  try {
    const message = await markNotificationsRead()

    toast.success(message, {
      id: 'notifications-marked-read',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to mark notifications as read', {
      id: 'notifications-mark-read-error',
    })
  }
}

const deleteUserNotification = async (notification) => {
  const confirmed = await confirmAction({
    title: 'Delete notification?',
    text: 'This will permanently delete this notification from your account.',
    confirmButtonText: 'Delete',
  })

  if (!confirmed) {
    return
  }

  try {
    const message = await deleteNotification(notification.id)

    toast.success(message, {
      id: `notification-deleted-${notification.id}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to delete notification', {
      id: `notification-delete-error-${notification.id}`,
    })
  }
}

const markUserNotificationRead = async (notification) => {
  try {
    const message = await markNotificationRead(notification.id)

    toast.success(message, {
      id: `notification-marked-read-${notification.id}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to mark notification as read', {
      id: `notification-mark-read-error-${notification.id}`,
    })
  }
}
</script>

<template>
  <section class="space-y-5">
    <PageHeader
      title="Candidate Dashboard"
      description="Track applications, saved jobs, and published opportunities."
    >
      <RouterLink
        to="/jobs"
        class="w-fit rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition hover:bg-blue-600"
      >
        Browse Jobs
      </RouterLink>
    </PageHeader>

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <CardSkeleton v-for="item in 3" :key="item" />
    </div>

    <StatGrid v-else :stats="stats" />

    <div class="grid gap-4 lg:grid-cols-2">
      <NotificationPanel
        :notifications="notifications"
        @mark-read="markUserNotificationsRead"
        @mark-one-read="markUserNotificationRead"
        @clear="clearUserNotifications"
        @delete="deleteUserNotification"
      />

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
