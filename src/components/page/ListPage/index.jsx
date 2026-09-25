import { PainelFiltrosColapsavel, SearchForm } from '@/components/app';
import { Table } from '@/components/ui';
import { ButtonsPage } from '../shared';
import { useCollapsiblePanelState } from '@/hooks/useCollapsiblePanelState';

/**
 * `filterStorageKey` é opcional (COMP-002-005): presente junto de `Filter`, envolve
 * `<Filter {...filterParams} />` com `PainelFiltrosColapsavel` (COMP-002-001),
 * controlado por `useCollapsiblePanelState(filterStorageKey)` (COMP-002-002) — a MESMA
 * chave passada ao painel via `storageKey` (invariante de DEC-002-001 §6): só assim o
 * `isOpen` que o React controla converge com o que o script anti-flash já aplicou ao DOM
 * antes da hidratação. Ausente (`/alunos`, `/livros`, `/professores`), `ListPage`
 * renderiza exatamente como antes.
 */
export const ListPage = ({
  title,
  buttons = [],
  extraButton,
  search,
  columns,
  data,
  isLoading,
  notFoundMessage,
  Filter = null,
  filterParams = {},
  filterStorageKey = null,
}) => {
  const { isOpen, toggle } = useCollapsiblePanelState(filterStorageKey);

  return (
    <>
      <h1 className="page-title" data-testid="list-page-title">
        {title}
      </h1>

      <div
        className="lg:grid lg:grid-cols-2 gap-4"
        data-testid="list-page-controls"
      >
        <ButtonsPage buttons={buttons} extraButton={extraButton} />
        {Boolean(search) && (
          <SearchForm
            placeholder={search.title}
            perform={search.searchParams}
            initialValue={search.initialValue}
          />
        )}
      </div>

      {Filter && (
        <div className="my-6" data-testid="list-page-filter">
          {filterStorageKey ? (
            <PainelFiltrosColapsavel
              titulo="Filtros"
              isOpen={isOpen}
              onToggle={toggle}
              appliedCount={filterParams.appliedCount}
              storageKey={filterStorageKey}
            >
              <Filter {...filterParams} />
            </PainelFiltrosColapsavel>
          ) : (
            <Filter {...filterParams} />
          )}
        </div>
      )}

      <div data-testid="list-page-table">
        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          notFoundMessage={notFoundMessage}
        />
      </div>
    </>
  );
};
