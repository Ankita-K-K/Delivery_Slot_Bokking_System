const SlotsNearCapacity = ({ activeSlots }) => {
  const nearCapacitySlots = activeSlots
    .filter((slot) => slot.capacity > 0)
    .sort((a, b) => b.bookedCount / b.capacity - a.bookedCount / a.capacity)
    .slice(0, 5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-950">Slots Near Capacity</h3>
      <p className="mt-1 text-sm text-slate-500">
        Highest utilized active delivery slots.
      </p>

      <div className="mt-6 space-y-4">
        {nearCapacitySlots.length === 0 ? (
          <p className="text-sm text-slate-500">
            No active slots available yet.
          </p>
        ) : (
          nearCapacitySlots.map((slot) => {
            const usage = Math.round((slot.bookedCount / slot.capacity) * 100);

            return (
              <div
                key={slot._id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{slot.date}</p>
                    <p className="text-sm text-slate-500">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-700 shadow-sm">
                    {usage}%
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    style={{ width: `${usage}%` }}
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {slot.bookedCount} of {slot.capacity} booked
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SlotsNearCapacity;
