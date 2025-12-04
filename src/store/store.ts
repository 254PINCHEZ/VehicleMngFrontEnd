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

// Import the additional APIs from your first example
import { dashboardDataApi } from '../API/dashboardDataApi'
import { analyticsApi } from '../API/analyticsApi'
import { supportApi } from '../API/supportAPi'
import { settingsApi } from '../API/settingsAPi'

// Import the new paymentHistoryApi
import { paymentHistoryApi } from '../API/paymentHistoryApi'  // Add this import

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
    // Add the API reducers from your existing setup
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    
    // Add the additional API reducers from your first example
    [dashboardDataApi.reducerPath]: dashboardDataApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,

    // Add the new paymentHistoryApi reducer
    [paymentHistoryApi.reducerPath]: paymentHistoryApi.reducer,  // Add this line

    // Add the slice reducers
    auth: persistedAuthReducer,
    booking: bookingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // Your existing API middlewares
      vehicleApi.middleware,
      authApi.middleware,
      bookingApi.middleware,
      paymentApi.middleware,
      ticketApi.middleware,
      userApi.middleware,
      
      // Additional API middlewares from your first example
      dashboardDataApi.middleware,
      analyticsApi.middleware,
      supportApi.middleware,
      settingsApi.middleware,

      // Add the new paymentHistoryApi middleware
      paymentHistoryApi.middleware  // Add this line
    ),
})

export const persistor = persistStore(store)

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch