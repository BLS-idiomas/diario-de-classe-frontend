export function useAvatar() {
  const colors = [
    'bg-red-400',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-600',
    'bg-purple-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ];

  const getKeyByText = text => {
    return text.replaceAll(' ', '-') + '-avatar-key';
  };

  const getColorCache = id => {
    return localStorage.getItem(id) || null;
  };

  const saveColorCache = (id, color) => {
    localStorage.setItem(id, color);
  };

  const getTitleByText = text => {
    let title = text?.charAt(0);
    const array = text?.split(' ');
    title += array.length > 1 ? array[1]?.charAt(0) : text?.charAt(1) || '';
    title = title.toUpperCase();
    return title;
  };

  const getColorByText = text => {
    const id = getKeyByText(text);
    let color = getColorCache(id);

    if (!color) {
      const position = Math.floor(Math.random() * colors.length);
      color = colors[position];
      saveColorCache(id, color);
    }

    return `${color} text-white`;
  };

  return {
    getTitleByText,
    getColorByText,
    getKeyByText,
  };
}
