import { ButtonsPage } from '../shared';

export const FormPage = ({
  title,
  subTitle,
  buttons,
  extraButton,
  children,
}) => (
  <>
    <div className="mb-6" data-testid="form-page">
      <h1 className="page-title" data-testid="form-page-title">
        {title}
      </h1>
      <p className="text-muted" data-testid="form-page-subtitle">
        {subTitle}
      </p>
    </div>
    <ButtonsPage buttons={buttons} extraButton={extraButton} />
    <div data-testid="form-page-children">{children}</div>
  </>
);
