import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().trim().email('Enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export const registerSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email('Enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup
    .string()
    .oneOf(['candidate', 'recruiter'], 'Select a valid role')
    .required('Role is required'),
})
