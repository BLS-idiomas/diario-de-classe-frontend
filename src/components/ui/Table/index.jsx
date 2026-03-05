'use client';
import DataTable from 'react-data-table-component';

export function Table({
  columns,
  data,
  isLoading,
  notFoundMessage,
  className,
}) {
  return (
    <div className={className || 'bg-main p-2 rounded-lg shadow-md'}>
      <DataTable
        columns={columns}
        data={data || []}
        /* 👉 MOSTRAR LOADING */
        progressPending={isLoading}
        progressComponent={
          <div className="py-8 text-center text-gray-500 text-lg">
            Carregando...
          </div>
        }
        /* 👉 QUANDO A API NÃO RETORNA NADA */
        noDataComponent={
          <div className="py-8 text-center text-gray-500 text-lg">
            {notFoundMessage}
          </div>
        }
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Linhas por página',
          rangeSeparatorText: 'de',
          noRowsPerPage: false,
          selectAllRowsItem: false,
        }}
        highlightOnHover
        striped
      />
    </div>
  );
}
