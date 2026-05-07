import api from '@/api/axios'

export const notificationService = {
  list() {
    return api.get('/notifications')
  },

  markRead() {
    return api.patch('/notifications/read')
  },

  markOneRead(notificationId) {
    return api.patch(`/notifications/${notificationId}/read`)
  },

  clear() {
    return api.delete('/notifications')
  },

  deleteOne(notificationId) {
    return api.delete(`/notifications/${notificationId}`)
  },
}
