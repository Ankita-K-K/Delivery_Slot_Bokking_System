import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchSlots = createAsyncThunk(
  "slots/fetchSlots",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/slots");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch slots",
      );
    }
  },
);

export const createSlot = createAsyncThunk(
  "slots/createSlot",
  async (slotData, thunkAPI) => {
    try {
      const response = await api.post("/slots", slotData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create slot",
      );
    }
  },
);

export const updateSlot = createAsyncThunk(
  "slots/updateSlot",
  async ({ slotId, slotData }, thunkAPI) => {
    try {
      const response = await api.patch(`/slots/${slotId}`, slotData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update slot",
      );
    }
  },
);

export const disableSlot = createAsyncThunk(
  "slots/disableSlot",
  async (slotId, thunkAPI) => {
    try {
      const response = await api.delete(`/slots/${slotId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to disable slot",
      );
    }
  },
);

const slotSlice = createSlice({
  name: "slots",

  initialState: {
    slots: [],
    loading: false,
    actionLoading: false,
    error: null,
  },

  reducers: {
    clearSlotError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSlot.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createSlot.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.slots.push(action.payload);
      })
      .addCase(createSlot.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateSlot.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateSlot.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.slots.findIndex(
          (slot) => slot._id === action.payload._id,
        );

        if (index !== -1) {
          state.slots[index] = action.payload;
        }
      })
      .addCase(updateSlot.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(disableSlot.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(disableSlot.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.slots.findIndex(
          (slot) => slot._id === action.payload._id,
        );

        if (index !== -1) {
          state.slots[index] = action.payload;
        }
      })
      .addCase(disableSlot.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSlotError } = slotSlice.actions;

export default slotSlice.reducer;
