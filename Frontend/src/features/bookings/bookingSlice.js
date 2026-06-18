import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/bookings");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, thunkAPI) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || "Failed to create booking",
        suggestedSlot: error.response?.data?.suggestedSlot || null,
      });
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (bookingId, thunkAPI) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking",
      );
    }
  },
);

export const getSmartRecommendation = createAsyncThunk(
  "bookings/getSmartRecommendation",
  async (address, thunkAPI) => {
    try {
      const response = await api.post("/bookings/recommend", {
        address,
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch smart recommendation",
      );
    }
  },
);

const bookingSlice = createSlice({
  name: "bookings",

  initialState: {
    bookings: [],
    loading: false,
    actionLoading: false,
    error: null,
    suggestedSlot: null,
    smartRecommendation: null,
    recommendationLoading: false,
  },

  reducers: {
    clearBookingError: (state) => {
      state.error = null;
      state.suggestedSlot = null;
    },
    clearSmartRecommendation: (state) => {
      state.smartRecommendation = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.suggestedSlot = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || "Failed to create booking";
        state.suggestedSlot = action.payload?.suggestedSlot || null;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.bookings.findIndex(
          (booking) => booking._id === action.payload._id,
        );

        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(getSmartRecommendation.pending, (state) => {
        state.recommendationLoading = true;
      })
      .addCase(getSmartRecommendation.fulfilled, (state, action) => {
        state.recommendationLoading = false;
        state.smartRecommendation = action.payload;
      })
      .addCase(getSmartRecommendation.rejected, (state) => {
        state.recommendationLoading = false;
        state.smartRecommendation = null;
      });
  },
});

export const { clearBookingError, clearSmartRecommendation } =
  bookingSlice.actions;
export default bookingSlice.reducer;
