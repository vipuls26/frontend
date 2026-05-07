<script setup>
defineProps({
  application: {
    type: Object,
    required: true,
  },
})

defineEmits(['update-status'])

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
</script>

<template>
  <article
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
        <span class="w-fit rounded-full px-3 py-1 text-sm font-medium" :class="statusClass(application.status)">
          {{ application.status }}
        </span>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            @click="$emit('update-status', application, 'Interview Scheduled')"
            class="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-50"
          >
            Interview
          </button>

          <button
            type="button"
            @click="$emit('update-status', application, 'Accepted')"
            class="rounded-lg border border-green-200 px-3 py-2 text-sm text-green-700 transition hover:bg-green-50"
          >
            Accept
          </button>

          <button
            type="button"
            @click="$emit('update-status', application, 'Rejected')"
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
  </article>
</template>
