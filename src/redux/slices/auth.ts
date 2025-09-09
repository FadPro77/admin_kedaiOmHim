import { createSlice } from '@reduxjs/toolkit';

const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true; // treat invalid token as expired
  }
};

const storedToken = localStorage.getItem('token');
const initialToken =
  storedToken && !isTokenExpired(storedToken) ? storedToken : null;

if (!initialToken) {
  localStorage.removeItem('token');
}

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
