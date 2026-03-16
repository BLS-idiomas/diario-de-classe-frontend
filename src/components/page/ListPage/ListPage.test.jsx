import { render, screen, fireEvent } from '@testing-library/react';
import { ListPage } from './index';

// Mock dependencies
jest.mock('@/components/app', () => ({
  SearchForm: ({ placeholder, perform }) => (
    <div data-testid="search-form-mock">
      <input
        data-testid="search-input"
        placeholder={placeholder}
        onChange={e => perform(e.target.value)}
      />
    </div>
  ),
}));

jest.mock('@/components/ui', () => ({
  Table: ({ columns, data, isLoading, notFoundMessage }) => (
    <div data-testid="table-mock">
      {isLoading && <div data-testid="table-loading">Loading...</div>}
      {!isLoading && data.length === 0 && (
        <div data-testid="table-empty">{notFoundMessage}</div>
      )}
      {!isLoading && data.length > 0 && (
        <table>
          <tbody data-testid="table-body">
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
}));

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

describe('ListPage', () => {
  const mockColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
  ];

  const mockData = [
    { id: 1, name: 'João Silva', email: 'joao@example.com' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com' },
  ];

  const mockButtons = [
    { href: '/alunos/novo', label: 'Novo Aluno', type: 'primary' },
    { href: '/alunos', label: 'Voltar', type: 'secondary' },
  ];

  const mockSearch = {
    title: 'Buscar aluno',
    searchParams: jest.fn(),
  };

  it('should render with data-testid on title', () => {
    render(
      <ListPage
        title="Alunos"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Nenhum aluno encontrado"
      />
    );

    const title = screen.getByTestId('list-page-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Alunos');
  });

  it('should render controls section with data-testid', () => {
    render(
      <ListPage
        title="Professores"
        buttons={mockButtons}
        extraButton={null}
        search={mockSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Nenhum professor encontrado"
      />
    );

    expect(screen.getByTestId('list-page-controls')).toBeInTheDocument();
  });

  it('should render table section with data-testid', () => {
    render(
      <ListPage
        title="Contratos"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Nenhum contrato encontrado"
      />
    );

    expect(screen.getByTestId('list-page-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-mock')).toBeInTheDocument();
  });

  it('should render ButtonsPage component', () => {
    render(
      <ListPage
        title="List Page"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('buttons-page-mock')).toBeInTheDocument();
  });

  it('should render SearchForm when search prop is provided', () => {
    render(
      <ListPage
        title="Search List"
        buttons={mockButtons}
        extraButton={null}
        search={mockSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('search-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toHaveAttribute(
      'placeholder',
      'Buscar aluno'
    );
  });

  it('should not render SearchForm when search prop is null', () => {
    render(
      <ListPage
        title="No Search List"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.queryByTestId('search-form-mock')).not.toBeInTheDocument();
  });

  it('should render table with data', () => {
    render(
      <ListPage
        title="List with Data"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    const tableBody = screen.getByTestId('table-body');
    expect(tableBody).toBeInTheDocument();
    expect(tableBody.querySelectorAll('tr')).toHaveLength(2);
  });

  it('should display loading state', () => {
    render(
      <ListPage
        title="Loading List"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={[]}
        isLoading={true}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent('Loading...');
  });

  it('should display empty state when no data', () => {
    render(
      <ListPage
        title="Empty List"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={[]}
        isLoading={false}
        notFoundMessage="Nenhum item encontrado"
      />
    );

    expect(screen.getByTestId('table-empty')).toBeInTheDocument();
    expect(screen.getByTestId('table-empty')).toHaveTextContent(
      'Nenhum item encontrado'
    );
  });

  it('should pass search parameters to SearchForm', () => {
    const mockSearchFn = jest.fn();
    const customSearch = {
      title: 'Search profesores',
      searchParams: mockSearchFn,
    };

    render(
      <ListPage
        title="Professor List"
        buttons={mockButtons}
        extraButton={null}
        search={customSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockSearchFn).toHaveBeenCalledWith('test');
  });

  it('should render with empty buttons array', () => {
    render(
      <ListPage
        title="List with Empty Buttons"
        buttons={[]}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('list-page-title')).toBeInTheDocument();
    expect(screen.getByTestId('list-page-table')).toBeInTheDocument();
  });

  it('should render with extraButton', () => {
    const extraButton = <button data-testid="extra-btn">Extra Action</button>;

    render(
      <ListPage
        title="List with Extra Button"
        buttons={mockButtons}
        extraButton={extraButton}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('extra-btn')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(
      <ListPage
        title="Styled List"
        buttons={mockButtons}
        extraButton={null}
        search={mockSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    const controlsDiv = container.querySelector(
      '[data-testid="list-page-controls"]'
    );
    expect(controlsDiv).toHaveClass('lg:grid', 'lg:grid-cols-2', 'gap-4');
  });
});
