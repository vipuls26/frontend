<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/baseui/EmptyState.vue'
import PageHeader from '@/components/baseui/PageHeader.vue'
import CreateCompanyNotice from '@/components/recruiter/CreateCompanyNotice.vue'
import RecruiterJobCard from '@/components/recruiter/RecruiterJobCard.vue'
import RecruiterJobForm from '@/components/recruiter/RecruiterJobForm.vue'
import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/confirmToast'

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
    <PageHeader
      title="Manage Jobs"
      description="Add draft jobs or publish them when they are ready for users."
    >
      <div class="rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-gray-900">
        <p class="text-sm text-gray-500 dark:text-gray-400">Published</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ publishedCount }}</p>
      </div>
    </PageHeader>

    <CardSkeleton v-if="loading" />

    <CreateCompanyNotice
      v-else-if="!recruiterCompany"
      message="A recruiter can add jobs only after creating one company profile."
    />

    <template v-else>
      <RecruiterJobForm :form="form" :errors="errors" @submit="submitJob" />

      <div class="space-y-3">
        <EmptyState
          v-if="!recruiterJobs.length"
          message="No jobs added yet."
          icon="pi pi-briefcase"
        />

        <RecruiterJobCard
          v-for="job in recruiterJobs"
          :key="job.id"
          :job="job"
          @toggle-publish="togglePublish"
        />
      </div>
    </template>
  </section>
</template>
