<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'

const {
  loadRecruiterApplications,
  loadRecruiterCompany,
  loadRecruiterJobs,
  recruiterApplications,
  recruiterCompany,
  recruiterJobs,
  recruiterStats,
} = useJobPortal()

const loading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([loadRecruiterCompany(), loadRecruiterJobs(), loadRecruiterApplications()])
  } catch (error) {
    toast.error(error.message || 'Unable to load recruiter dashboard', {
      id: 'recruiter-dashboard-load-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your company profile, draft jobs, and published listings.
        </p>
      </div>

      <RouterLink
        :to="recruiterCompany ? '/recruiter/jobs' : '/recruiter/company'"
        class="w-fit rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition hover:bg-blue-600"
      >
        {{ recruiterCompany ? 'Post Job' : 'Create Company' }}
      </RouterLink>
    </div>

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <CardSkeleton v-for="item in 3" :key="item" />
    </div>

    <div v-else class="grid gap-4 md:grid-cols-3">
      <div
        v-for="stat in recruiterStats"
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

    <div class="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
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

            <span
              class="w-fit rounded-full px-3 py-1 text-xs"
              :class="
                job.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              "
            >
              {{ job.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
