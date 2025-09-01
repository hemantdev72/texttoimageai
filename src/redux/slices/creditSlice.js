import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const getCredit = createAsyncThunk(
  'credit/getCredit',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      
   
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      
      
      const headers = {
        Authorization: `Bearer ${token}`,
      };
     
      
      const response = await axios.get(
        'https://texttoimageai-0jny.onrender.com/api/user/credit',
        { headers }
      );
      console.log('getCredit - Response:', response.data);

      return response.data.credits;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get credit');
    }
  }
);


export const razorpayPayment = createAsyncThunk(
  'credit/razorpayPayment',
  async (plan, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(
        'https://texttoimageai-0jny.onrender.com/api/user/razor-pay',
        { plan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment initialization failed');
    }
  }
);


export const verifyRazorpay = createAsyncThunk(
  'credit/verifyRazorpay',
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(
        'https://texttoimageai-0jny.onrender.com/api/user/verify-pay',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

const initialState = {
  credit: 0,
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null,
  paymentSuccess: false,
  orderData: null,
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    clearCreditError: (state) => {
      state.error = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentError = null;
      state.paymentSuccess = false;
      state.orderData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getCredit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCredit.fulfilled, (state, action) => {
        state.loading = false;
        state.credit = action.payload;
      })
      .addCase(getCredit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Razorpay payment cases
      .addCase(razorpayPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(razorpayPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.orderData = action.payload;
      })
      .addCase(razorpayPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      
      .addCase(verifyRazorpay.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(verifyRazorpay.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentSuccess = true;
        state.credit = action.payload.credits || state.credit;
      })
      .addCase(verifyRazorpay.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });
  },
});

export const { clearCreditError, clearPaymentStatus } = creditSlice.actions;
export default creditSlice.reducer;