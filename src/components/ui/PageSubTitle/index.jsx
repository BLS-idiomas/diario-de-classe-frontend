// TODO parar de usar esse componente
export const PageSubTitle = ({ children }) => {
  return (
    <p className="text-muted" data-testid="page-sub-title">
      {children}
    </p>
  );
};
