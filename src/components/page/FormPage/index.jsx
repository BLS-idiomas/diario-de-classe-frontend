import { ButtonsPage } from '../shared';

export const FormPage = ({
  title,
  subTitle,
  buttons,
  extraButton,
  children,
}) => (
  <>
    <div className="mb-6">
      <h1 className="page-title">{title}</h1>
      <p className="text-muted">{subTitle}</p>
    </div>
    <ButtonsPage buttons={buttons} extraButton={extraButton} />
    {children}
  </>
);
