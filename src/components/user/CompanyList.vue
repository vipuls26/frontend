<script setup>
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'

const { loadPublicJobs, publishedJobs } = useJobPortal()

const loading = ref(true)

const companies = computed(() =>
  publishedJobs.value.reduce((items, job) => {
    const company = items.find((item) => item.name === job.company)

    if (company) {
      company.jobs += 1
      return items
    }

    items.push({
      id: job.company_id || job.company,
      name: job.company,
      location: job.location,
      jobs: 1,
    })

    return items
  }, []),
)

onMounted(async () => {
  try {
    await loadPublicJobs()
  } catch (error) {
    toast.error(error.message || 'Unable to load companies', {
      id: 'companies-load-error',
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
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold dark:text-white">Companies With Published Jobs</h2>
    </div>

    <div v-if="loading" class="grid gap-4">
      <CardSkeleton v-for="item in 3" :key="item" />
    </div>

    <div
      v-else-if="!companies.length"
      class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400"
    >
      No companies with published jobs yet.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="company in companies"
        :key="company.id"
        class="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-700"
      >
        <div>
          <h3 class="font-semibold dark:text-white">
            {{ company.name }}
          </h3>

          <p class="text-sm text-gray-500">
            {{ company.jobs }} Published Jobs • {{ company.location }}
          </p>
        </div>

        <i class="pi pi-building text-2xl text-blue-500" />
      </div>
    </div>
  </div>
</template>
