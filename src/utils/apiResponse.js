export const createApiResponseError = (response) => {
  const error = new Error(formatErrorMessage(response.data?.message || 'Request failed.'))

  error.response = response

  return error
}

export const formatErrorMessage = (error, fallback = '') => {
  if (!error) {
    return fallback
  }

  if (Array.isArray(error)) {
    return error.filter(Boolean).join(' ')
  }

  if (typeof error === 'object') {
    return Object.values(error).flat().filter(Boolean).join(' ')
  }

  return String(error)
}

export const unwrapData = (response) => {
  if (response.data?.success === false) {
    throw createApiResponseError(response)
  }

  return response.data?.data
}

export const normalizeApiError = (error, fallback = 'Something went wrong.') => ({
  message: formatErrorMessage(error.response?.data?.message || error.message, fallback),
  status: error.response?.status,
  errors: error.response?.data?.errors || {},
  raw: error,
})
