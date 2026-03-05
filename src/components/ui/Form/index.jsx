export const Form = ({ children, handleSubmit, className, props }) => {
  className ||= 'bg-main shadow-md rounded-lg p-6';
  return (
    <form {...props} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
