import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchSlots } from "../features/slots/slotSlice";
import {
  createBooking,
  clearBookingError,
  getSmartRecommendation,
  clearSmartRecommendation,
} from "../features/bookings/bookingSlice";

import SlotCard from "../components/SlotCard";
import ShimmerCard from "../components/ShimmerCard";
import EmptyState from "../components/EmptyState";
import BookingForm from "../components/BookingForm";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [addressForRecommendation, setAddressForRecommendation] = useState("");

  const { slots, loading, error } = useSelector((state) => state.slots);

  const {
    actionLoading,
    error: bookingError,
    suggestedSlot,
    smartRecommendation,
    recommendationLoading,
  } = useSelector((state) => state.bookings);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchSlots());
  }, [dispatch]);

  useEffect(() => {
    const cleanAddress = addressForRecommendation.trim();

    if (cleanAddress.length < 8) {
      dispatch(clearSmartRecommendation());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(getSmartRecommendation(cleanAddress));
    }, 800);

    return () => clearTimeout(timer);
  }, [addressForRecommendation, dispatch]);

  const activeSlots = slots.filter((slot) => slot.isActive);

  const availableSlots = activeSlots.filter(
    (slot) => slot.bookedCount < slot.capacity,
  );

  const handleBookSlot = (slot) => {
    setSuccessMessage("");
    dispatch(clearBookingError());
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setAddressForRecommendation("");
    dispatch(clearBookingError());
    dispatch(clearSmartRecommendation());
  };

  const handleSubmitBooking = async (bookingData) => {
    const result = await dispatch(createBooking(bookingData));

    if (createBooking.fulfilled.match(result)) {
      toast.success("Delivery slot booked successfully");
      setSelectedSlot(null);
      dispatch(fetchSlots());
    }
    if (createBooking.rejected.match(result)) {
      toast.error(result.payload?.message || "Unable to create booking");
    }
  };

  const handleUseSuggestedSlot = (slot) => {
    dispatch(clearBookingError());
    dispatch(clearSmartRecommendation());
    setSelectedSlot(slot);
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
          <p className="text-sm text-slate-500">Available Slots</p>
          <p className="text-3xl font-bold text-slate-950">
            {availableSlots.length}
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

      {selectedSlot && (
        <BookingForm
          slot={selectedSlot}
          onClose={handleCloseModal}
          onSubmit={handleSubmitBooking}
          actionLoading={actionLoading}
          error={bookingError}
          suggestedSlot={suggestedSlot}
          onUseSuggestedSlot={handleUseSuggestedSlot}
          smartRecommendation={smartRecommendation}
          recommendationLoading={recommendationLoading}
          onAddressChangeForRecommendation={setAddressForRecommendation}
        />
      )}
    </section>
  );
};

export default Dashboard;
