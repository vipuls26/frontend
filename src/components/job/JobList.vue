<script setup>
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import { useJobPortal } from '@/composables/useJobPortal'
import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'

import JobCard from './JobCard.vue'

import ApplyJobModal from './ApplyJobModal.vue'

const { applyToJob, hasApplied, isSaved, loadPublicJobs, publishedJobs, toggleSavedJob } =
  useJobPortal()

const search = ref('')

const selectedType = ref('All')

const selectedLocation = ref('All')

const showModal = ref(false)

const selectedJob = ref(null)

const applying = ref(false)

const applyError = ref('')

const loading = ref(true)

const jobTypes = computed(() => ['All', ...new Set(publishedJobs.value.map((job) => job.type))])

const locations = computed(() => [
  'All',
  ...new Set(publishedJobs.value.map((job) => job.location)),
])

const filteredJobs = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return publishedJobs.value.filter((job) => {
    const matchesSearch =
      !keyword ||
      [job.title, job.company, job.location, job.type].some((value) =>
        value.toLowerCase().includes(keyword),
      )

    const matchesType = selectedType.value === 'All' || job.type === selectedType.value

    const matchesLocation =
      selectedLocation.value === 'All' || job.location === selectedLocation.value

    return matchesSearch && matchesType && matchesLocation
  })
})

const resetFilters = () => {
  search.value = ''
  selectedType.value = 'All'
  selectedLocation.value = 'All'
}

const openApplyModal = (job) => {
  if (hasApplied(job.id)) {
    toast.info('You have already applied to this job', {
      id: `already-applied-${job.id}`,
    })
    return
  }

  selectedJob.value = job
  applyError.value = ''

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedJob.value = null
  applyError.value = ''
}

const applyJob = async (values) => {
  if (!selectedJob.value) {
    return
  }

  try {
    applying.value = true
    applyError.value = ''

    await applyToJob(selectedJob.value, values)

    toast.success(`Application submitted for ${selectedJob.value.title}`, {
      id: `apply-success-${selectedJob.value.id}`,
    })
    closeModal()
  } catch (error) {
    applyError.value = error.message || 'Unable to submit application.'
    toast.error(applyError.value, {
      id: `apply-error-${selectedJob.value.id}`,
    })
  } finally {
    applying.value = false
  }
}

const toggleSave = async (job) => {
  try {
    const saved = await toggleSavedJob(job.id)

    toast.success(saved ? `${job.title} saved` : `${job.title} removed from saved jobs`, {
      id: `save-job-${job.id}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to update saved job', {
      id: `save-job-error-${job.id}`,
    })
  }
}

onMounted(async () => {
  try {
    await loadPublicJobs()
  } catch (error) {
    toast.error(error.message || 'Unable to load jobs', {
      id: 'load-jobs-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Published Jobs</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Search and apply to roles that are currently open.
      </p>
    </div>

    <div class="app-card p-4">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto]">
        <input
          v-model="search"
          type="search"
          placeholder="Search jobs, companies, or locations"
          class="app-field min-w-0 sm:col-span-2 lg:col-span-1"
        />

        <select v-model="selectedType" class="app-field">
          <option v-for="type in jobTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <select v-model="selectedLocation" class="app-field">
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>

        <button
          type="button"
          @click="resetFilters"
          class="app-button-soft sm:col-span-2 lg:col-span-1"
        >
          Reset
        </button>
      </div>
    </div>

    <div v-if="loading" class="grid gap-4">
      <CardSkeleton v-for="item in 3" :key="item" />
    </div>

    <div
      v-else-if="!filteredJobs.length"
      class="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
    >
      No published jobs match your filters.
    </div>

    <template v-else>
      <JobCard
        v-for="job in filteredJobs"
        :key="job.id"
        :applied="hasApplied(job.id)"
        :job="job"
        :saved="isSaved(job.id)"
        @apply="openApplyModal"
        @toggle-save="toggleSave"
      />
    </template>

    <ApplyJobModal
      :show="showModal"
      :selected-job="selectedJob"
      :submitting="applying"
      :submit-error="applyError"
      @close="closeModal"
      @submit="applyJob"
    />
  </div>
</template>
