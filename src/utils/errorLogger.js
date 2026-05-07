import { normalizeApiError } from './apiResponse'

export const logError = (scope, error, context = {}) => {
  const normalized = normalizeApiError(error)

  console.error(`[${scope}] ${normalized.message}`, {
    status: normalized.status,
    errors: normalized.errors,
    context,
    error: normalized.raw,
  })

  return normalized
}
