import Link from 'next/link';

export const SidebarItem = ({
  children,
  href,
  label,
  sidebarExpanded,
  active,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${active ? 'bg-blue-200' : ''}`}
    >
      <div className="w-3 h-3 flex items-center justify-center">
        <span className="text-black text-sm">{children}</span>
      </div>
      {sidebarExpanded && (
        <p className="text-gray-700 text-xs font-medium">{label}</p>
      )}
    </Link>
  );
};
