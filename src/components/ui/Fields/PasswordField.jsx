import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { classNameDefault, BaseField } from './base';

function usePasswordField() {
  const [type, setType] = useState('password');

  const handleToggleShow = () => {
    setType(type === 'password' ? 'text' : 'password');
  };

  return { type, handleToggleShow };
}

export const PasswordField = ({
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
  const { type, handleToggleShow } = usePasswordField();
  return (
    <BaseField
      htmlFor={htmlFor}
      required={required}
      label={label}
      inputGroupClass={inputGroupClass}
      labelClass={labelClass}
    >
      <div className="relative">
        <input
          type={type}
          id={htmlFor}
          name={htmlFor}
          required={required}
          value={value || ''}
          onChange={onChange}
          className={`${className} pr-10`}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={handleToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          aria-label={type === 'password' ? 'Mostrar senha' : 'Ocultar senha'}
        >
          {type === 'password' ? (
            <Eye size={20} strokeWidth={1.5} />
          ) : (
            <EyeOff size={20} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </BaseField>
  );
};
