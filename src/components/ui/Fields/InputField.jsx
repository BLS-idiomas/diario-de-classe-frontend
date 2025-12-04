import { classNameDefault, BaseField } from './base';

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
    >
      <input
        type={type}
        id={htmlFor}
        name={htmlFor}
        required={required}
        value={value || ''}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        {...props}
      />
    </BaseField>
  );
};
