<script setup>
import { onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'

import PageHeader from '@/components/baseui/PageHeader.vue'
import CompanyForm from '@/components/recruiter/CompanyForm.vue'
import CompanyProfileCard from '@/components/recruiter/CompanyProfileCard.vue'
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
    <PageHeader
      title="My Company"
      description="Recruiters can create and manage one company profile."
    />

    <CardSkeleton v-if="loading" />

    <CompanyProfileCard v-else-if="recruiterCompany" :company="recruiterCompany" />

    <CompanyForm v-else :form="form" :errors="errors" @submit="submitCompany" />
  </section>
</template>
