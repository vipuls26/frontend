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

  verifyToken() {
    return api.get('/verify-token', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
  },

  logout() {
    return api.post('/logout')
  },
}
