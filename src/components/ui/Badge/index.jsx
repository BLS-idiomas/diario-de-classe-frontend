export const Badge = ({ icon, text, color }) => {
  const icons = {
    lock: '🔐',
    calendar: '📅',
    star: '⭐',
    check: '✅',
    alert: '⚠️',
    info: 'ℹ️',
  };

  const colors = {
    gray: 'bg-gray-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
  };

  const iconToUse = icons[icon] || icons.info;
  const colorClass = colors[color] || colors.blue;
  return (
    <span className={`px-2 py-1 ${colorClass} rounded text-sm`}>
      {iconToUse} {text}
    </span>
  );
};
