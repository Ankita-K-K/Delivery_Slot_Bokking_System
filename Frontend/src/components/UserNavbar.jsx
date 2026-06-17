import { NavLink, Link } from "react-router-dom";

const UserNavbar = () => {
  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-slate-950">
            Delivery Slots
          </Link>

          <div className="flex flex-wrap gap-2">
            <NavLink to="/" end className={linkClass}>
              Book Slot
            </NavLink>

            <NavLink to="/my-bookings" className={linkClass}>
              My Bookings
            </NavLink>

            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
