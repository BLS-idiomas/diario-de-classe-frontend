import Link from 'next/link';

export const ButtonsPage = ({ buttons, extraButton }) => {
  const hasButton = buttons.length > 0 || Boolean(extraButton);
  if (!hasButton) return null;
  return (
    <div className="button-group" data-testid="buttons-page">
      {buttons.map(({ href, label, type }) => (
        <Link
          key={href}
          href={href}
          className={`btn btn-${type}`}
          data-testid={`buttons-page-link-${type}`}
        >
          {label}
        </Link>
      ))}
      {extraButton}
    </div>
  );
};
