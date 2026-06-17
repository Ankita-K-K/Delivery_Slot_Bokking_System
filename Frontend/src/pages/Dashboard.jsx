import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSlots } from "../features/slots/slotSlice";
import {
  createBooking,
  fetchBookings,
  cancelBooking,
  clearBookingError,
} from "../features/bookings/bookingSlice";

import SlotCard from "../components/SlotCard";
import ShimmerCard from "../components/ShimmerCard";
import EmptyState from "../components/EmptyState";
import BookingForm from "../components/BookingForm";

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

const Dashboard = () => {
  const dispatch = useDispatch();

  const { slots, loading, error } = useSelector((state) => state.slots);

  const {
    bookings,
    actionLoading,
    error: bookingError,
    suggestedSlot,
  } = useSelector((state) => state.bookings);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchSlots());
    dispatch(fetchBookings());
  }, [dispatch]);

  const activeSlots = slots.filter((slot) => slot.isActive);
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  );

  const handleBookSlot = (slot) => {
    setSuccessMessage("");
    dispatch(clearBookingError());
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    dispatch(clearBookingError());
  };

  const handleSubmitBooking = async (bookingData) => {
    const result = await dispatch(createBooking(bookingData));

    if (createBooking.fulfilled.match(result)) {
      setSuccessMessage("Your delivery slot has been booked successfully.");
      setSelectedSlot(null);
      dispatch(fetchSlots());
      dispatch(fetchBookings());
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const result = await dispatch(cancelBooking(bookingId));

    if (cancelBooking.fulfilled.match(result)) {
      setSuccessMessage("Booking cancelled successfully.");
      dispatch(fetchSlots());
      dispatch(fetchBookings());
    }
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            User Booking Portal
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Available Delivery Slots
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Choose a convenient delivery slot and complete your booking.
            Cancellation is allowed up to 3 hours before the slot start time.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Active Slots</p>
          <p className="text-3xl font-bold text-slate-950">
            {activeSlots.length}
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      {bookingError && !selectedSlot && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {bookingError}
        </div>
      )}

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && activeSlots.length === 0 && (
        <EmptyState
          title="No active delivery slots"
          description="Please check again later. Currently, there are no active delivery slots."
        />
      )}

      {!loading && !error && activeSlots.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeSlots.map((slot) => (
            <SlotCard key={slot._id} slot={slot} onBook={handleBookSlot} />
          ))}
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-slate-950">Your Bookings</h3>
        <p className="mt-2 text-slate-600">
          Confirmed bookings can be cancelled before the cancellation cutoff.
        </p>

        {confirmedBookings.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No confirmed bookings"
              description="Your active bookings will appear here after booking a slot."
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {confirmedBookings.map((booking) => {
              const slot = booking.slotId;
              const isCancelable = canCancelBooking(booking);

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {booking.customerName}
                      </p>

                      <h4 className="mt-1 text-lg font-bold text-slate-950">
                        {slot?.date} | {slot?.startTime} - {slot?.endTime}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        {booking.address}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Cancellation allowed until 3 hours before slot start.
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
      </div>

      {selectedSlot && (
        <BookingForm
          slot={selectedSlot}
          onClose={handleCloseModal}
          onSubmit={handleSubmitBooking}
          actionLoading={actionLoading}
          error={bookingError}
          suggestedSlot={suggestedSlot}
        />
      )}
    </section>
  );
};

export default Dashboard;
