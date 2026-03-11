// TODO parar de usar esse componente
export const PageContent = ({ children }) => {
  return (
    <div className="mb-6" data-testid="page-content">
      {children}
    </div>
  );
};
