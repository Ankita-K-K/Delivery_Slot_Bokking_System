import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createSlot,
  fetchSlots,
  disableSlot,
  clearSlotError,
} from "../features/slots/slotSlice";

import ShimmerCard from "../components/ShimmerCard";
import EmptyState from "../components/EmptyState";

const CreateSlot = () => {
  const dispatch = useDispatch();

  const { slots, loading, actionLoading, error } = useSelector(
    (state) => state.slots,
  );

  const [validationError, setValidationError] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchSlots());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      capacity: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setValidationError("");
    dispatch(clearSlotError());

    const validationMessage = validateSlot();

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    const result = await dispatch(
      createSlot({
        ...formData,
        capacity: Number(formData.capacity),
      }),
    );

    if (createSlot.fulfilled.match(result)) {
      setSuccessMessage("Slot created or reactivated successfully.");
      resetForm();
      dispatch(fetchSlots());
    }
  };

  const validateSlot = () => {
    if (
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.capacity
    ) {
      return "All fields are required";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Cannot create slot for a past date";
    }

    if (formData.startTime >= formData.endTime) {
      return "End time must be greater than start time";
    }

    const [startHour, startMinute] = formData.startTime.split(":").map(Number);
    const [endHour, endMinute] = formData.endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes - startTotalMinutes < 30) {
      return "Slot duration must be at least 30 minutes";
    }

    if (Number(formData.capacity) < 1) {
      return "Capacity must be at least 1";
    }

    if (Number(formData.capacity) > 100) {
      return "Capacity cannot exceed 100";
    }

    const now = new Date();

    if (selectedDate.getTime() === today.getTime()) {
      const selectedStartDateTime = new Date();
      selectedStartDateTime.setHours(startHour, startMinute, 0, 0);

      if (selectedStartDateTime <= now) {
        return "Cannot create slot for a past time";
      }
    }

    return null;
  };

  const handleDisableSlot = async (slotId) => {
    const result = await dispatch(disableSlot(slotId));

    if (disableSlot.fulfilled.match(result)) {
      setSuccessMessage("Slot disabled successfully.");
      dispatch(fetchSlots());
    }
  };

  const activeSlots = slots.filter((slot) => slot.isActive);
  const disabledSlots = slots.filter((slot) => !slot.isActive);

  return (
    <section>
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-medium text-white">
          Admin Slot Management
        </span>

        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
          Create & Manage Delivery Slots
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          Add delivery slots with capacity. Disabled slots can be reactivated by
          creating the same date and time again.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {validationError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {validationError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-xl font-bold text-slate-950">Create Slot</h3>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  step="1800"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  step="1800"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Example: 5"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {actionLoading ? "Saving..." : "Create Slot"}
          </button>
        </form>

        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Current Slots
              </h3>
              <p className="text-sm text-slate-500">
                Active: {activeSlots.length} | Disabled: {disabledSlots.length}
              </p>
            </div>
          </div>

          {loading && (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <ShimmerCard key={index} />
              ))}
            </div>
          )}

          {!loading && slots.length === 0 && (
            <EmptyState
              title="No slots created"
              description="Create your first delivery slot using the form."
            />
          )}

          {!loading && slots.length > 0 && (
            <div className="grid gap-4">
              {slots.map((slot) => {
                const availableCount = slot.capacity - slot.bookedCount;

                return (
                  <div
                    key={slot._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            slot.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {slot.isActive ? "Active" : "Disabled"}
                        </span>

                        <h4 className="mt-3 text-lg font-bold text-slate-950">
                          {slot.date} | {slot.startTime} - {slot.endTime}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          Capacity: {slot.capacity} | Booked: {slot.bookedCount}{" "}
                          | Available: {availableCount}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDisableSlot(slot._id)}
                        disabled={!slot.isActive || actionLoading}
                        className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                          slot.isActive
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-slate-200 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {slot.isActive ? "Disable Slot" : "Disabled"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreateSlot;
