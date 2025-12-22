export const FormError = ({ title, errors }) => {
  if (!title) {
    return <></>;
  }
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <h3 className="text-red-800 font-medium mb-2">{title}:</h3>
      <ul className="list-disc list-inside space-y-1">
        {errors &&
          Array.isArray(errors) &&
          errors.map((error, index) => (
            <li key={index} className="text-sm text-red-700">
              {error}
            </li>
          ))}
      </ul>
    </div>
  );
};
