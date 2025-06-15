
const ForumLoadingSpinner = () => {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading forum content...</p>
    </div>
  );
};

export default ForumLoadingSpinner;
