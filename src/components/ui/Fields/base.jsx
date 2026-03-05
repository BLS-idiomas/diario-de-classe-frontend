export const classNameDefault =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none disabled:cursor-not-allowed input-field';

export const LabelField = ({ className, children, ...props }) => {
  className ||= 'block text-sm font-medium text-main mb-2';
  return (
    <label {...props} className={className}>
      {children}
    </label>
  );
};

export const InputGroupField = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const OptionField = ({ value, label }) => {
  return <option value={value}>{label}</option>;
};

export const BaseField = ({
  htmlFor,
  required,
  label,
  inputGroupClass,
  labelClass,
  children,
}) => {
  label = required ? `${label} *` : label;
  return (
    <InputGroupField className={inputGroupClass}>
      <LabelField htmlFor={htmlFor} className={labelClass}>
        {label}
      </LabelField>

      {children}
    </InputGroupField>
  );
};
