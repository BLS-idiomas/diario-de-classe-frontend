'use client';
import { useTheme } from '@/providers/ThemeProvider';
import DataTable from 'react-data-table-component';

// Adicione a variável isDark para alternar o tema
export function Table({
  columns,
  data,
  isLoading,
  notFoundMessage,
  className,
}) {
  const { theme } = useTheme();
  const textClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  // customStyles para DataTable
  const customStyles =
    theme === 'dark'
      ? {
          table: {
            style: {
              backgroundColor: '#1f2937', // bg-gray-900 // => 1f2937
              color: '#d1d5db', // text-gray-300
            },
          },
          headRow: {
            style: {
              backgroundColor: 'var(--color-gray-900)', // bg-gray-800
              color: 'var(--color-white)',
            },
          },
          headCells: {
            style: {
              color: 'var(--color-white)',
              minHeight: 'var(--tap-target-size)',
              minWidth: 'var(--tap-target-size)',
            },
          },
          rows: {
            style: {
              backgroundColor: '#1f2937', // bg-gray-900 // => 1f2937
              borderBottom: '1px solid #374151', // border-gray-700
              color: 'var(--color-gray-400)',
            },
            stripedStyle: {
              color: 'var(--color-gray-300)',
              backgroundColor: 'var(--color-gray-900)', // bg-gray-800
            },
            highlightOnHoverStyle: {
              backgroundColor: '#334155', // bg-slate-700 — antes só em CSS
              // morto (.dark .rdt_TableRow:hover, nunca aplicado — o app usa
              // data-theme, não a classe .dark); sem isso, o merge com o tema
              // "default" da lib (que este componente sempre usa, sem prop
              // `theme`) deixava o hover cair no cinza claro do library default.
              color: 'var(--color-white)',
            },
          },
          pagination: {
            style: {
              backgroundColor: 'var(--color-gray-900)', // => 1f2937
              color: 'var(--color-gray-300)',
            },
            // react-data-table-component NÃO aplica pagination.style aos
            // botões — só ao <nav> container. Os botões (#pagination-*)
            // consomem pageButtonsStyle.
            pageButtonsStyle: {
              height: 'var(--tap-target-size)',
              width: 'var(--tap-target-size)',
            },
          },
          progress: {
            style: {
              backgroundColor: '#1f2937', // bg-gray-900 // => 1f2937
              color: 'var(--color-gray-300)',
            },
          },
          noData: {
            style: {
              backgroundColor: '#1f2937', // bg-gray-900 // => 1f2937
              color: 'var(--color-gray-300)',
            },
          },
        }
      : {
          pagination: {
            // react-data-table-component NÃO aplica pagination.style aos
            // botões — só ao <nav> container. Os botões (#pagination-*)
            // consomem pageButtonsStyle.
            pageButtonsStyle: {
              height: 'var(--tap-target-size)',
              width: 'var(--tap-target-size)',
            },
          },
          headCells: {
            style: {
              minHeight: 'var(--tap-target-size)',
              minWidth: 'var(--tap-target-size)',
            },
          },
        };
  return (
    <div
      className={
        className ||
        'bg-main p-2 rounded-lg shadow-md overflow-x-auto max-w-full'
      }
      data-testid="table"
    >
      <DataTable
        columns={columns}
        data={data || []}
        progressPending={isLoading}
        progressComponent={
          <div className={`py-8 text-center ${textClass} text-lg`}>
            Carregando...
          </div>
        }
        noDataComponent={
          <div className={`py-8 text-center ${textClass} text-lg`}>
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
        customStyles={customStyles}
      />
    </div>
  );
}
