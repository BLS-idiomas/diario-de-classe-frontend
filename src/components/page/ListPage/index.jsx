import { SearchForm } from '@/components/app';
import { Table } from '@/components/ui';
import Link from 'next/link';

export const ListPage = ({
  title,
  buttons = [],
  extraButton,
  search,
  columns,
  data,
  isLoading,
  notFoundMessage,
}) => {
  const hasButton = buttons.length > 0 || Boolean(extraButton);
  return (
    <>
      <h1 className="page-title">{title}</h1>

      <div className="lg:grid lg:grid-cols-2 gap-4">
        {hasButton && (
          <div className="button-group">
            {buttons.map(({ href, label, type }) => (
              <Link key={href} href={href} className={`btn btn-${type}`}>
                {label}
              </Link>
            ))}
            {extraButton}
          </div>
        )}

        {Boolean(search) && (
          <SearchForm
            placeholder={search.title}
            perform={search.searchParams}
          />
        )}
      </div>
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage={notFoundMessage}
      />
    </>
  );
};
