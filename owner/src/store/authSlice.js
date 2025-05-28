import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    return serializedState ? JSON.parse(serializedState) : {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    };
  } catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    };
  }
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      // Clear localStorage on logout
      localStorage.removeItem('authState');
    },
    initializeAuth(state, action) {
      // For initializing auth state on app load
      return { ...state, ...action.payload };
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;