import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
} from '@/components/ui';
import { ButtonsPage } from '../shared';

export const FormPage = ({
  title,
  subTitle,
  buttons,
  extraButton,
  children,
}) => {
  const hasButton = buttons.length > 0 || extraButton;
  return (
    <>
      <PageContent>
        <PageTitle>{title}</PageTitle>

        <PageSubTitle>{subTitle}</PageSubTitle>
      </PageContent>

      <ButtonsPage
        buttons={buttons}
        extraButton={extraButton}
        hasButton={hasButton}
      />

      {children}
    </>
  );
};
