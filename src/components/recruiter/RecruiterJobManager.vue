<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/sweetAlert'

const {
  addRecruiterJob,
  loadRecruiterCompany,
  loadRecruiterJobs,
  recruiterCompany,
  recruiterJobs,
  toggleJobPublish,
} = useJobPortal()

const loading = ref(true)

const form = reactive({
  title: '',
  location: '',
  type: 'Full Time',
  salary: '',
  experience: '',
  status: 'draft',
})

const errors = ref({})

const publishedCount = computed(
  () => recruiterJobs.value.filter((job) => job.status === 'published').length,
)

const resetForm = () => {
  form.title = ''
  form.location = ''
  form.type = 'Full Time'
  form.salary = ''
  form.experience = ''
  form.status = 'draft'
}

const validate = () => {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Job title is required'
  }

  if (!form.location.trim()) {
    errors.value.location = 'Location is required'
  }

  if (!form.salary.trim()) {
    errors.value.salary = 'Salary is required'
  }

  if (!form.experience.trim()) {
    errors.value.experience = 'Experience is required'
  }

  return !Object.keys(errors.value).length
}

const submitJob = async () => {
  if (!recruiterCompany.value) {
    toast.error('Create your company before adding jobs', {
      id: 'job-company-required',
    })
    return
  }

  if (!validate()) {
    toast.error('Please fill required job details', {
      id: 'job-validation-error',
    })
    return
  }

  try {
    await addRecruiterJob({ ...form })

    toast.success(
      form.status === 'published' ? 'Job published successfully' : 'Job saved as draft',
      {
        id: 'job-created',
      },
    )

    resetForm()
  } catch (error) {
    toast.error(error.message, {
      id: 'job-create-error',
    })
  }
}

const togglePublish = async (job) => {
  const nextStatus = job.status === 'published' ? 'draft' : 'published'
  const confirmed = await confirmAction({
    title: nextStatus === 'published' ? 'Publish job?' : 'Unpublish job?',
    text:
      nextStatus === 'published'
        ? 'Candidates will be able to see and apply for this job.'
        : 'Candidates will no longer see this job in published listings.',
    confirmButtonText: nextStatus === 'published' ? 'Publish' : 'Unpublish',
    icon: 'question',
  })

  if (!confirmed) {
    return
  }

  try {
    const status = await toggleJobPublish(job.id)

    toast.success(
      status === 'published' ? `${job.title} published` : `${job.title} moved to draft`,
      {
        id: `job-status-${job.id}`,
      },
    )
  } catch (error) {
    toast.error(error.message || 'Unable to update job status', {
      id: `job-status-error-${job.id}`,
    })
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadRecruiterCompany(), loadRecruiterJobs()])
  } catch (error) {
    toast.error(error.message || 'Unable to load recruiter jobs', {
      id: 'recruiter-jobs-load-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add draft jobs or publish them when they are ready for users.
        </p>
      </div>

      <div class="rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-gray-900">
        <p class="text-sm text-gray-500 dark:text-gray-400">Published</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ publishedCount }}</p>
      </div>
    </div>

    <CardSkeleton v-if="loading" />

    <div
      v-else-if="!recruiterCompany"
      class="rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-200"
    >
      <p class="font-medium">Create your company first.</p>
      <p class="mt-1 text-sm">A recruiter can add jobs only after creating one company profile.</p>

      <RouterLink
        to="/recruiter/company"
        class="mt-4 inline-flex rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600"
      >
        Create Company
      </RouterLink>
    </div>

    <template v-else>
      <form
        @submit.prevent="submitJob"
        class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:grid-cols-2 sm:p-6 lg:grid-cols-3"
      >
        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-200">Job Title</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Frontend Developer"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-200">Location</label>
          <input
            v-model="form.location"
            type="text"
            placeholder="Remote"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.location" class="mt-1 text-sm text-red-500">{{ errors.location }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-200">Type</label>
          <select
            v-model="form.type"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-200">Salary</label>
          <input
            v-model="form.salary"
            type="text"
            placeholder="$4k - $7k"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.salary" class="mt-1 text-sm text-red-500">{{ errors.salary }}</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium dark:text-gray-200">Experience</label>
          <input
            v-model="form.experience"
            type="text"
            placeholder="2+ years"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <p v-if="errors.experience" class="mt-1 text-sm text-red-500">
            {{ errors.experience }}
          </p>
        </div>

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

        <button
          type="submit"
          class="rounded-lg bg-blue-500 px-5 py-3 text-white transition hover:bg-blue-600 sm:col-span-2 lg:col-span-3"
        >
          Add Job
        </button>
      </form>

      <div class="space-y-3">
        <div
          v-if="!recruiterJobs.length"
          class="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          No jobs added yet.
        </div>

        <div
          v-for="job in recruiterJobs"
          :key="job.id"
          class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 class="text-lg font-semibold dark:text-white">{{ job.title }}</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ job.company }} • {{ job.location }} • {{ job.type }}
              </p>
              <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {{ job.salary }} • {{ job.experience }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                class="rounded-full px-3 py-1 text-sm"
                :class="
                  job.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                "
              >
                {{ job.status }}
              </span>

              <button
                type="button"
                @click="togglePublish(job)"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {{ job.status === 'published' ? 'Unpublish' : 'Publish' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
