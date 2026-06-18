import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchBookings,
  cancelBooking,
  clearBookingError,
} from "../features/bookings/bookingSlice";

import { fetchSlots } from "../features/slots/slotSlice";
import EmptyState from "../components/EmptyState";
import ShimmerCard from "../components/ShimmerCard";

const CANCELLATION_CUTOFF_HOURS = 3;

const isSlotExpired = (booking) => {
  if (!booking?.slotId) return true;

  const slotEndDateTime = new Date(
    `${booking.slotId.date}T${booking.slotId.endTime}:00`,
  );

  return slotEndDateTime < new Date();
};

const canCancelBooking = (booking) => {
  if (!booking?.slotId || booking.status === "CANCELLED") return false;
  if (isSlotExpired(booking)) return false;

  const slot = booking.slotId;
  const slotStartDateTime = new Date(`${slot.date}T${slot.startTime}:00`);

  const cancellationDeadline = new Date(
    slotStartDateTime.getTime() - CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000,
  );

  return new Date() <= cancellationDeadline;
};

const BookingCard = ({
  booking,
  isHistory = false,
  actionLoading,
  onCancel,
}) => {
  const slot = booking.slotId;
  const expired = isSlotExpired(booking);
  const isCancelable = canCancelBooking(booking);

  const statusLabel =
    booking.status === "CANCELLED"
      ? "Cancelled"
      : expired
        ? "Expired"
        : "Confirmed";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-slate-950">
              {booking.customerName}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusLabel === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : statusLabel === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          <p className="mt-3 font-semibold text-slate-800">
            {slot?.date} | {slot?.startTime} - {slot?.endTime}
          </p>

          <p className="mt-2 text-sm text-slate-500">{booking.address}</p>

          {!isHistory && (
            <p className="mt-3 text-xs text-slate-500">
              Cancellation is allowed only up to 3 hours before the slot start
              time.
            </p>
          )}
        </div>

        {!isHistory && (
          <button
            onClick={() => onCancel(booking._id)}
            disabled={!isCancelable || actionLoading}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isCancelable
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            {isCancelable ? "Cancel Booking" : "Cancellation Closed"}
          </button>
        )}
      </div>
    </div>
  );
};

const MyBookings = () => {
  const dispatch = useDispatch();

  const { bookings, loading, actionLoading, error } = useSelector(
    (state) => state.bookings,
  );

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const activeBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED" && !isSlotExpired(booking),
  );

  const bookingHistory = bookings.filter(
    (booking) => booking.status === "CANCELLED" || isSlotExpired(booking),
  );

  const handleCancelBooking = async (bookingId) => {
    dispatch(clearBookingError());

    const result = await dispatch(cancelBooking(bookingId));

    if (cancelBooking.fulfilled.match(result)) {
      toast.success("Booking cancelled successfully");
      dispatch(fetchBookings());
      dispatch(fetchSlots());
    }

    if (cancelBooking.rejected.match(result)) {
      toast.error(result.payload?.message || "Unable to cancel booking");
    }
  };

  return (
    <section>
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
          My Bookings
        </span>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Your Delivery Bookings
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          View active delivery bookings and track cancelled or expired bookings
          in history.
        </p>
      </div>

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

      {!loading && (
        <>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-950">
                  Active Bookings
                </h3>
                <p className="text-sm text-slate-500">
                  Upcoming confirmed delivery slots.
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                {activeBookings.length}
              </span>
            </div>

            {activeBookings.length === 0 ? (
              <EmptyState
                title="No active bookings"
                description="Your upcoming confirmed bookings will appear here."
              />
            ) : (
              <div className="grid gap-5">
                {activeBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    actionLoading={actionLoading}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-950">
                  Booking History
                </h3>
                <p className="text-sm text-slate-500">
                  Cancelled and expired bookings are shown here.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-600">
                {bookingHistory.length}
              </span>
            </div>

            {bookingHistory.length === 0 ? (
              <EmptyState
                title="No booking history"
                description="Cancelled or expired bookings will appear here."
              />
            ) : (
              <div className="grid gap-5">
                {bookingHistory.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    isHistory
                    actionLoading={actionLoading}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default MyBookings;
