import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSlots } from "../features/slots/slotSlice";
import { fetchBookings } from "../features/bookings/bookingSlice";

import ShimmerCard from "../components/ShimmerCard";
import StatCard from "../components/admin/StatCard";
import CapacityHero from "../components/admin/CapacityHero";
import SlotsNearCapacity from "../components/admin/SlotsNearCapacity";
import QuickActions from "../components/admin/QuickActions";

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

  const usagePercent =
    totalCapacity === 0 ? 0 : Math.round((totalBooked / totalCapacity) * 100);

  const loading = slotsLoading || bookingsLoading;
  const mostUtilizedSlot =
    activeSlots.length === 0
      ? null
      : [...activeSlots].sort(
          (a, b) => b.bookedCount / b.capacity - a.bookedCount / a.capacity,
        )[0];

  const now = new Date();
  const isSlotExpired = (slot) => {
    const slotEndDateTime = new Date(`${slot.date}T${slot.endTime}:00`);
    return slotEndDateTime < new Date();
  };

  const expiredSlots = slots.filter((slot) => isSlotExpired(slot));
  const nextAvailableSlot =
    activeSlots
      .filter((slot) => {
        if (slot.bookedCount >= slot.capacity) return false;

        const slotStart = new Date(`${slot.date}T${slot.startTime}:00`);

        return slotStart > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}:00`);
        const dateB = new Date(`${b.date}T${b.startTime}:00`);

        return dateA - dateB;
      })[0] || null;
  const stats = [
    {
      label: "Total Slots",
      value: slots.length,
      icon: "📅",
      color: "bg-slate-50 border-slate-200",
    },
    {
      label: "Expired Slots",
      value: expiredSlots.length,
      icon: "⏰",
      color: "bg-red-50 border-red-200",
    },
    {
      label: "Available Slots",
      value: availableSlots.length,
      icon: "🟢",
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Full Slots",
      value: fullSlots.length,
      icon: "🔴",
      color: "bg-red-50 border-red-200",
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: "📦",
      color: "bg-blue-50 border-blue-200",
    },
    {
      label: "Confirmed",
      value: confirmedBookings.length,
      icon: "✅",
      color: "bg-emerald-50 border-emerald-200",
    },
    {
      label: "Cancelled",
      value: cancelledBookings.length,
      icon: "❌",
      color: "bg-orange-50 border-orange-200",
    },
    {
      label: "Disabled Slots",
      value: disabledSlots.length,
      icon: "⏸️",
      color: "bg-slate-100 border-slate-300",
    },
    {
      label: "Capacity Used",
      value: `${usagePercent}%`,
      icon: "⚡",
      color: "bg-indigo-50 border-indigo-200",
    },
  ];

  if (loading) {
    return (
      <section className="space-y-8 pb-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 pb-12">
      <CapacityHero
        usagePercent={usagePercent}
        totalCapacity={totalCapacity}
        confirmedBookings={confirmedBookings}
        activeSlots={activeSlots}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <SlotsNearCapacity activeSlots={activeSlots} />
        <QuickActions
          mostUtilizedSlot={mostUtilizedSlot}
          nextAvailableSlot={nextAvailableSlot}
          confirmedBookings={confirmedBookings}
          cancelledBookings={cancelledBookings}
          totalBookings={bookings.length}
        />
      </div>
    </section>
  );
};

export default AdminDashboard;
