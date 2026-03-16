export const Section = ({ children }) => {
  return (
    <section className="bg-main rounded-md p-4 shadow-sm" data-testid="section">
      {children}
    </section>
  );
};
