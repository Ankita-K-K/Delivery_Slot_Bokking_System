const ShimmerCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
};

export default ShimmerCard;
