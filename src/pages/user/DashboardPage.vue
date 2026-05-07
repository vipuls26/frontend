<script setup>
import DashboardStats from '@/components/user/DashboardStats.vue'
import ApplicationTracker from '@/components/user/ApplicationTracker.vue'
import CompanyList from '@/components/user/CompanyList.vue'
import JobList from '@/components/job/JobList.vue'
</script>

<template>
  <div class="space-y-8">
    <!-- Page Title -->
    <div>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      <p class="mt-2 text-gray-500 dark:text-gray-400">Welcome back 👋</p>
    </div>

    <!-- Stats -->
    <DashboardStats />

    <!-- Jobs + Companies -->
    <div class="grid gap-6 lg:grid-cols-2">
      <JobList />

      <CompanyList />
    </div>

    <!-- Application Tracker -->
    <ApplicationTracker />
  </div>
</template>
