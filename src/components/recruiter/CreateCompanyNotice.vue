<script setup>
defineProps({
  message: {
    type: String,
    default: 'A recruiter can add jobs only after creating one company profile.',
  },
})
</script>

<template>
  <div
    class="rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-200"
  >
    <p class="font-medium">Create your company first.</p>
    <p class="mt-1 text-sm">{{ message }}</p>

    <RouterLink
      to="/recruiter/company"
      class="mt-4 inline-flex rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600"
    >
      Create Company
    </RouterLink>
  </div>
</template>
