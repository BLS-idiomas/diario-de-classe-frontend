export const FormGroup = ({ children, cols = 2, className = '' }) => {
  let colsClass = '';
  className ||= 'gap-6';
  if (cols === 6) colsClass = 'md:grid-cols-3 lg:grid-cols-6';
  if (cols === 5) colsClass = 'md:grid-cols-3 lg:grid-cols-5';
  if (cols === 4) colsClass = 'md:grid-cols-2 lg:grid-cols-4';
  if (cols === 3) colsClass = 'md:grid-cols-2 lg:grid-cols-3';
  if (cols === 2) colsClass = 'md:grid-cols-2';
  return (
    <div className={`grid grid-cols-1 ${colsClass} ${className}`}>
      {children}
    </div>
  );
};
