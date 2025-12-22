import { LabelField, InputGroupField } from './base';

export const CheckboxField = ({
  htmlFor,
  label,
  checked,
  onChange,
  required,
  inputGroupClass,
  labelClass,
  className,
  disabled,
  ...props
}) => {
  const checkboxClassName =
    className ||
    'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
  const containerClassName = inputGroupClass || 'flex items-center';
  const labelTextClassName = labelClass || 'ml-2 block text-sm text-gray-900';

  const handleChange = e => {
    if (!disabled && onChange) {
      onChange(e);
    }
  };

  return (
    <InputGroupField className={containerClassName}>
      <input
        type="checkbox"
        id={htmlFor}
        name={htmlFor}
        checked={checked || false}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={checkboxClassName}
        {...props}
      />
      <LabelField htmlFor={htmlFor} className={labelTextClassName}>
        {required ? `${label} *` : label}
      </LabelField>
    </InputGroupField>
  );
};
