<script setup>
defineProps({
  company: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ company.name }}
        </h2>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          {{ company.industry }} • {{ company.location }}
        </p>
      </div>

      <span class="w-fit rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
        Active
      </span>
    </div>

    <p v-if="company.description" class="mt-5 text-gray-600 dark:text-gray-300">
      {{ company.description }}
    </p>

    <a
      v-if="company.website"
      :href="company.website"
      target="_blank"
      class="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
    >
      <i class="pi pi-link" />
      Website
    </a>
  </section>
</template>
