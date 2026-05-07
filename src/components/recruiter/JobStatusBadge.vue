<script setup>
defineProps({
  status: {
    type: String,
    default: 'draft',
  },
})
</script>

<template>
  <span
    class="inline-flex min-h-7 w-fit items-center rounded-full px-3.5 py-1.5 text-xs font-medium capitalize leading-none"
    :class="
      status === 'published'
        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    "
  >
    {{ status }}
  </span>
</template>
