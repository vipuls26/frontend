import api from '@/api/axios'

export const recruiterService = {
  company() {
    return api.get('/recruiter/company')
  },

  createCompany(payload) {
    return api.post('/recruiter/company', payload)
  },

  jobs() {
    return api.get('/recruiter/jobs')
  },

  createJob(payload) {
    return api.post('/recruiter/jobs', payload)
  },

  updateJobStatus(jobId, status) {
    return api.patch(`/recruiter/jobs/${jobId}/status`, { status })
  },

  applications() {
    return api.get('/recruiter/applications')
  },

  updateApplicationStatus(applicationId, status) {
    return api.patch(`/recruiter/applications/${applicationId}/status`, { status })
  },
}
