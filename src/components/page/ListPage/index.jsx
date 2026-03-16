import { SearchForm } from '@/components/app';
import { Table } from '@/components/ui';
import { ButtonsPage } from '../shared';

export const ListPage = ({
  title,
  buttons = [],
  extraButton,
  search,
  columns,
  data,
  isLoading,
  notFoundMessage,
}) => (
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
        <SearchForm placeholder={search.title} perform={search.searchParams} />
      )}
    </div>
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
