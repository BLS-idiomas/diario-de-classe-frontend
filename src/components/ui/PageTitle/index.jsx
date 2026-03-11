// TODO parar de usar esse componente
export const PageTitle = ({ children }) => {
  return (
    <h2 className="text-xl font-bold mb-4 text-main" data-testid="page-title">
      {children}
    </h2>
  );
};
