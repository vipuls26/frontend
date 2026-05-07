<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

import { useAuthStore } from '@/stores/authStore'

const route = useRoute()

const auth = useAuthStore()

const menus = [
  {
    name: 'Candidate',
    icon: 'pi pi-home',
    path: '/candidate/dashboard',
    roles: ['candidate'],
  },
  {
    name: 'Jobs',
    icon: 'pi pi-briefcase',
    path: '/jobs',
    roles: ['candidate'],
  },
  {
    name: 'Companies',
    icon: 'pi pi-building',
    path: '/companies',
    roles: ['candidate'],
  },
  {
    name: 'Applications',
    icon: 'pi pi-file',
    path: '/applications',
    roles: ['candidate'],
  },
  {
    name: 'Recruiter',
    icon: 'pi pi-chart-bar',
    path: '/recruiter/dashboard',
    roles: ['recruiter'],
  },
  {
    name: 'My Company',
    icon: 'pi pi-id-card',
    path: '/recruiter/company',
    roles: ['recruiter'],
  },
  {
    name: 'Post Jobs',
    icon: 'pi pi-plus-circle',
    path: '/recruiter/jobs',
    roles: ['recruiter'],
  },
  {
    name: 'Reviews',
    icon: 'pi pi-users',
    path: '/recruiter/applications',
    roles: ['recruiter'],
  },
]

const visibleMenus = computed(() => menus.filter((menu) => menu.roles.includes(auth.role)))
</script>

<template>
  <aside
    class="hidden min-h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:block">
    <nav class="space-y-1.5 p-4">
      <RouterLink v-for="menu in visibleMenus" :key="menu.path" :to="menu.path"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300" :class="route.path === menu.path
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
          ">
        <i :class="menu.icon" />

        <span>
          {{ menu.name }}
        </span>
      </RouterLink>
    </nav>
  </aside>

  <nav class="
    fixed inset-x-0 bottom-0 z-50
    flex items-center
    border-t border-slate-200
    bg-white/95
    px-2 py-2
    shadow-lg backdrop-blur
    dark:border-slate-800
    dark:bg-slate-950/95
    md:hidden
  ">
    <RouterLink v-for="menu in visibleMenus" :key="menu.path" :to="menu.path" class="
      flex flex-1 flex-col
      items-center justify-center
      gap-1 rounded-xl
      px-2 py-2
      text-xs font-medium
      transition-all duration-300
    " :class="route.path === menu.path
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
        : 'text-slate-500 dark:text-slate-400'
      ">
      <i :class="menu.icon" class="text-lg" />

      <span class="truncate">
        {{ menu.name }}
      </span>
    </RouterLink>
  </nav>
</template>
