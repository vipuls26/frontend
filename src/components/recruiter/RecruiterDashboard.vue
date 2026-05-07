<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import PageHeader from '@/components/baseui/PageHeader.vue'
import StatGrid from '@/components/dashboard/StatGrid.vue'
import NotificationPanel from '@/components/notifications/NotificationPanel.vue'
import JobStatusBadge from '@/components/recruiter/JobStatusBadge.vue'
import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/confirmToast'

const {
  clearNotifications,
  deleteNotification,
  loadNotifications,
  loadRecruiterApplications,
  loadRecruiterCompany,
  loadRecruiterJobs,
  markNotificationRead,
  markNotificationsRead,
  notifications,
  recruiterApplications,
  recruiterCompany,
  recruiterJobs,
  recruiterStats,
} = useJobPortal()

const loading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([
      loadNotifications(),
      loadRecruiterCompany(),
      loadRecruiterJobs(),
      loadRecruiterApplications(),
    ])
  } catch (error) {
    toast.error(error.message || 'Unable to load recruiter dashboard', {
      id: 'recruiter-dashboard-load-error',
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
    icon: 'warning',
    confirmButtonColor: '#dc2626',
  })

  if (!confirmed) {
    return
  }

  try {
    const message = await clearNotifications()

    toast.success(message, {
      id: 'recruiter-notifications-cleared',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to clear notifications', {
      id: 'recruiter-notifications-clear-error',
    })
  }
}

const markUserNotificationsRead = async () => {
  const confirmed = await confirmAction({
    title: 'Mark notifications as read?',
    text: 'This will keep notifications in your account and remove unread highlights.',
    confirmButtonText: 'Mark read',
    icon: 'warning',
    confirmButtonColor: '#dc2626',
  })

  if (!confirmed) {
    return
  }

  try {
    const message = await markNotificationsRead()

    toast.success(message, {
      id: 'recruiter-notifications-marked-read',
    })
  } catch (error) {
    toast.error(error.message || 'Unable to mark notifications as read', {
      id: 'recruiter-notifications-mark-read-error',
    })
  }
}

const deleteUserNotification = async (notification) => {
  const confirmed = await confirmAction({
    title: 'Delete notification?',
    text: 'This will permanently delete this notification from your account.',
    confirmButtonText: 'Delete',
    icon: 'warning',
    confirmButtonColor: '#dc2626',
  })

  if (!confirmed) {
    return
  }

  try {
    const message = await deleteNotification(notification.id)

    toast.success(message, {
      id: `recruiter-notification-deleted-${notification.id}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to delete notification', {
      id: `recruiter-notification-delete-error-${notification.id}`,
    })
  }
}

const markUserNotificationRead = async (notification) => {
  try {
    const message = await markNotificationRead(notification.id)

    toast.success(message, {
      id: `recruiter-notification-marked-read-${notification.id}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to mark notification as read', {
      id: `recruiter-notification-mark-read-error-${notification.id}`,
    })
  }
}
</script>

<template>
  <section class="space-y-5">
    <PageHeader
      title="Recruiter Dashboard"
      description="Manage your company profile, draft jobs, and published listings."
    >
      <RouterLink
        :to="recruiterCompany ? '/recruiter/jobs' : '/recruiter/company'"
        class="w-fit rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition hover:bg-blue-600"
      >
        {{ recruiterCompany ? 'Post Job' : 'Create Company' }}
      </RouterLink>
    </PageHeader>

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <CardSkeleton v-for="item in 3" :key="item" />
    </div>

    <StatGrid v-else :stats="recruiterStats" />

    <div class="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
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
        <h2 class="mb-4 text-lg font-semibold dark:text-white">Company</h2>

        <div v-if="recruiterCompany">
          <h3 class="font-semibold dark:text-white">{{ recruiterCompany.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ recruiterCompany.industry }} • {{ recruiterCompany.location }}
          </p>
        </div>

        <div v-else class="text-sm text-gray-500 dark:text-gray-400">
          Create your company before posting jobs.
        </div>
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold dark:text-white">Candidate Reviews</h2>

          <RouterLink to="/recruiter/applications" class="text-sm text-blue-600 hover:underline">
            View All
          </RouterLink>
        </div>

        <div v-if="!recruiterApplications.length" class="text-sm text-gray-500 dark:text-gray-400">
          No applications to review yet.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="application in recruiterApplications.slice(0, 3)"
            :key="application.id"
            class="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
          >
            <h3 class="font-medium dark:text-white">{{ application.candidate_name }}</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ application.job_title }} • {{ application.status }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        <h2 class="mb-4 text-lg font-semibold dark:text-white">Latest Recruiter Jobs</h2>

        <div v-if="!recruiterJobs.length" class="text-sm text-gray-500 dark:text-gray-400">
          No recruiter jobs added yet.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="job in recruiterJobs.slice(0, 4)"
            :key="job.id"
            class="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 class="font-medium dark:text-white">{{ job.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ job.location }} • {{ job.type }}</p>
            </div>

            <JobStatusBadge :status="job.status" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
