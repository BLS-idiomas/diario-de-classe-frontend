import { classNameDefault, BaseField } from './base';

export const TextAreaField = ({
  htmlFor,
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
  className ||= classNameDefault;
  return (
    <BaseField
      htmlFor={htmlFor}
      required={required}
      label={label}
      inputGroupClass={inputGroupClass}
      labelClass={labelClass}
    >
      <textarea
        id={htmlFor}
        name={htmlFor}
        required={required}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        {...props}
      />
    </BaseField>
  );
};
