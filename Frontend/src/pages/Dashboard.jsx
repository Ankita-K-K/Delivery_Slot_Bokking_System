import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlots } from "../features/slots/slotSlice";
import SlotCard from "../components/SlotCard";
import ShimmerCard from "../components/ShimmerCard";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { slots, loading, error } = useSelector((state) => state.slots);

  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    dispatch(fetchSlots());
  }, [dispatch]);

  const activeSlots = slots.filter((slot) => slot.isActive);

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    console.log("Selected slot:", slot);
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
            Availability updates based on current slot capacity.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Active Slots</p>
          <p className="text-3xl font-bold text-slate-950">
            {activeSlots.length}
          </p>
        </div>
      </div>

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
          description="Please check again later. Currently, there are no available delivery slots."
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
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-blue-900">Selected Slot</p>
          <p className="mt-1 text-blue-700">
            {selectedSlot.date} | {selectedSlot.startTime} -{" "}
            {selectedSlot.endTime}
          </p>
          <p className="mt-2 text-sm text-blue-600">
            Booking form will be connected in the next step.
          </p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
