const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">
              Smart Slot Booking System
            </p>

            <p className="text-sm text-slate-500">
              Capacity-based delivery scheduling and booking management.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Built with React • Redux Toolkit • Node.js • Express • MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
