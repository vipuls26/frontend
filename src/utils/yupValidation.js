export const yupErrorsToObject = (error) =>
  error.inner.reduce((errors, item) => {
    if (item.path && !errors[item.path]) {
      errors[item.path] = item.message
    }

    return errors
  }, {})

export const validateSchema = async (schema, values) => {
  try {
    await schema.validate(values, {
      abortEarly: false,
    })

    return {
      valid: true,
      errors: {},
    }
  } catch (error) {
    return {
      valid: false,
      errors: yupErrorsToObject(error),
    }
  }
}
