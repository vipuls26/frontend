import api from '@/api/axios'

export const authService = {
  login(payload) {
    return api.post('/login', {
      email: payload.email,
      password: payload.password,
    })
  },

  register(payload) {
    return api.post('/register', payload)
  },

  me() {
    return api.get('/me')
  },

  updateProfile(payload) {
    return api.patch('/profile', payload)
  },

  verifyToken() {
    return api.get('/verify-token', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
  },

  resendVerificationEmail() {
    return api.post('/email/verification-notification')
  },

  verifyEmail(id, hash, params) {
    return api.get(`/email/verify/${id}/${hash}`, {
      params,
    })
  },

  logout() {
    return api.post('/logout')
  },
}
