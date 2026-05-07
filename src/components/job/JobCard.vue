<script setup>
import { computed } from 'vue'

import { formatDate, formatSalary } from '@/utils/formatters'

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },

  applied: {
    type: Boolean,
    default: false,
  },

  saved: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['apply', 'toggle-save'])

const displaySalary = computed(() => formatSalary(props.job.salary))
const postedDate = computed(() => formatDate(props.job.posted))
</script>

<template>
  <div class="app-card p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          {{ job.title }}
        </h2>

        <p
          class="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base"
        >
          <span>{{ job.company }}</span>
          <span>{{ job.location }}</span>
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span class="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {{ job.type }}
          </span>

          <span class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {{ displaySalary }}
          </span>

          <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            {{ job.experience }}
          </span>
        </div>

        <p v-if="postedDate" class="mt-3 text-sm text-slate-400">Posted {{ postedDate }}</p>
      </div>

      <div class="grid grid-cols-[40px_1fr] gap-2 sm:flex sm:self-start">
        <button
          type="button"
          :aria-label="saved ? 'Remove saved job' : 'Save job'"
          @click="$emit('toggle-save', job)"
          class="h-10 w-10 rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <i :class="saved ? 'pi pi-bookmark-fill text-blue-500' : 'pi pi-bookmark'" />
        </button>

        <button
          type="button"
          :disabled="applied"
          @click="$emit('apply', job)"
          class="h-10 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-emerald-600"
        >
          {{ applied ? 'Applied' : 'Apply' }}
        </button>
      </div>
    </div>
  </div>
</template>
