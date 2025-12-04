import { ChevronDown } from 'lucide-react';
import { classNameDefault, OptionField, BaseField } from './base';

export const SelectField = ({
  htmlFor,
  required,
  placeholder,
  label,
  value,
  onChange,
  inputGroupClass,
  labelClass,
  className,
  options = [],
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
      <div className="relative">
        <select
          id={htmlFor}
          name={htmlFor}
          required={required}
          value={value}
          onChange={onChange}
          className={`${className} pr-10 appearance-none`}
          {...props}
        >
          {placeholder && <OptionField value="" label={placeholder} />}
          {options.map(option => (
            <OptionField
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown size={20} strokeWidth={1.5} />
        </div>
      </div>
    </BaseField>
  );
};
