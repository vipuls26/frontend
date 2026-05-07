import api from '@/api/axios'

export const jobService = {
  listPublished() {
    return api.get('/jobs')
  },

  apply(jobId, payload) {
    return api.post(`/jobs/${jobId}/apply`, payload)
  },

  save(jobId) {
    return api.post(`/jobs/${jobId}/save`)
  },

  unsave(jobId) {
    return api.delete(`/jobs/${jobId}/save`)
  },

  applications() {
    return api.get('/applications')
  },
}
