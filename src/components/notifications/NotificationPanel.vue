<script setup>
import { computed } from 'vue'

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['mark-read', 'mark-one-read', 'clear', 'delete'])

const visibleNotifications = computed(() => props.notifications.slice(0, 5))
const unreadCount = computed(
  () => props.notifications.filter((notification) => !notification.read).length,
)
</script>

<template>
  <section
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
  >
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold dark:text-white">Notifications</h2>

          <span
            v-if="unreadCount"
            class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
          >
            {{ unreadCount }} unread
          </span>
        </div>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recent account updates and activity.
        </p>
      </div>

      <div v-if="notifications.length" class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          :disabled="!unreadCount"
          @click="$emit('mark-read')"
          class="rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900/70 dark:text-blue-300 dark:hover:bg-blue-950/30"
        >
          Mark read
        </button>

        <button
          type="button"
          @click="$emit('clear')"
          class="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/30"
        >
          Clear
        </button>
      </div>
    </div>

    <div
      v-if="!notifications.length"
      class="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700"
    >
      <i class="pi pi-bell text-2xl text-gray-400" />
      <p class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">No notifications yet</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        New account activity will appear here.
      </p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="notification in visibleNotifications"
        :key="notification.id"
        class="rounded-lg border p-3 transition"
        :class="
          notification.read
            ? 'border-gray-200 dark:border-gray-700'
            : 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
        "
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span
                v-if="!notification.read"
                class="h-2 w-2 shrink-0 rounded-full bg-blue-600"
              />

              <h3 class="truncate font-medium dark:text-white">{{ notification.title }}</h3>
            </div>

            <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {{ notification.message }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <button
              v-if="!notification.read"
              type="button"
              class="grid h-8 w-8 place-items-center rounded-lg text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/30"
              title="Mark notification as read"
              @click="$emit('mark-one-read', notification)"
            >
              <i class="pi pi-check text-sm" />
            </button>

            <button
              type="button"
              class="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
              title="Delete notification"
              @click="$emit('delete', notification)"
            >
              <i class="pi pi-trash text-sm" />
            </button>
          </div>
        </div>
      </article>

      <p v-if="notifications.length > visibleNotifications.length" class="text-xs text-gray-500">
        Showing latest {{ visibleNotifications.length }} of {{ notifications.length }}.
      </p>
    </div>
  </section>
</template>
