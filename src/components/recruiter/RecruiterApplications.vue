<script setup>
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import EmptyState from '@/components/baseui/EmptyState.vue'
import PageHeader from '@/components/baseui/PageHeader.vue'
import CreateCompanyNotice from '@/components/recruiter/CreateCompanyNotice.vue'
import RecruiterApplicationCard from '@/components/recruiter/RecruiterApplicationCard.vue'
import CardSkeleton from '@/components/skeletons/CardSkeleton.vue'
import { useJobPortal } from '@/composables/useJobPortal'
import { confirmAction } from '@/utils/confirmToast'

const {
  loadRecruiterApplications,
  loadRecruiterCompany,
  recruiterApplications,
  recruiterCompany,
  updateApplicationStatus,
} = useJobPortal()

const loading = ref(true)

const updateStatus = async (application, status) => {
  const confirmed = await confirmAction({
    title: `${status}?`,
    text: `This will update ${application.candidate_name}'s application for ${application.job_title}.`,
    confirmButtonText: status,
    icon: status === 'Rejected' ? 'warning' : 'question',
    confirmButtonColor: status === 'Rejected' ? '#dc2626' : '#2563eb',
  })

  if (!confirmed) {
    return
  }

  try {
    await updateApplicationStatus(application.id, status)

    toast.success(`${application.candidate_name} marked as ${status}`, {
      id: `application-${application.id}-${status}`,
    })
  } catch (error) {
    toast.error(error.message || 'Unable to update application', {
      id: `application-error-${application.id}`,
    })
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadRecruiterCompany(), loadRecruiterApplications()])
  } catch (error) {
    toast.error(error.message || 'Unable to load applications', {
      id: 'recruiter-applications-load-error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-4">
    <PageHeader
      title="Candidate Applications"
      description="Accept, reject, or schedule interviews for candidates who applied to your jobs."
    />

    <CardSkeleton v-if="loading" />

    <CreateCompanyNotice
      v-else-if="!recruiterCompany"
      message="Applications appear here after candidates apply to your company jobs."
    />

    <EmptyState
      v-else-if="!recruiterApplications.length"
      message="No candidate applications yet."
      icon="pi pi-users"
    />

    <div v-else class="space-y-3">
      <RecruiterApplicationCard
        v-for="application in recruiterApplications"
        :key="application.id"
        :application="application"
        @update-status="updateStatus"
      />
    </div>
  </section>
</template>
