import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

let unauthorizedHandler = null

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler
}

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete axios.defaults.headers.common.Authorization
  delete api.defaults.headers.common.Authorization
}

setAuthToken(localStorage.getItem('token'))

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      await unauthorizedHandler?.()
    }

    return Promise.reject(error)
  },
)

export default api
