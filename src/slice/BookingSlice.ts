import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Vehicle } from '../types/types'

interface BookingState {
    currentBooking: {
        vehicle: Vehicle | null
        startDate: string
        endDate: string
        totalCost: number
    }
    bookings: string[]
    loading: boolean
}

const initialState: BookingState = {
    currentBooking: {
        vehicle: null,
        startDate: '',
        endDate: '',
        totalCost: 0
    },
    bookings: [],
    loading: false,
}

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        // Add to booking
        addToBooking: (state, action: PayloadAction<{
            vehicle: Vehicle
            startDate: string
            endDate: string
            totalCost: number
        }>) => {
            state.currentBooking = action.payload
        },
        // Clear booking
        clearBooking: (state) => {
            state.currentBooking = initialState.currentBooking
        },
        // Set bookings
        setBookings: (state, action: PayloadAction<string[]>) => {
            state.bookings = action.payload
        },
        // Set loading
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
})

export const { addToBooking, clearBooking, setBookings, setLoading } = bookingSlice.actions
export default bookingSlice.reducer