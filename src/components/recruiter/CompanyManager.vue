<script setup>
import { onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'

import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'

const { createCompany, loadRecruiterCompany, recruiterCompany } = useJobPortal()

const loading = ref(true)

const form = reactive({
  name: '',
  industry: '',
  location: '',
  website: '',
  description: '',
})

const errors = ref({})

const validate = () => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Company name is required'
  }

  if (!form.industry.trim()) {
    errors.value.industry = 'Industry is required'
  }

  if (!form.location.trim()) {
    errors.value.location = 'Location is required'
  }

  return !Object.keys(errors.value).length
}

const submitCompany = async () => {
  if (!validate()) {
    toast.error('Please fill required company details', {
      id: 'company-validation-error',
    })
    return
  }

  try {
    await createCompany({ ...form })

    toast.success('Company created successfully', {
      id: 'company-created',
    })
  } catch (error) {
    toast.error(error.message, {
      id: 'company-create-error',
    })
  }
}

onMounted(async () => {
  try {
    await loadRecruiterCompany()
  } catch (error) {
    toast.error(error.message || 'Unable to load company', {
      id: 'company-load-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Company</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Recruiters can create and manage one company profile.
      </p>
    </div>

    <CardSkeleton v-if="loading" />

    <div
      v-else-if="recruiterCompany"
      class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ recruiterCompany.name }}
          </h2>
          <p class="mt-1 text-gray-500 dark:text-gray-400">
            {{ recruiterCompany.industry }} • {{ recruiterCompany.location }}
          </p>
        </div>

        <span class="w-fit rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          Active
        </span>
      </div>

      <p v-if="recruiterCompany.description" class="mt-5 text-gray-600 dark:text-gray-300">
        {{ recruiterCompany.description }}
      </p>

      <a
        v-if="recruiterCompany.website"
        :href="recruiterCompany.website"
        target="_blank"
        class="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <i class="pi pi-link" />
        Website
      </a>
    </div>

    <form
      v-else
      @submit.prevent="submitCompany"
      class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:grid-cols-2 sm:p-6"
    >
      <div>
        <label class="mb-2 block text-sm font-medium dark:text-gray-200">Company Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Enter company name"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium dark:text-gray-200">Industry</label>
        <input
          v-model="form.industry"
          type="text"
          placeholder="Software, Design, Finance"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <p v-if="errors.industry" class="mt-1 text-sm text-red-500">{{ errors.industry }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium dark:text-gray-200">Location</label>
        <input
          v-model="form.location"
          type="text"
          placeholder="Remote, Surat, Ahmedabad"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <p v-if="errors.location" class="mt-1 text-sm text-red-500">{{ errors.location }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium dark:text-gray-200">Website</label>
        <input
          v-model="form.website"
          type="url"
          placeholder="https://company.com"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div class="sm:col-span-2">
        <label class="mb-2 block text-sm font-medium dark:text-gray-200">Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Short company overview"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <button
        type="submit"
        class="rounded-lg bg-blue-500 px-5 py-3 text-white transition hover:bg-blue-600 sm:col-span-2"
      >
        Create Company
      </button>
    </form>
  </section>
</template>
