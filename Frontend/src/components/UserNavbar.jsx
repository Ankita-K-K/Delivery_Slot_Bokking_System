import { Link } from "react-router-dom";

const UserNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl sm:text-2xl font-bold text-slate-950">
          Delivery Slots
        </Link>

        <Link
          to="/admin"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
};

export default UserNavbar;
