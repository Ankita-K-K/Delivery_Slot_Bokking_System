import { NavLink, Link } from "react-router-dom";

const AdminNavbar = () => {
  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/admin">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-950">
              Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage slots and bookings
            </p>
          </Link>

          <div className="flex flex-wrap gap-2">
            <NavLink to="/admin" end className={linkClass}>
              Overview
            </NavLink>
            <NavLink to="/admin/slots" className={linkClass}>
              Slots
            </NavLink>
            <NavLink to="/admin/bookings" className={linkClass}>
              Bookings
            </NavLink>
            <NavLink to="/" className={linkClass}>
              User View
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
