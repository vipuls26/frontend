<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/sweetAlert'

const {
  loadRecruiterApplications,
  loadRecruiterCompany,
  recruiterApplications,
  recruiterCompany,
  updateApplicationStatus,
} = useJobPortal()

const loading = ref(true)

const statusClass = (status) => {
  if (status === 'Accepted') {
    return 'bg-green-100 text-green-700'
  }

  if (status === 'Rejected') {
    return 'bg-red-100 text-red-700'
  }

  if (status === 'Interview Scheduled') {
    return 'bg-blue-100 text-blue-700'
  }

  return 'bg-yellow-100 text-yellow-700'
}

const updateStatus = async (application, status) => {
  const confirmed = await confirmAction({
    title: `${status}?`,
    text: `This will update ${application.candidate_name}'s application for ${application.job_title}.`,
    confirmButtonText: status,
    icon: status === 'Rejected' ? 'warning' : 'question',
    confirmButtonColor: status === 'Rejected' ? '#dc2626' : '#2563eb',
  })

  if (!confirmed) {
    return
  }

  try {
    await updateApplicationStatus(application.id, status)

    toast.success(`${application.candidate_name} marked as ${status}`, {
      id: `application-${application.id}-${status}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to update application', {
      id: `application-error-${application.id}`,
    })
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadRecruiterCompany(), loadRecruiterApplications()])
  } catch (error) {
    toast.error(error.message || 'Unable to load applications', {
      id: 'recruiter-applications-load-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Candidate Applications</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Accept, reject, or schedule interviews for candidates who applied to your jobs.
      </p>
    </div>

    <CardSkeleton v-if="loading" />

    <div
      v-else-if="!recruiterCompany"
      class="rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-200"
    >
      <p class="font-medium">Create your company first.</p>
      <p class="mt-1 text-sm">
        Applications appear here after candidates apply to your company jobs.
      </p>

      <RouterLink
        to="/recruiter/company"
        class="mt-4 inline-flex rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600"
      >
        Create Company
      </RouterLink>
    </div>

    <div
      v-else-if="!recruiterApplications.length"
      class="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
    >
      No candidate applications yet.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="application in recruiterApplications"
        :key="application.id"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ application.candidate_name }}
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ application.candidate_email }}
            </p>

            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Applied for <span class="font-medium">{{ application.job_title }}</span>
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span
              class="w-fit rounded-full px-3 py-1 text-sm font-medium"
              :class="statusClass(application.status)"
            >
              {{ application.status }}
            </span>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                @click="updateStatus(application, 'Interview Scheduled')"
                class="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-50"
              >
                Interview
              </button>

              <button
                type="button"
                @click="updateStatus(application, 'Accepted')"
                class="rounded-lg border border-green-200 px-3 py-2 text-sm text-green-700 transition hover:bg-green-50"
              >
                Accept
              </button>

              <button
                type="button"
                @click="updateStatus(application, 'Rejected')"
                class="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

        <p v-if="application.cover_letter" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {{ application.cover_letter }}
        </p>
      </div>
    </div>
  </section>
</template>
