import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const linkClass = (active, activeClass = "bg-slate-950 text-white") =>
    `rounded-xl px-4 py-2 text-sm font-medium transition ${
      active ? activeClass : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-950">
            {isAdminRoute ? "Admin Control Center" : "Smart Slot Booking"}
          </h1>

          <p className="text-sm text-slate-500">
            {isAdminRoute
              ? "Manage slots, bookings and delivery capacity"
              : "Book delivery slots with smart recommendations"}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          {isAdminRoute ? (
            <>
              <Link
                to="/admin"
                className={linkClass(location.pathname === "/admin")}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/slots"
                className={linkClass(
                  location.pathname === "/admin/slots",
                  "bg-blue-600 text-white",
                )}
              >
                Manage Slots
              </Link>

              <Link
                to="/admin/bookings"
                className={linkClass(
                  location.pathname === "/admin/bookings",
                  "bg-green-600 text-white",
                )}
              >
                Manage Bookings
              </Link>

              <Link
                to="/"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                User Portal
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={linkClass(
                  location.pathname === "/",
                  "bg-blue-600 text-white",
                )}
              >
                Book Slot
              </Link>

              <Link
                to="/my-bookings"
                className={linkClass(
                  location.pathname === "/my-bookings",
                  "bg-green-600 text-white",
                )}
              >
                My Bookings
              </Link>

              <Link
                to="/admin"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Admin Portal
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
