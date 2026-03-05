export const BlockQuoteInfo = ({ title, noContent, children }) => {
  return (
    <div className="mt-4">
      <h4 className="font-semibold text-main">{title}</h4>
      {children ? (
        <blockquote className="border-l-4 pl-3 italic text-main">
          {children}
        </blockquote>
      ) : (
        <p className="text-muted">{noContent}</p>
      )}
    </div>
  );
};
