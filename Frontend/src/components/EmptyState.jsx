const EmptyState = ({
  title = "No data found",
  description = "There is nothing to display right now.",
}) => {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default EmptyState;
