<script setup>
import { useJobPortal } from '@/composables/useJobPortal'

const { stats } = useJobPortal()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-3">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ stat.title }}
          </p>

          <h2 class="mt-2 text-3xl font-bold dark:text-white">
            {{ stat.value }}
          </h2>
        </div>

        <i :class="[stat.icon, stat.color]" class="text-3xl" />
      </div>
    </div>
  </div>
</template>
