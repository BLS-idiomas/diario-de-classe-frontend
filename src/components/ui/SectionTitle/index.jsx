export const SectionTitle = ({ children }) => {
  return (
    <h3
      className="text-lg text-main font-semibold mb-3"
      data-testid="section-title"
    >
      {children}
    </h3>
  );
};
