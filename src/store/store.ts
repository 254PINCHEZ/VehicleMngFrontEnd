import { configureStore } from '@reduxjs/toolkit'
import { vehicleApi } from '../API/VehicleAPI'
import { authApi } from '../API/AuthApi'
import authSlice from '../slice/Authslice'
import bookingSlice from '../slice/BookingSlice'
import storage from 'redux-persist/lib/storage'
import { 
  persistReducer, 
  persistStore, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist'
import { bookingApi } from '../API/BookingAPI'
import { paymentApi } from '../API/PaymentAPI'
import { ticketApi } from '../API/ticketAPi'
import { userApi } from '../API/UserAPI'

// Configure the Redux store
const authPersistConfig = {
  key: 'auth',
  storage,
  version: 1,
  whitelist: ['token', 'isAuthenticated', 'user'],
}

// Create the persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice)

export const store = configureStore({
  reducer: {
    // Add the API reducers
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [userApi.reducerPath]: userApi.reducer,

    // Add the slice reducers
    auth: persistedAuthReducer,
    booking: bookingSlice, // Changed from bookingSlice to booking for consistency
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      vehicleApi.middleware,
      authApi.middleware,
      bookingApi.middleware,
      paymentApi.middleware,
      ticketApi.middleware,
      userApi.middleware
    ),
})

export const persistor = persistStore(store)

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch