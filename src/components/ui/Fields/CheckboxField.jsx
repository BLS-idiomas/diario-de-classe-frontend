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
    'h-4 w-4 accent-blue-600 text-white focus:ring-blue-500 border-blue-600 rounded';
  const containerClassName = inputGroupClass || 'flex items-center';
  const labelTextClassName = labelClass || 'ml-2 block text-sm text-main';

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
