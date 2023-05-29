/* eslint-disable no-console */
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test' || process.env.LOGS === 'true') {
    console.log('🟢', ...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test' || process.env.LOGS === 'true') {
    console.error('🔴', ...params)
  }
}

module.exports = {
  info,
  error,
}
