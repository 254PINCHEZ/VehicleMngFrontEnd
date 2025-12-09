import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type{ AuthState, User } from '../types/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string, user: any }>) => {           
            
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            
            // Store in localStorage
            localStorage.setItem('auth_token', action.payload.token);
            localStorage.setItem('user', JSON.stringify( action.payload.user));
        },
            logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.loading = false;
            
            // // Clear localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        },


    // logout: (state) => {
    //   state.user = null;
    //   state.token = null;
    //   state.isAuthenticated = false;
    //   localStorage.removeItem('token');
    // },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions;
export default authSlice.reducer;