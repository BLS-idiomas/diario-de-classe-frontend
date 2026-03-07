import Link from 'next/link';

export const ButtonsPage = ({ buttons, extraButton }) => {
  const hasButton = buttons.length > 0 || Boolean(extraButton);
  if (!hasButton) return null;
  return (
    <div className="button-group">
      {buttons.map(({ href, label, type }) => (
        <Link key={href} href={href} className={`btn btn-${type}`}>
          {label}
        </Link>
      ))}
      {extraButton}
    </div>
  );
};
