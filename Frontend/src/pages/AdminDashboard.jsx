import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSlots } from "../features/slots/slotSlice";
import { fetchBookings } from "../features/bookings/bookingSlice";
import ShimmerCard from "../components/ShimmerCard";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { slots, loading: slotsLoading } = useSelector((state) => state.slots);
  const { bookings, loading: bookingsLoading } = useSelector(
    (state) => state.bookings,
  );

  useEffect(() => {
    dispatch(fetchSlots());
    dispatch(fetchBookings());
  }, [dispatch]);

  const activeSlots = slots.filter((slot) => slot.isActive);

  const availableSlots = activeSlots.filter(
    (slot) => slot.bookedCount < slot.capacity,
  );

  const fullSlots = activeSlots.filter(
    (slot) => slot.bookedCount >= slot.capacity,
  );

  const disabledSlots = slots.filter((slot) => !slot.isActive);

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  );

  const totalCapacity = activeSlots.reduce(
    (sum, slot) => sum + slot.capacity,
    0,
  );

  const totalBooked = activeSlots.reduce(
    (sum, slot) => sum + slot.bookedCount,
    0,
  );

  const loading = slotsLoading || bookingsLoading;

  const stats = [
    {
      label: "Total Slots",
      value: slots.length,
      description: "All created slots",
      style: "border-slate-200 bg-white text-slate-950",
    },
    {
      label: "Available Slots",
      value: availableSlots.length,
      description: "Active slots with capacity left",
      style: "border-green-200 bg-green-50 text-green-800",
    },
    {
      label: "Full Slots",
      value: fullSlots.length,
      description: "Slots that reached capacity",
      style: "border-red-200 bg-red-50 text-red-800",
    },
    {
      label: "Disabled Slots",
      value: disabledSlots.length,
      description: "Soft-deleted slots",
      style: "border-slate-200 bg-slate-50 text-slate-700",
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      description: "All booking records",
      style: "border-blue-200 bg-blue-50 text-blue-800",
    },
    {
      label: "Confirmed",
      value: confirmedBookings.length,
      description: "Currently active bookings",
      style: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    {
      label: "Cancelled",
      value: cancelledBookings.length,
      description: "Cancelled booking records",
      style: "border-orange-200 bg-orange-50 text-orange-800",
    },
    {
      label: "Capacity Used",
      value:
        totalCapacity === 0
          ? "0%"
          : `${Math.round((totalBooked / totalCapacity) * 100)}%`,
      description: `${totalBooked} of ${totalCapacity} capacity booked`,
      style: "border-indigo-200 bg-indigo-50 text-indigo-800",
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-medium text-white">
          Admin Overview
        </span>

        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
          Delivery Operations Dashboard
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          Monitor slot availability, capacity usage, and booking activity from
          one admin view.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-3xl border p-5 shadow-sm ${stat.style}`}
              >
                <p className="text-sm font-medium opacity-80">{stat.label}</p>

                <p className="mt-3 text-4xl font-bold">{stat.value}</p>

                <p className="mt-2 text-sm opacity-70">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">Slot Health</h3>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>Capacity Used</span>
                    <span>
                      {totalBooked} / {totalCapacity}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width:
                          totalCapacity === 0
                            ? "0%"
                            : `${(totalBooked / totalCapacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm text-slate-500">
                  This metric is calculated from all active slots and helps
                  monitor booking load.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">System Notes</h3>

              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li>
                  • Overbooking is prevented using atomic MongoDB updates.
                </li>
                <li>
                  • Full slots automatically suggest the next available slot.
                </li>
                <li>• Cancelled bookings release slot capacity.</li>
                <li>• Slots are soft-deleted and can be reactivated.</li>
                <li>• Cancellation is blocked within 3 hours of slot start.</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminDashboard;
