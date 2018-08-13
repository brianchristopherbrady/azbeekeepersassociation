
const defaultMessages = {
  unique: () => `values must be unique`,
  required: () => `field is required`,
  pattern: () => `must match pattern`
}

const parseMessage = (message, ...args) => typeof message === 'function'
  ? message(...args)
  : message

export const unique = (items, message) => (value) => {
  if (value == null || value === '') return
  return items.includes(value) &&
  	parseMessage(message || defaultMessages.unique, value, items)
}

export const pattern = (reg, message) => (value) => {
  if (value == null || value === '') return
  return !reg.test(value) &&
  	parseMessage(message || defaultMessages.pattern, value, reg)
}

export const required = (message) => (value) => {
  return (value === '' || value == null) &&
  	parseMessage(message || defaultMessages.required, value)
}
