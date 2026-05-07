<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

import { useForm } from 'vee-validate'

import * as yup from 'yup'

import BaseButton from '@/components/baseui/BaseButton.vue'
import BaseInput from '@/components/baseui/BaseInput.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },

  selectedJob: {
    type: Object,
    default: null,
  },

  submitting: {
    type: Boolean,
    default: false,
  },

  submitError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'submit'])

const schema = yup.object({
  full_name: yup.string().trim().required('Full name is required'),

  email: yup.string().trim().email('Invalid email').required('Email is required'),

  cover_letter: yup.string().trim().required('Cover letter is required'),
})

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: schema,
})

const [full_name] = defineField('full_name')

const [email] = defineField('email')

const [cover_letter] = defineField('cover_letter')

const fullNameInput = ref(null)

const closeModal = () => {
  if (!props.submitting) {
    emit('close')
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

watch(
  () => props.show,
  (value) => {
    if (!value) {
      resetForm()
      window.removeEventListener('keydown', handleEscape)
      return
    }

    window.addEventListener('keydown', handleEscape)

    nextTick(() => {
      fullNameInput.value?.focus()
    })
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div
    v-if="show"
    @click.self="closeModal"
    class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-job-title"
      class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 shadow-lg dark:bg-gray-900 sm:p-6"
    >
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h2 id="apply-job-title" class="text-xl font-bold dark:text-white sm:text-2xl">
            Apply Job
          </h2>

          <p class="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
            {{ selectedJob?.title }}
          </p>
        </div>

        <!-- Close -->
        <button
          type="button"
          aria-label="Close application form"
          :disabled="submitting"
          @click="closeModal"
          class="rounded-lg p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-gray-800"
        >
          <i class="pi pi-times text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-5">
        <p
          v-if="submitError"
          class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300"
        >
          {{ submitError }}
        </p>

        <BaseInput
          id="full_name"
          ref="fullNameInput"
          v-model="full_name"
          label="Full Name"
          placeholder="Enter full name"
          :disabled="submitting"
          :error="errors.full_name"
        />

        <BaseInput
          id="email"
          v-model="email"
          label="Email"
          type="email"
          placeholder="Enter email"
          :disabled="submitting"
          :error="errors.email"
        />

        <!-- Cover Letter -->
        <div>
          <label for="cover_letter" class="mb-2 block text-sm font-medium dark:text-gray-200">
            Cover Letter
          </label>

          <textarea
            id="cover_letter"
            v-model="cover_letter"
            rows="4"
            placeholder="Write cover letter..."
            :disabled="submitting"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-70"
          />

          <p v-if="errors.cover_letter" class="mt-1 text-sm text-red-500">
            {{ errors.cover_letter }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            :disabled="submitting"
            @click="closeModal"
            class="flex-1 rounded-lg border border-gray-300 py-3 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <BaseButton :loading="submitting" text="Apply Now" />
        </div>
      </form>
    </div>
  </div>
</template>
