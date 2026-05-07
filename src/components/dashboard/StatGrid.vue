<script setup>
import StatCard from './StatCard.vue'

defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-3">
    <StatCard v-for="stat in stats" :key="stat.title" :stat="stat" />
  </div>
</template>
