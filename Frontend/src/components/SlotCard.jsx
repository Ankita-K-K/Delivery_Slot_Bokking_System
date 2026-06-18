const isSlotExpired = (slot) => {
  const slotEndDateTime = new Date(`${slot.date}T${slot.endTime}:00`);
  return slotEndDateTime < new Date();
};

const SlotCard = ({ slot, onBook }) => {
  const availableCount = slot.capacity - slot.bookedCount;
  const expired = isSlotExpired(slot);

  const isAvailable = slot.isActive && availableCount > 0 && !expired;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {new Date(slot.date).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          <h3 className="mt-1 text-xl font-bold text-gray-900">
            {slot.startTime} - {slot.endTime}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            expired
              ? "bg-red-100 text-red-700"
              : isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {expired ? "Expired" : isAvailable ? "Available" : "Full"}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Availability</span>
          <span>
            {Math.max(availableCount, 0)} / {slot.capacity} left
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${
              expired
                ? "bg-gray-300"
                : isAvailable
                  ? "bg-blue-600"
                  : "bg-amber-500"
            }`}
            style={{
              width: `${Math.min(
                (slot.bookedCount / slot.capacity) * 100,
                100,
              )}%`,
            }}
          ></div>
        </div>
      </div>

      <button
        disabled={expired}
        onClick={() => onBook(slot)}
        className={`mt-6 w-full rounded-lg py-2.5 font-medium transition ${
          expired
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : isAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {expired
          ? "Slot Expired"
          : isAvailable
            ? "Book Slot"
            : "Find Next Available Slot"}
      </button>
    </div>
  );
};

export default SlotCard;
