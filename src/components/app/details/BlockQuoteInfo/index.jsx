export const BlockQuoteInfo = ({ title, noContent, children }) => {
  return (
    <div className="mt-4">
      <h4 className="font-semibold">{title}</h4>
      {children ? (
        <blockquote className="border-l-4 pl-3 italic text-gray-700">
          {children}
        </blockquote>
      ) : (
        <p className="text-gray-500">{noContent}</p>
      )}
    </div>
  );
};
