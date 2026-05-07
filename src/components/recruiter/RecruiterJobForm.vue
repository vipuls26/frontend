<script setup>
import BaseButton from '@/components/baseui/BaseButton.vue'
import BaseInput from '@/components/baseui/BaseInput.vue'

defineProps({
  form: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['submit'])

const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship']
</script>

<template>
  <form
    @submit.prevent="$emit('submit')"
    class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:grid-cols-2 sm:p-6 lg:grid-cols-3"
  >
    <BaseInput
      v-model="form.title"
      label="Job Title"
      placeholder="Frontend Developer"
      :error="errors.title"
    />

    <BaseInput
      v-model="form.location"
      label="Location"
      placeholder="Remote"
      :error="errors.location"
    />

    <div>
      <label class="mb-2 block text-sm font-medium dark:text-gray-200">Type</label>
      <select
        v-model="form.type"
        class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option v-for="type in jobTypes" :key="type">{{ type }}</option>
      </select>
    </div>

    <BaseInput
      v-model="form.salary"
      label="Salary"
      placeholder="₹40,000 - ₹70,000"
      :error="errors.salary"
    />

    <BaseInput
      v-model="form.experience"
      label="Experience"
      placeholder="2+ years"
      :error="errors.experience"
    />

    <div>
      <label class="mb-2 block text-sm font-medium dark:text-gray-200">Status</label>
      <select
        v-model="form.status"
        class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>

    <div class="sm:col-span-2 lg:col-span-3">
      <BaseButton text="Add Job" />
    </div>
  </form>
</template>
