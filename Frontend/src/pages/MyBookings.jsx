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

const CANCELLATION_CUTOFF_HOURS = 3;

const canCancelBooking = (booking) => {
  if (!booking?.slotId || booking.status === "CANCELLED") return false;

  const slot = booking.slotId;
  const slotStartDateTime = new Date(`${slot.date}T${slot.startTime}:00`);
  const cancellationDeadline = new Date(
    slotStartDateTime.getTime() - CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000,
  );

  return new Date() <= cancellationDeadline;
};

const MyBookings = () => {
  const dispatch = useDispatch();

  const { bookings, loading, actionLoading, error } = useSelector(
    (state) => state.bookings,
  );

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  );

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
        <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
          My Bookings
        </span>

        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
          Your Delivery Bookings
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          View your confirmed bookings and cancel them before the cancellation
          cutoff window closes.
        </p>
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
          {Array.from({ length: 3 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      )}

      {!loading && confirmedBookings.length === 0 && (
        <EmptyState
          title="No confirmed bookings"
          description="Your active bookings will appear here after you book a delivery slot."
        />
      )}

      {!loading && confirmedBookings.length > 0 && (
        <div className="grid gap-5">
          {confirmedBookings.map((booking) => {
            const slot = booking.slotId;
            const isCancelable = canCancelBooking(booking);

            return (
              <div
                key={booking._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Booking for
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-950">
                      {booking.customerName}
                    </h3>

                    <p className="mt-3 font-semibold text-slate-800">
                      {slot?.date} | {slot?.startTime} - {slot?.endTime}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {booking.address}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Cancellation is allowed only up to 3 hours before the slot
                      start time.
                    </p>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={!isCancelable || actionLoading}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                      isCancelable
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {isCancelable ? "Cancel Booking" : "Cancellation Closed"}
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

export default MyBookings;
