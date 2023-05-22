import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './notificationsSlice'
import authReducer from './authSlice'
import postReducer from './postSlice'

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    auth: authReducer,
    post: postReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  preloadedState: undefined // optional, can be any valid state object
})
