import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://texttoimageai-0jny.onrender.com/api/user/login', {
        email,
        password
      });
    
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://texttoimageai-0jny.onrender.com/api/user/register', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);


const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  showLogin: false,
};

console.log('UserSlice - Initial state:', initialState);
console.log('UserSlice - localStorage token:', localStorage.getItem('token'));
console.log('UserSlice - localStorage user:', localStorage.getItem('user'));



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      console.log('Logout - State cleared, localStorage cleared');
    },
    toggleLogin: (state) => {
      state.showLogin = !state.showLogin;
    },
    setShowLogin: (state, action) => {
      state.showLogin = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.showLogin = false;
       
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
       
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
       
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, toggleLogin, setShowLogin, clearError } = userSlice.actions;
export default userSlice.reducer;