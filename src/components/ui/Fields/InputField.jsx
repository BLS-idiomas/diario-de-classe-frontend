import { classNameDefault, BaseField, describedByIds } from './base';

export const InputField = ({
  htmlFor,
  type,
  placeholder,
  required,
  label,
  value,
  onChange,
  inputGroupClass,
  labelClass,
  className,
  icon, // novo prop opcional
  hint,
  error,
  ...props
}) => {
  type ||= 'text';
  className ||= classNameDefault;
  return (
    <BaseField
      htmlFor={htmlFor}
      required={required}
      label={label}
      inputGroupClass={inputGroupClass}
      labelClass={labelClass}
      hint={hint}
      error={error}
    >
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          id={htmlFor}
          name={htmlFor}
          required={required}
          value={value || ''}
          onChange={onChange}
          className={icon ? className + ' pl-10' : className}
          placeholder={placeholder}
          data-testid="input-field"
          aria-describedby={describedByIds(htmlFor, { hint, error })}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
      </div>
    </BaseField>
  );
};
