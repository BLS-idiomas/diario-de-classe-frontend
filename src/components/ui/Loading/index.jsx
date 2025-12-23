export const Loading = ({ size = 12, border = 4, color = 'blue' }) => {
  const borderClass = `border-t-${border} border-b-${border}`;
  const sizeClass = `h-${size} w-${size}`;
  const colorClass = `border-${color}-500`;
  return (
    <div
      data-testid="loading"
      className="flex items-center justify-center h-full w-full"
    >
      <div
        className={`animate-spin rounded-full ${sizeClass} ${borderClass} ${colorClass}`}
      ></div>
    </div>
  );
};
