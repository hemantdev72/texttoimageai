import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const generateImage = createAsyncThunk(
  'image/generate',
  async (prompt, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      console.log('generateImage - Token:', token);
      const response = await axios.post(
        'https://texttoimageai-0jny.onrender.com/api/image/generate-image',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('generateImage - Response:', response.data);

      if (response.data.success) {
        // Update credits in the user state
        return response.data.resultImage;
      } else {
        return rejectWithValue(response.data.message || 'Failed to generate image');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate image');
    }
  }
);

const initialState = {
  generatedImage: null,
  isImageLoaded: false,
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    resetImage: (state) => {
      state.isImageLoaded = false;
    },
    clearImageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedImage = action.payload;
        state.isImageLoaded = true;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetImage, clearImageError } = imageSlice.actions;
export default imageSlice.reducer;