import { createListenerMiddleware } from '@reduxjs/toolkit'

export default createListenerMiddleware({
  onError: (...args) => console.error('Error in listenerMiddleware', args),
})
