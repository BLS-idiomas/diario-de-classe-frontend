import {
  LabelField,
  InputGroupField,
  describedByIds,
  FieldMessages,
} from './base';

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
  hint,
  error,
  ...props
}) => {
  const checkboxClassName =
    className ||
    'h-4 w-4 accent-blue-600 text-white focus:ring-blue-500 border-blue-600 rounded';
  const containerClassName = inputGroupClass || 'flex items-center tap-target';
  const labelTextClassName = labelClass || 'ml-2 block text-sm text-main';

  const handleChange = e => {
    if (!disabled && onChange) {
      onChange(e);
    }
  };

  const row = (
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
        data-testid="checkbox-field"
        aria-describedby={describedByIds(htmlFor, { hint, error })}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      <LabelField htmlFor={htmlFor} className={labelTextClassName}>
        {required ? `${label} *` : label}
      </LabelField>
    </InputGroupField>
  );

  if (!hint && !error) {
    return row;
  }

  return (
    <div>
      {row}
      <div className="pl-6">
        <FieldMessages htmlFor={htmlFor} hint={hint} error={error} />
      </div>
    </div>
  );
};
