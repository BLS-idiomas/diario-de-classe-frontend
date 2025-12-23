export const Loading = ({ size = 12, border = 4 }) => {
  return (
    <div
      data-testid="loading"
      className="flex items-center justify-center h-full w-full"
    >
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-${border} border-b-${border} border-blue-500`}
      ></div>
    </div>
  );
};
