<script setup>
import AppNavbar from './AppNavbar.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950">
    <AppNavbar />

    <div class="flex">
      <AppSidebar />

      <main class="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-8 md:pb-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
