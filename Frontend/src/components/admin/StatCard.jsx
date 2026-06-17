const StatCard = ({ label, value, icon, color }) => {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${color}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>

      <p className="mt-4 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
};

export default StatCard;
