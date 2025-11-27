const classNameDefault =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

const LabelField = ({ props, className, children }) => {
  className ||= 'block text-sm font-medium text-gray-700 mb-2';
  return (
    <label {...props} className={className}>
      {children}
    </label>
  );
};

const InputGroupField = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const OptionField = ({ value, label }) => {
  return <option value={value}>{label}</option>;
};

const BaseField = ({
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
  props,
}) => {
  type ||= 'text';
  label = required ? `${label} *` : label;
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
        {...props}
        type={type}
        id={htmlFor}
        name={htmlFor}
        required={required}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
    </BaseField>
  );
};

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
  props,
}) => {
  label = required ? `${label} *` : label;
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
        {...props}
        id={htmlFor}
        name={htmlFor}
        required={required}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
    </BaseField>
  );
};

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
  options,
  props,
}) => {
  label = required ? `${label} *` : label;
  className ||= classNameDefault;
  return (
    <BaseField
      htmlFor={htmlFor}
      required={required}
      label={label}
      inputGroupClass={inputGroupClass}
      labelClass={labelClass}
    >
      <select
        {...props}
        id={htmlFor}
        name={htmlFor}
        required={required}
        value={value}
        onChange={onChange}
        className={className}
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
    </BaseField>
  );
};
