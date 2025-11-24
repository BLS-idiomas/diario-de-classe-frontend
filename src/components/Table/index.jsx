import DataTable from 'react-data-table-component';

export default function Table({ columns, data, isLoading, notFoundMessage }) {
  return (
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
  );
}
