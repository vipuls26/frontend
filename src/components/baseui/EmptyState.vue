<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    class="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
  >
    <i v-if="icon" :class="icon" class="mb-3 block text-2xl text-gray-400" />
    {{ message }}
  </div>
</template>
