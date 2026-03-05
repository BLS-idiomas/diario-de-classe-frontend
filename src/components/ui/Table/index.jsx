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
            },
          },
          rows: {
            style: {
              backgroundColor: '#1f2937', // bg-gray-900 // => 1f2937
              borderBottom: '1px solid #374151', // border-gray-700
            },
            stripedStyle: {
              color: 'var(--color-gray-300)',
              backgroundColor: 'var(--color-gray-900)', // bg-gray-800
            },
          },
          pagination: {
            style: {
              backgroundColor: 'var(--color-gray-900)', // => 1f2937
              color: 'var(--color-gray-300)',
            },
          },
        }
      : {};
  return (
    <div className={className || 'bg-main p-2 rounded-lg shadow-md'}>
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
