const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
  style: 'currency',
  currency: 'INR',
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formatSalaryPart = (value) => {
  const trimmed = String(value).trim()
  const numericValue = Number(trimmed.replace(/[^0-9.]/g, ''))

  if (!numericValue) {
    return trimmed
  }

  const multiplier = /k$/i.test(trimmed) ? 1000 : 1

  return rupeeFormatter.format(numericValue * multiplier)
}

export const formatSalary = (salary) => {
  if (!salary) {
    return 'Salary not specified'
  }

  return String(salary)
    .replace(/\$/g, '')
    .split(/\s*-\s*/)
    .map(formatSalaryPart)
    .join(' - ')
}

export const formatDate = (date) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return dateFormatter.format(parsedDate)
}
