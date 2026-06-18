import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createSlot,
  fetchSlots,
  disableSlot,
  updateSlot,
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

  const [editingSlot, setEditingSlot] = useState(null);

  const [editFormData, setEditFormData] = useState({
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
      toast.error(validationMessage);
      return;
    }

    const result = await dispatch(
      createSlot({
        ...formData,
        capacity: Number(formData.capacity),
      }),
    );

    if (createSlot.fulfilled.match(result)) {
      toast.success("Slot created successfully");
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
      toast.success("Slot disabled successfully");
      dispatch(fetchSlots());
    }
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isSlotExpired = (slot) => {
    const slotEndDateTime = new Date(`${slot.date}T${slot.endTime}:00`);
    return slotEndDateTime < new Date();
  };

  const openEditModal = (slot) => {
    if (!slot.isActive) {
      toast.error("Disabled slots cannot be edited");
      return;
    }

    if (isSlotExpired(slot)) {
      toast.error("Expired slots cannot be edited");
      return;
    }

    setEditingSlot(slot);

    setEditFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
    });
  };

  const closeEditModal = () => {
    setEditingSlot(null);

    setEditFormData({
      date: "",
      startTime: "",
      endTime: "",
      capacity: "",
    });
  };

  const validateEditSlot = () => {
    if (
      !editFormData.date ||
      !editFormData.startTime ||
      !editFormData.endTime ||
      !editFormData.capacity
    ) {
      return "All fields are required";
    }

    const capacityValue = Number(editFormData.capacity);

    if (capacityValue < editingSlot.bookedCount) {
      return `Capacity cannot be less than booked count (${editingSlot.bookedCount})`;
    }

    if (capacityValue < 1) {
      return "Capacity must be at least 1";
    }

    if (capacityValue > 100) {
      return "Capacity cannot exceed 100";
    }

    const isDateTimeChanged =
      editFormData.date !== editingSlot.date ||
      editFormData.startTime !== editingSlot.startTime ||
      editFormData.endTime !== editingSlot.endTime;

    if (isDateTimeChanged && editingSlot.bookedCount > 0) {
      return "Date or time cannot be changed because this slot already has bookings";
    }

    if (editFormData.startTime >= editFormData.endTime) {
      return "End time must be greater than start time";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(editFormData.date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Cannot update slot to a past date";
    }

    const [startHour, startMinute] = editFormData.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = editFormData.endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes - startTotalMinutes < 30) {
      return "Slot duration must be at least 30 minutes";
    }

    const now = new Date();

    if (selectedDate.getTime() === today.getTime()) {
      const selectedStartDateTime = new Date();
      selectedStartDateTime.setHours(startHour, startMinute, 0, 0);

      if (selectedStartDateTime <= now) {
        return "Cannot update slot to a past time";
      }
    }

    return null;
  };

  const handleUpdateSlot = async () => {
    const validationMessage = validateEditSlot();

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const result = await dispatch(
      updateSlot({
        slotId: editingSlot._id,
        slotData: {
          date: editFormData.date,
          startTime: editFormData.startTime,
          endTime: editFormData.endTime,
          capacity: Number(editFormData.capacity),
        },
      }),
    );

    if (updateSlot.fulfilled.match(result)) {
      toast.success("Slot updated successfully");
      closeEditModal();
      dispatch(fetchSlots());
    }

    if (updateSlot.rejected.match(result)) {
      toast.error(result.payload || "Failed to update slot");
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
                            isSlotExpired(slot)
                              ? "bg-red-100 text-red-700"
                              : slot.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isSlotExpired(slot)
                            ? "Expired"
                            : slot.isActive
                              ? "Active"
                              : "Disabled"}
                        </span>

                        <h4 className="mt-3 text-lg font-bold text-slate-950">
                          {slot.date} | {slot.startTime} - {slot.endTime}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          Capacity: {slot.capacity} | Booked: {slot.bookedCount}{" "}
                          | Available: {availableCount}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() => openEditModal(slot)}
                          disabled={!slot.isActive || isSlotExpired(slot)}
                          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                            slot.isActive && !isSlotExpired(slot)
                              ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                              : "bg-slate-200 text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          {isSlotExpired(slot) ? "Expired" : "Edit Slot"}
                        </button>

                        <button
                          onClick={() => handleDisableSlot(slot._id)}
                          disabled={
                            !slot.isActive ||
                            slot.bookedCount > 0 ||
                            actionLoading
                          }
                          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                            slot.bookedCount > 0
                              ? "cursor-not-allowed bg-amber-100 text-amber-700"
                              : slot.isActive
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {slot.bookedCount > 0
                            ? "Has Bookings"
                            : slot.isActive
                              ? "Disable Slot"
                              : "Disabled"}
                        </button>
                        {!slot.isActive && (
                          <button
                            onClick={() =>
                              dispatch(
                                updateSlot({
                                  slotId: slot._id,
                                  slotData: { isActive: true },
                                }),
                              ).then((result) => {
                                if (updateSlot.fulfilled.match(result)) {
                                  toast.success(
                                    "Slot reactivated successfully",
                                  );
                                  dispatch(fetchSlots());
                                } else {
                                  toast.error(
                                    result.payload ||
                                      "Failed to reactivate slot",
                                  );
                                }
                              })
                            }
                            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Reactivate Slot
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {editingSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Edit Delivery Slot
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-950">
                  {editingSlot.date}
                </h3>

                {editingSlot.bookedCount > 0 && (
                  <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    This slot has bookings. Only capacity can be updated.
                  </p>
                )}
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={editFormData.date}
                  onChange={handleEditChange}
                  disabled={editingSlot.bookedCount > 0}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-100 disabled:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    step="1800"
                    name="startTime"
                    value={editFormData.startTime}
                    onChange={handleEditChange}
                    disabled={editingSlot.bookedCount > 0}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-100 disabled:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    step="1800"
                    name="endTime"
                    value={editFormData.endTime}
                    onChange={handleEditChange}
                    disabled={editingSlot.bookedCount > 0}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-100 disabled:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                  min={editingSlot.bookedCount}
                  max="100"
                  value={editFormData.capacity}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Current booked count: {editingSlot.bookedCount}. Capacity
                  cannot be less than this value.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closeEditModal}
                className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateSlot}
                disabled={actionLoading}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateSlot;
