export const BadgeGroup = ({ children }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4" data-testid="badge-group">
      {children}
    </div>
  );
};
