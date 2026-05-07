<script setup>
defineProps({
  fields: {
    type: Number,
    default: 2,
  },
})
</script>

<template>
  <div class="animate-pulse space-y-4">
    <div class="h-8 w-40 rounded bg-gray-300" />

    <div v-for="i in fields" :key="i" class="space-y-2">
      <div class="h-4 w-24 rounded bg-gray-300" />

      <div class="h-11 w-full rounded-lg bg-gray-300" />
    </div>

    <div class="h-11 w-full rounded-lg bg-gray-300" />
  </div>
</template>
