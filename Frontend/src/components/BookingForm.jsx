import { useState } from "react";

const BookingForm = ({
  slot,
  onClose,
  onSubmit,
  actionLoading,
  error,
  suggestedSlot,
  onUseSuggestedSlot,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      slotId: slot._id,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Confirm Delivery Slot
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">
              {slot.startTime} - {slot.endTime}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{slot.date}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">{error}</p>

            {suggestedSlot && (
              <div className="mt-3 rounded-xl bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Suggested Next Available Slot
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {suggestedSlot.date} | {suggestedSlot.startTime} -{" "}
                  {suggestedSlot.endTime}
                </p>

                <button
                  type="button"
                  onClick={() => onUseSuggestedSlot(suggestedSlot)}
                  className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 transition"
                >
                  Book Suggested Slot
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter delivery address"
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {actionLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
