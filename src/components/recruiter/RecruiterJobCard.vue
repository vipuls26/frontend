<script setup>
import { computed } from 'vue'

import { formatSalary } from '@/utils/formatters'

import JobStatusBadge from './JobStatusBadge.vue'

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle-publish'])

const displaySalary = computed(() => formatSalary(props.job.salary))
</script>

<template>
  <article
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <h3 class="truncate text-lg font-semibold dark:text-white">{{ job.title }}</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ job.company }} • {{ job.location }} • {{ job.type }}
        </p>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {{ displaySalary }} • {{ job.experience }}
        </p>
      </div>

      <div class="flex shrink-0 flex-wrap items-center gap-2">
        <JobStatusBadge :status="job.status" />

        <button
          type="button"
          @click="$emit('toggle-publish', job)"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {{ job.status === 'published' ? 'Unpublish' : 'Publish' }}
        </button>
      </div>
    </div>
  </article>
</template>
