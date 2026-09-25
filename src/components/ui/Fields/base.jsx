export const classNameDefault =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 appearance-none disabled:cursor-not-allowed input-field tap-target';

export const LabelField = ({
  className,
  children,
  'data-testid': testId,
  ...props
}) => {
  className ||= 'block text-sm font-medium text-main mb-2';
  return (
    <label
      {...props}
      className={className}
      data-testid={testId || 'label-field'}
    >
      {children}
    </label>
  );
};

export const InputGroupField = ({ children, className }) => {
  return (
    <div className={className} data-testid="input-group-field">
      {children}
    </div>
  );
};

export const OptionField = ({ value, label }) => {
  return (
    <option value={value} data-testid="option-field">
      {label}
    </option>
  );
};

const hintId = htmlFor => `${htmlFor}-hint`;
const errorId = htmlFor => `${htmlFor}-error`;

// Único ponto de cálculo dos ids referenciados por aria-describedby: reflete a
// presença real de hint/error, nunca um estado de validação isolado.
export const describedByIds = (htmlFor, { hint, error } = {}) => {
  const ids = [];
  if (hint) ids.push(hintId(htmlFor));
  if (error) ids.push(errorId(htmlFor));
  return ids.length ? ids.join(' ') : undefined;
};

// Nós de hint/error compartilhados entre BaseField e CheckboxField — ids vêm
// das mesmas funções que describedByIds usa para calcular aria-describedby.
export const FieldMessages = ({ htmlFor, hint, error }) => (
  <>
    {hint && (
      <p id={hintId(htmlFor)} className="mt-1 text-sm text-muted">
        {hint}
      </p>
    )}
    {error && (
      <p id={errorId(htmlFor)} role="alert" className="mt-1 text-sm text-error">
        {error}
      </p>
    )}
  </>
);

export const BaseField = ({
  htmlFor,
  required,
  label,
  inputGroupClass,
  labelClass,
  hint,
  error,
  children,
}) => {
  label = required ? `${label} *` : label;
  return (
    <InputGroupField className={inputGroupClass}>
      <LabelField htmlFor={htmlFor} className={labelClass}>
        {label}
      </LabelField>

      {children}

      <FieldMessages htmlFor={htmlFor} hint={hint} error={error} />
    </InputGroupField>
  );
};
