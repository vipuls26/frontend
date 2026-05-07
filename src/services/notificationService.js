import api from '@/api/axios'

export const notificationService = {
  list() {
    return api.get('/notifications')
  },

  clear() {
    return api.patch('/notifications/read')
  },
}
