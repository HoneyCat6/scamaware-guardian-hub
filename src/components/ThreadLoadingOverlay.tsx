
const ThreadLoadingOverlay = () => {
  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600">Processing...</p>
    </div>
  );
};

export default ThreadLoadingOverlay;
