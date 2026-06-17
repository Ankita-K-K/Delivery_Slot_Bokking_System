import { configureStore } from "@reduxjs/toolkit";
import slotReducer from "../features/slots/slotSlice";
import bookingReducer from "../features/bookings/bookingSlice";

export const store = configureStore({
  reducer: {
    slots: slotReducer,
    bookings: bookingReducer,
  },
});
