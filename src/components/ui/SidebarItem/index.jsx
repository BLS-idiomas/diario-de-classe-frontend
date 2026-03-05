import Link from 'next/link';

export const SidebarItem = ({
  children,
  href,
  label,
  sidebarExpanded,
  active,
  isMobile,
}) => {
  return (
    <Link
      href={href}
      className="group flex items-center space-x-3 p-3 rounded-lg bg-sidebar transition-colors"
    >
      <div className="w-3 h-3 flex items-center justify-center relative">
        <span className={`${active ? 'primary-color' : 'text-main'} text-sm`}>
          {children}
        </span>
        {!isMobile && !sidebarExpanded && (
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-6 z-10 hidden group-hover:inline-block sidebar-expanded-colors text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
            {label}
          </span>
        )}
      </div>
      {sidebarExpanded && (
        <p className="text-main text-xs font-medium">{label}</p>
      )}
    </Link>
  );
};
