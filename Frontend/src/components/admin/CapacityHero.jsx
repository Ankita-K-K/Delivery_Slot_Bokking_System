import { Link } from "react-router-dom";

const CapacityHero = ({
  usagePercent,
  totalCapacity,
  confirmedBookings,
  activeSlots,
}) => {
  const slotsAtRisk = activeSlots.filter(
    (slot) => slot.capacity > 0 && slot.bookedCount / slot.capacity >= 0.8,
  ).length;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.5fr_0.8fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-blue-100 ring-1 ring-white/20">
            Admin Overview
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Delivery Operations Dashboard
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Track slot availability, booking activity, and delivery capacity
            from one clean admin console.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin/slots"
              className="rounded-2xl bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-100"
            >
              Create Slot
            </Link>

            <Link
              to="/admin/bookings"
              className="rounded-2xl border border-white/20 px-5 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              View Bookings
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Total Capacity</p>
              <p className="mt-2 text-2xl font-bold">{totalCapacity}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Slots At Risk</p>
              <p className="mt-2 text-2xl font-bold">{slotsAtRisk}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Active Bookings</p>
              <p className="mt-2 text-2xl font-bold">
                {confirmedBookings.length}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: `conic-gradient(#60a5fa ${
                usagePercent * 3.6
              }deg, rgba(255,255,255,0.12) 0deg)`,
            }}
          />

          <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-950">
            <p className="text-4xl font-bold">{usagePercent}%</p>
            <p className="text-sm text-slate-400">Capacity Used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityHero;
