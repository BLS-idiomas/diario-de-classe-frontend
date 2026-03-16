import { render, screen } from '@testing-library/react';
import { FormPage } from './index';

// Mock ButtonsPage component
jest.mock('../shared', () => ({
  ButtonsPage: ({ buttons, extraButton }) => (
    <div data-testid="buttons-page-mock">
      {buttons.map((btn, idx) => (
        <button key={idx} data-testid={`button-${btn.type}`}>
          {btn.label}
        </button>
      ))}
      {extraButton}
    </div>
  ),
}));

describe('FormPage', () => {
  const mockButtons = [
    { href: '/voltar', label: 'Voltar', type: 'secondary' },
    { href: '/salvar', label: 'Salvar', type: 'primary' },
  ];

  it('should render with data-testid on main container', () => {
    render(
      <FormPage
        title="Novo Aluno"
        subTitle="Preencha os dados do aluno"
        buttons={mockButtons}
        extraButton={null}
      >
        <div>Form Content</div>
      </FormPage>
    );

    expect(screen.getByTestId('form-page')).toBeInTheDocument();
  });

  it('should render title with data-testid', () => {
    render(
      <FormPage
        title="Editar Professor"
        subTitle="Update professor information"
        buttons={mockButtons}
        extraButton={null}
      >
        <div>Form Content</div>
      </FormPage>
    );

    const title = screen.getByTestId('form-page-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Editar Professor');
  });

  it('should render subtitle with data-testid', () => {
    render(
      <FormPage
        title="Create Item"
        subTitle="Complete the form below"
        buttons={mockButtons}
        extraButton={null}
      >
        <div>Form Content</div>
      </FormPage>
    );

    const subtitle = screen.getByTestId('form-page-subtitle');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent('Complete the form below');
  });

  it('should render children with data-testid', () => {
    render(
      <FormPage
        title="Form Title"
        subTitle="Form Subtitle"
        buttons={mockButtons}
        extraButton={null}
      >
        <div data-testid="test-children">Custom children content</div>
      </FormPage>
    );

    const childrenContainer = screen.getByTestId('form-page-children');
    expect(childrenContainer).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('should render ButtonsPage component', () => {
    render(
      <FormPage
        title="Test Form"
        subTitle="Testing buttons"
        buttons={mockButtons}
        extraButton={null}
      >
        <div>Content</div>
      </FormPage>
    );

    expect(screen.getByTestId('buttons-page-mock')).toBeInTheDocument();
  });

  it('should render with empty buttons', () => {
    render(
      <FormPage
        title="Form Title"
        subTitle="Subtitle"
        buttons={[]}
        extraButton={null}
      >
        <div>Content</div>
      </FormPage>
    );

    expect(screen.getByTestId('form-page')).toBeInTheDocument();
    expect(screen.getByTestId('form-page-title')).toHaveTextContent(
      'Form Title'
    );
  });

  it('should render with extraButton', () => {
    const extraButton = <button data-testid="extra-button">Extra</button>;
    render(
      <FormPage
        title="Form Title"
        subTitle="Subtitle"
        buttons={mockButtons}
        extraButton={extraButton}
      >
        <div>Content</div>
      </FormPage>
    );

    expect(screen.getByTestId('extra-button')).toBeInTheDocument();
  });

  it('should render multiple buttons', () => {
    const manyButtons = [
      { href: '/1', label: 'Button 1', type: 'primary' },
      { href: '/2', label: 'Button 2', type: 'secondary' },
      { href: '/3', label: 'Button 3', type: 'danger' },
    ];

    render(
      <FormPage
        title="Multiple Buttons"
        subTitle="Testing multiple buttons"
        buttons={manyButtons}
        extraButton={null}
      >
        <div>Content</div>
      </FormPage>
    );

    expect(screen.getByTestId('button-primary')).toHaveTextContent('Button 1');
    expect(screen.getByTestId('button-secondary')).toHaveTextContent(
      'Button 2'
    );
    expect(screen.getByTestId('button-danger')).toHaveTextContent('Button 3');
  });

  it('should apply correct styling classes', () => {
    const { container } = render(
      <FormPage
        title="Styled Form"
        subTitle="Testing classes"
        buttons={mockButtons}
        extraButton={null}
      >
        <div>Content</div>
      </FormPage>
    );

    const headerDiv = container.querySelector('[data-testid="form-page"]');
    expect(headerDiv).toHaveClass('mb-6');

    const subtitle = screen.getByTestId('form-page-subtitle');
    expect(subtitle).toHaveClass('text-muted');
  });
});
