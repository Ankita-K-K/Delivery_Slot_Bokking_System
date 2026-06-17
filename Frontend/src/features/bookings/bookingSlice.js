import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",

  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },

  reducers: {},
});

export default bookingSlice.reducer;
