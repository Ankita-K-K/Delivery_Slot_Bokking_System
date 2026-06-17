import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-950">
                  Capacity Overview
                </h3>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm text-slate-600">
                    <span>Capacity Used</span>
                    <span>
                      {totalBooked} / {totalCapacity}
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                      style={{
                        width:
                          totalCapacity === 0
                            ? "0%"
                            : `${(totalBooked / totalCapacity) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    {totalCapacity === 0
                      ? "No active capacity available yet."
                      : `${Math.round(
                          (totalBooked / totalCapacity) * 100,
                        )}% of available delivery capacity is currently booked.`}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-950">
                  Quick Actions
                </h3>

                <div className="mt-5 grid gap-3">
                  <Link
                    to="/admin/slots"
                    className="rounded-2xl bg-slate-900 px-5 py-4 text-center font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Create New Slot
                  </Link>

                  <Link
                    to="/admin/bookings"
                    className="rounded-2xl border border-slate-200 px-5 py-4 text-center font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    View All Bookings
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">
                Slots Near Capacity
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {activeSlots
                  .filter((slot) => slot.capacity > 0)
                  .sort(
                    (a, b) =>
                      b.bookedCount / b.capacity - a.bookedCount / a.capacity,
                  )
                  .slice(0, 4)
                  .map((slot) => {
                    const usage = Math.round(
                      (slot.bookedCount / slot.capacity) * 100,
                    );

                    return (
                      <div
                        key={slot._id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-950">
                              {slot.date}
                            </p>
                            <p className="text-sm text-slate-500">
                              {slot.startTime} - {slot.endTime}
                            </p>
                          </div>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                            {usage}%
                          </span>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${usage}%` }}
                          ></div>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {slot.bookedCount} of {slot.capacity} booked
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminDashboard;
