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
</script>

<template>
  <form
    @submit.prevent="$emit('submit')"
    class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:grid-cols-2 sm:p-6"
  >
    <BaseInput
      v-model="form.name"
      label="Company Name"
      placeholder="Enter company name"
      :error="errors.name"
    />

    <BaseInput
      v-model="form.industry"
      label="Industry"
      placeholder="Software, Design, Finance"
      :error="errors.industry"
    />

    <BaseInput
      v-model="form.location"
      label="Location"
      placeholder="Remote, Surat, Ahmedabad"
      :error="errors.location"
    />

    <BaseInput
      v-model="form.website"
      label="Website"
      type="url"
      placeholder="https://company.com"
    />

    <div class="sm:col-span-2">
      <label class="mb-2 block text-sm font-medium dark:text-gray-200">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Short company overview"
        class="app-field"
      />
    </div>

    <div class="sm:col-span-2">
      <BaseButton text="Create Company" />
    </div>
  </form>
</template>
