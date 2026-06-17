import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBookings,
  cancelBooking,
  clearBookingError,
} from "../features/bookings/bookingSlice";
import { fetchSlots } from "../features/slots/slotSlice";

import EmptyState from "../components/EmptyState";
import ShimmerCard from "../components/ShimmerCard";

const Bookings = () => {
  const dispatch = useDispatch();

  const { bookings, loading, actionLoading, error } = useSelector(
    (state) => state.bookings,
  );

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  ).length;

  const handleCancelBooking = async (bookingId) => {
    setSuccessMessage("");
    dispatch(clearBookingError());

    const result = await dispatch(cancelBooking(bookingId));

    if (cancelBooking.fulfilled.match(result)) {
      setSuccessMessage("Booking cancelled successfully.");
      dispatch(fetchBookings());
      dispatch(fetchSlots());
    }
  };

  return (
    <section>
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-medium text-white">
          Admin Booking Management
        </span>

        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
          Customer Bookings
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          View booking details, monitor booking status, and cancel confirmed
          bookings when required.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">Confirmed</p>
          <p className="mt-2 text-3xl font-bold text-green-800">
            {confirmedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">Cancelled</p>
          <p className="mt-2 text-3xl font-bold text-red-800">
            {cancelledCount}
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <EmptyState
          title="No bookings found"
          description="Customer bookings will appear here once users book slots."
        />
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid gap-5">
          {bookings.map((booking) => {
            const slot = booking.slotId;
            const isConfirmed = booking.status === "CONFIRMED";

            return (
              <div
                key={booking._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-950">
                        {booking.customerName}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isConfirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Phone: {booking.phone}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Address: {booking.address}
                    </p>

                    <p className="mt-3 font-semibold text-slate-800">
                      Slot: {slot?.date} | {slot?.startTime} - {slot?.endTime}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={!isConfirmed || actionLoading}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                      isConfirmed
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {isConfirmed ? "Cancel Booking" : "Already Cancelled"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Bookings;
