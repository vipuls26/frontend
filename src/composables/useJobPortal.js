import { computed, ref } from 'vue'

import { jobService } from '@/services/jobService'
import { notificationService } from '@/services/notificationService'
import { recruiterService } from '@/services/recruiterService'
import { unwrapData } from '@/utils/apiResponse'
import { logError } from '@/utils/errorLogger'

const jobs = ref([])
const recruiterCompany = ref(null)
const applications = ref([])
const notifications = ref([])

const normalizeJob = (job) => ({
  ...job,
  company_id: job.company_id || job.company?.id,
  company: job.company?.name || job.company || '',
  posted: job.posted || job.created_at || '',
  status: job.status || 'published',
  has_applied: Boolean(job.has_applied),
  is_saved: Boolean(job.is_saved),
})

const normalizeApplication = (application) => ({
  ...application,
  job_id: application.job_id || application.job?.id,
  job_title: application.job_title || application.job?.title || '',
  company: application.company?.name || application.company || application.job?.company?.name || '',
  candidate_name:
    application.candidate_name || application.candidate?.name || application.full_name || '',
  candidate_email:
    application.candidate_email || application.candidate?.email || application.email || '',
  applied_at: application.applied_at || application.created_at,
})

const normalizeNotification = (notification) => ({
  ...notification,
  read: Boolean(notification.read || notification.read_at),
})

const appliedJobIds = computed(() => [
  ...applications.value.map((application) => application.job_id),
  ...jobs.value.filter((job) => job.has_applied).map((job) => job.id),
])

const publishedJobs = computed(() => jobs.value.filter((job) => job.status === 'published'))

const recruiterJobs = computed(() => jobs.value)

const recruiterApplications = computed(() => applications.value)

const savedJobIds = computed(() => jobs.value.filter((job) => job.is_saved).map((job) => job.id))

const savedJobs = computed(() => jobs.value.filter((job) => job.is_saved))

const stats = computed(() => [
  {
    title: 'Applied Jobs',
    value: applications.value.length,
    icon: 'pi pi-briefcase',
    color: 'text-blue-500',
  },
  {
    title: 'Interviews',
    value: applications.value.filter((application) => application.status === 'Interview Scheduled')
      .length,
    icon: 'pi pi-calendar',
    color: 'text-green-500',
  },
  {
    title: 'Saved Jobs',
    value: savedJobIds.value.length,
    icon: 'pi pi-bookmark',
    color: 'text-purple-500',
  },
])

const recruiterStats = computed(() => [
  {
    title: 'Company',
    value: recruiterCompany.value ? 1 : 0,
    icon: 'pi pi-building',
    color: 'text-blue-500',
  },
  {
    title: 'Posted Jobs',
    value: recruiterJobs.value.length,
    icon: 'pi pi-briefcase',
    color: 'text-purple-500',
  },
  {
    title: 'Applications',
    value: recruiterApplications.value.length,
    icon: 'pi pi-users',
    color: 'text-green-500',
  },
])

export const useJobPortal = () => {
  const loadPublicJobs = async () => {
    try {
      const response = await jobService.listPublished()
      const data = unwrapData(response)

      jobs.value = Array.isArray(data) ? data.map(normalizeJob) : []
    } catch (error) {
      throw logError('jobs.loadPublicJobs', error)
    }
  }

  const loadApplications = async () => {
    try {
      const response = await jobService.applications()
      const data = unwrapData(response)

      applications.value = Array.isArray(data) ? data.map(normalizeApplication) : []
    } catch (error) {
      throw logError('jobs.loadApplications', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const response = await notificationService.list()
      const data = unwrapData(response)

      notifications.value = Array.isArray(data) ? data.map(normalizeNotification) : []
    } catch (error) {
      throw logError('notifications.load', error)
    }
  }

  const loadRecruiterCompany = async () => {
    try {
      const response = await recruiterService.company()
      const data = unwrapData(response)

      recruiterCompany.value = data?.id ? data : null
    } catch (error) {
      if (error.response?.status === 404) {
        recruiterCompany.value = null
        return
      }

      throw logError('recruiter.loadCompany', error)
    }
  }

  const loadRecruiterJobs = async () => {
    try {
      const response = await recruiterService.jobs()
      const data = unwrapData(response)

      jobs.value = Array.isArray(data) ? data.map(normalizeJob) : []
    } catch (error) {
      throw logError('recruiter.loadJobs', error)
    }
  }

  const loadRecruiterApplications = async () => {
    try {
      const response = await recruiterService.applications()
      const data = unwrapData(response)

      applications.value = Array.isArray(data) ? data.map(normalizeApplication) : []
    } catch (error) {
      throw logError('recruiter.loadApplications', error)
    }
  }

  const createCompany = async (values) => {
    try {
      const response = await recruiterService.createCompany(values)
      const data = unwrapData(response)

      recruiterCompany.value = data

      return data
    } catch (error) {
      throw logError('recruiter.createCompany', error, values)
    }
  }

  const addRecruiterJob = async (values) => {
    try {
      const response = await recruiterService.createJob(values)
      const data = normalizeJob(unwrapData(response))

      jobs.value.unshift(data)

      return data
    } catch (error) {
      throw logError('recruiter.createJob', error, values)
    }
  }

  const toggleJobPublish = async (jobId) => {
    const job = jobs.value.find((item) => item.id === jobId)
    const status = job?.status === 'published' ? 'draft' : 'published'

    try {
      const response = await recruiterService.updateJobStatus(jobId, status)
      const data = normalizeJob(unwrapData(response))
      const index = jobs.value.findIndex((item) => item.id === jobId)

      if (index !== -1) {
        jobs.value[index] = data.id ? data : { ...jobs.value[index], status }
      }

      return jobs.value[index]?.status || status
    } catch (error) {
      throw logError('recruiter.toggleJobPublish', error, { jobId, status })
    }
  }

  const hasApplied = (jobId) => appliedJobIds.value.includes(jobId)

  const isSaved = (jobId) => savedJobIds.value.includes(jobId)

  const toggleSavedJob = async (jobId) => {
    const saved = isSaved(jobId)

    try {
      if (saved) {
        await jobService.unsave(jobId)
      } else {
        await jobService.save(jobId)
      }

      const job = jobs.value.find((item) => item.id === jobId)

      if (job) {
        job.is_saved = !saved
      }

      return !saved
    } catch (error) {
      throw logError('jobs.toggleSavedJob', error, { jobId, saved })
    }
  }

  const applyToJob = async (job, values) => {
    if (hasApplied(job.id)) {
      throw new Error('You have already applied to this job.')
    }

    try {
      const response = await jobService.apply(job.id, values)
      const data = normalizeApplication(unwrapData(response))

      applications.value.unshift(
        data.id
          ? data
          : normalizeApplication({
              ...values,
              id: Date.now(),
              job_id: job.id,
              job_title: job.title,
              company: job.company,
              status: 'Pending',
              applied_at: new Date().toISOString(),
            }),
      )

      const savedJob = jobs.value.find((item) => item.id === job.id)

      if (savedJob) {
        savedJob.has_applied = true
      }
    } catch (error) {
      throw logError('jobs.applyToJob', error, { jobId: job.id })
    }
  }

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await recruiterService.updateApplicationStatus(applicationId, status)
      const data = normalizeApplication(unwrapData(response))
      const index = applications.value.findIndex((item) => item.id === applicationId)

      if (index !== -1) {
        applications.value[index] = data.id ? data : { ...applications.value[index], status }
      }

      return applications.value[index]
    } catch (error) {
      throw logError('recruiter.updateApplicationStatus', error, { applicationId, status })
    }
  }

  const markNotificationsRead = async () => {
    try {
      const response = await notificationService.markRead()

      notifications.value = notifications.value.map((notification) => ({
        ...notification,
        read: true,
        read_at: notification.read_at || new Date().toISOString(),
      }))

      return response.data?.message || 'Notifications marked as read.'
    } catch (error) {
      throw logError('notifications.markRead', error)
    }
  }

  const markNotificationRead = async (notificationId) => {
    try {
      const response = await notificationService.markOneRead(notificationId)
      const notification = notifications.value.find((item) => item.id === notificationId)

      if (notification) {
        notification.read = true
        notification.read_at = notification.read_at || new Date().toISOString()
      }

      return response.data?.message || 'Notification marked as read.'
    } catch (error) {
      throw logError('notifications.markOneRead', error, { notificationId })
    }
  }

  const clearNotifications = async () => {
    try {
      const response = await notificationService.clear()

      notifications.value = []

      return response.data?.message || 'Notifications cleared.'
    } catch (error) {
      throw logError('notifications.clear', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const response = await notificationService.deleteOne(notificationId)

      notifications.value = notifications.value.filter(
        (notification) => notification.id !== notificationId,
      )

      return response.data?.message || 'Notification deleted.'
    } catch (error) {
      throw logError('notifications.delete', error, { notificationId })
    }
  }

  return {
    applications,
    notifications,
    recruiterCompany,
    recruiterApplications,
    recruiterJobs,
    recruiterStats,
    jobs,
    publishedJobs,
    savedJobIds,
    savedJobs,
    stats,
    addRecruiterJob,
    applyToJob,
    createCompany,
    hasApplied,
    isSaved,
    loadApplications,
    loadNotifications,
    loadPublicJobs,
    loadRecruiterApplications,
    loadRecruiterCompany,
    loadRecruiterJobs,
    clearNotifications,
    deleteNotification,
    markNotificationRead,
    markNotificationsRead,
    toggleJobPublish,
    toggleSavedJob,
    updateApplicationStatus,
  }
}
