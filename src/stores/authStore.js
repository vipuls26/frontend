import { defineStore } from 'pinia'

import { setAuthToken } from '@/api/axios'
import { authService } from '@/services/authService'
import { unwrapData } from '@/utils/apiResponse'
import { logError } from '@/utils/errorLogger'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || 'candidate',
    loading: false,
    tokenVerified: false,
    verifyingToken: false,
    errors: {},
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isCandidate: (state) => state.role === 'candidate',
    isRecruiter: (state) => state.role === 'recruiter',
    homeRoute: (state) =>
      state.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard',
  },

  actions: {
    persistAuth({ token = this.token, user }) {
      this.token = token
      this.user = user
      this.role = user?.role || 'candidate'

      setAuthToken(token)

      localStorage.setItem('token', token)
      localStorage.setItem('role', this.role)
      localStorage.setItem('user', JSON.stringify(user))
      this.tokenVerified = true
    },

    async login(payload) {
      try {
        this.loading = true
        this.errors = {}

        const response = await authService.login(payload)
        const data = unwrapData(response)

        this.persistAuth({
          token: data.token,
          user: data.user,
        })

        return response
      } catch (error) {
        const normalized = logError('auth.login', error, { email: payload.email })

        this.errors = normalized.errors
        throw normalized
      } finally {
        this.loading = false
      }
    },

    async register(payload) {
      try {
        this.loading = true

        const response = await authService.register(payload)
        const data = unwrapData(response)

        this.persistAuth({
          token: data.token,
          user: data.user,
        })

        return response
      } catch (error) {
        const normalized = logError('auth.register', error, {
          email: payload.email,
          role: payload.role,
        })

        this.errors = normalized.errors
        throw normalized
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      const response = await authService.me()
      const data = unwrapData(response)

      this.user = data.user || data
      this.role = this.user?.role || 'candidate'

      localStorage.setItem('role', this.role)
      localStorage.setItem('user', JSON.stringify(this.user))

      return response
    },

    async verifyToken() {
      if (!this.token) {
        return false
      }

      if (this.verifyingToken) {
        return false
      }

      try {
        this.verifyingToken = true
        const response = await authService.verifyToken()
        const data = unwrapData(response)

        if (!data?.token_valid || !data?.user_exists || !data?.user) {
          await this.logout({ callApi: false })
          return false
        }

        this.persistAuth({
          token: this.token,
          user: data.user,
        })

        return true
      } catch (error) {
        logError('auth.verifyToken', error)
        await this.logout({ callApi: false })
        return false
      } finally {
        this.verifyingToken = false
      }
    },

    async logout({ callApi = true } = {}) {
      if (callApi && this.token) {
        try {
          await authService.logout()
        } catch (error) {
          logError('auth.logout', error)
        }
      }

      this.user = null
      this.token = null
      this.role = 'candidate'
      this.errors = {}
      this.tokenVerified = false
      this.verifyingToken = false

      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      setAuthToken(null)
    },
  },
})
