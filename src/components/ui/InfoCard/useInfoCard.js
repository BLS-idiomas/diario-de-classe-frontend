export function useInfoCard() {
  const getClassName = (index, column) => {
    const className = ['text-sm'];
    const { type } = column;

    switch (index) {
      case 0:
        className.push('');
      case 1:
        className.push('mt-2');
      default:
        className.push('mt-1');
    }

    switch (type) {
      case 'header':
        className.push('text-gray-500');
      case 'bold':
        className.push('font-medium');
      default:
        className.push('text-gray-600');
    }

    return className.join(' ');
  };

  const getBgColor = color => {
    const colors = {
      gray: 'bg-gray-50',
      white: 'bg-white',
    };

    return colors[color] || colors.gray;
  };

  return {
    getClassName,
    getBgColor,
  };
}
