<script setup>
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import { useJobPortal } from '@/composables/useJobPortal'
import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'

const { applications, loadApplications } = useJobPortal()

const loading = ref(true)

const statusClass = (status) => {
  if (status === 'Accepted') {
    return 'bg-green-500'
  }

  if (status === 'Rejected') {
    return 'bg-red-500'
  }

  if (status === 'Interview Scheduled') {
    return 'bg-blue-500'
  }

  return 'bg-yellow-500'
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

onMounted(async () => {
  try {
    await loadApplications()
  } catch (error) {
    toast.error(error.message || 'Unable to load applications', {
      id: 'applications-load-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
  >
    <h2 class="mb-6 text-xl font-semibold dark:text-white">Application Status</h2>

    <CardSkeleton v-if="loading" />

    <div
      v-else-if="!applications.length"
      class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400"
    >
      No applications submitted yet.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="application in applications"
        :key="application.id"
        class="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="font-semibold dark:text-white">
            {{ application.job_title }}
          </h3>

          <p class="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
            <span>{{ application.company }}</span>
            <span>Applied {{ formatDate(application.applied_at) }}</span>
          </p>
        </div>

        <span
          :class="statusClass(application.status)"
          class="w-fit rounded-full px-3 py-1 text-xs font-medium text-white"
        >
          {{ application.status }}
        </span>
      </div>
    </div>
  </div>
</template>
