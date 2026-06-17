const SlotCard = ({ slot, onBook }) => {
  const availableCount = slot.capacity - slot.bookedCount;
  const isAvailable = slot.isActive && availableCount > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{slot.date}</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">
            {slot.startTime} - {slot.endTime}
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isAvailable ? "Available" : "Full"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Availability</span>
          <span>
            {availableCount} / {slot.capacity} left
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{
              width: `${(slot.bookedCount / slot.capacity) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <button
        onClick={() => onBook(slot)}
        className={`mt-6 w-full rounded-lg py-2.5 font-medium transition ${
          isAvailable
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {isAvailable ? "Book Slot" : "Find Next Available Slot"}
      </button>
    </div>
  );
};

export default SlotCard;
