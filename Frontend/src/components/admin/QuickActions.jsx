import { Link } from "react-router-dom";

const QuickActions = ({
  mostUtilizedSlot,
  nextAvailableSlot,
  confirmedBookings,
  cancelledBookings,
  totalBookings,
}) => {
  const cancellationRate =
    totalBookings === 0
      ? 0
      : Math.round((cancelledBookings.length / totalBookings) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-950">Quick Actions</h3>

        <div className="mt-6 grid gap-4">
          <Link
            to="/admin/slots"
            className="rounded-3xl bg-blue-600 p-5 text-white hover:bg-blue-700 transition"
          >
            <p className="text-lg font-bold">Create New Slot</p>
            <p className="mt-1 text-sm text-blue-100">
              Add delivery windows and capacity.
            </p>
          </Link>

          <Link
            to="/admin/bookings"
            className="rounded-3xl border border-slate-200 p-5 hover:bg-slate-50 transition"
          >
            <p className="text-lg font-bold text-slate-950">Manage Bookings</p>
            <p className="mt-1 text-sm text-slate-500">
              View customers and cancel bookings.
            </p>
          </Link>

          <Link
            to="/"
            className="rounded-3xl border border-slate-200 p-5 hover:bg-slate-50 transition"
          >
            <p className="text-lg font-bold text-slate-950">Open User View</p>
            <p className="mt-1 text-sm text-slate-500">
              Test the customer booking experience.
            </p>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
        <h3 className="text-xl font-bold">Operational Insights</h3>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-slate-400">Most Utilized Slot</p>
            {mostUtilizedSlot ? (
              <>
                <p className="mt-1 font-semibold">
                  {mostUtilizedSlot.date} | {mostUtilizedSlot.startTime} -{" "}
                  {mostUtilizedSlot.endTime}
                </p>
                <p className="text-sm text-blue-300">
                  {Math.round(
                    (mostUtilizedSlot.bookedCount / mostUtilizedSlot.capacity) *
                      100,
                  )}
                  % capacity used
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-slate-300">No slot data yet</p>
            )}
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="text-sm text-slate-400">Next Available Slot</p>
            {nextAvailableSlot ? (
              <p className="mt-1 font-semibold">
                {nextAvailableSlot.date} | {nextAvailableSlot.startTime} -{" "}
                {nextAvailableSlot.endTime}
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-300">
                No available slots right now
              </p>
            )}
          </div>

          <div className="h-px bg-white/10" />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-400">Active Bookings</p>
              <p className="mt-2 text-2xl font-bold">
                {confirmedBookings.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-400">Cancellation Rate</p>
              <p className="mt-2 text-2xl font-bold">{cancellationRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
