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

  const getTitleByText = text => {
    let title = text?.charAt(0);
    const array = text?.split(' ');
    title += array.length > 1 ? array[1]?.charAt(0) : text?.charAt(1) || '';
    title = title.toUpperCase();
    return title;
  };

  const getColorByText = text => {
    const key = getKeyByText(text);
    const sum = [...key].reduce((acc, char) => acc + char.codePointAt(0), 0);
    const position = sum % colors.length;
    const color = colors[position];

    return `${color} text-white`;
  };

  return {
    getTitleByText,
    getColorByText,
    getKeyByText,
  };
}
